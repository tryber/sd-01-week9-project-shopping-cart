function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function cartItemClickListener(event) {
  let ind = 0;
  document.getElementsByClassName('cart__items')[0].removeChild(event.target);
  Object.keys(localStorage).forEach((key) => {
    if (localStorage.getItem(key) === event.target.outerHTML && ind === 0) {
      localStorage.removeItem(key);
      ind += 1;
    }
  })
  setTimeout(() => {
    sumPrice();
  }, 1000);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function restoreValues() {
  document.getElementsByClassName('input-name')[0].value = sessionStorage.getItem('user_name');
  document.getElementsByClassName('input-terms')[0].checked = (convertArrayToObject(document.cookie.split(";")).checked == 'true');
}

function storeInput() {
  document.getElementsByClassName('input-name')[0].addEventListener('change', event => {
    sessionStorage.setItem('user_name', event.target.value);
  })
}

function storeCheckbox() {
  document.getElementsByClassName('input-terms')[0].addEventListener('change', event => {
    event.target.checked ? createCookies('checked', true, " Tue, 01 Jan 2115 12:00:00 UTC") : createCookies("checked", false, "Tue, 01 Jan 2115 12:00:00 UTC");
  })
}

function createCookies(name, value, expires) {
  const date_expires = `expires= ${expires}`;
  document.cookie = name + "=" + value + "; " + date_expires;
}


function convertArrayToObject(array) {
  return array.reduce((obj, item) => {
    const keyValue = item.split("=");
    keyValue[0].charAt(0) == " " ? obj[keyValue[0].substring(1)] = keyValue[1] : obj[keyValue[0]] = keyValue[1];
    return obj;
  }, {});
};


function generateProduct() {
  return new Promise(
    (resolve, reject) => {
      $.getJSON(
        `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${localStorage.getItem('APIkey')}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`,
        (data) => {
          data.products.forEach((elm_obj) => {
            document.getElementsByClassName('items')[0].appendChild(createProductItemElement(elm_obj));
          })
        }
      )
    })
}

function buttonListener() {
  let buttons = document.getElementsByClassName('item__add');
  for (i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", event => {
      addShoppingCar(event.target.parentNode.firstElementChild.innerText);
      setTimeout(() => {
        sumPrice();
      }, 1000);
    })
  }
}


function displayFunctions() {
  generateProduct();
  setTimeout(() => {
    buttonListener();
  }, 1000);
}


function addShoppingCar(SKU) {
  return new Promise(
    (resolve, reject) => {
      $.getJSON(
        `https://api.bestbuy.com/v1/products(sku=${SKU})?apiKey=${localStorage.getItem('APIkey')}&sort=sku.asc&show=sku,name,salePrice&format=json`,
        (data) => {
          document.getElementsByClassName("cart__items")[0].appendChild(createCartItemElement(data.products[0]));
          createCartItemElement(data.products[0]).addEventListener("click", cartItemClickListener);
          localStorage.setItem("ind", parseInt(localStorage.getItem("ind")) + 1);
          localStorage.setItem(parseInt(localStorage.getItem("ind")), createCartItemElement(data.products[0]).outerHTML);
        }
      )
    })
}

function displayList() {
  const newArray = new Array;
  for (i = 0; i < Object.keys(localStorage).length; i++) {
    if (localStorage.getItem(Object.keys(localStorage)[i]).charAt(0) == "<") {
      newArray.push(Object.keys(localStorage)[i]);
      newArray.sort((a, b) => a - b);
    }
  }
  newArray.forEach((key) => document.getElementsByClassName("cart__items")[0].innerHTML += localStorage.getItem(key));
  for (i = 0; i < document.getElementsByClassName("cart__item").length; i++) {
    document.getElementsByClassName("cart__item")[i].addEventListener("click", cartItemClickListener);
  }
  setTimeout(() => {
    sumPrice();
  }, 1000);
}

function clean() {
  let range = document.getElementsByClassName('cart__item').length;
  for (i = range - 1; i >= 0; i--) {
    document.getElementsByClassName('cart__items')[0].removeChild(document.getElementsByClassName("cart__item")[i]);
  }
  const array = Object.keys(localStorage).filter((key) => (key !== 'APIkey') && (key !== 'ind'));
  array.forEach((key) => localStorage.removeItem(key));
  setTimeout(() => {
    sumPrice();
  }, 1000);
}

function sumPrice() {
  const array = Object.keys(localStorage).filter((key) => (key !== 'APIkey') && (key !== 'ind'));
  const newArray = new Array;
  array.forEach((key) =>
    newArray.push(
      localStorage.getItem(key).charAt(localStorage.getItem(key).length - 10) +
      localStorage.getItem(key).charAt(localStorage.getItem(key).length - 9) +
      localStorage.getItem(key).charAt(localStorage.getItem(key).length - 8) +
      localStorage.getItem(key).charAt(localStorage.getItem(key).length - 7) +
      localStorage.getItem(key).charAt(localStorage.getItem(key).length - 6)
    ));
  const sum = newArray.reduce((total, price) => Number(total) + Number(price), 0).toFixed(2);
  document.getElementById("price").innerHTML = `Preço total: $${sum}`;
}

window.onload = function onload() {
  if (typeof Storage !== "undefined") {
    restoreValues();
    storeInput();
    storeCheckbox();
    displayFunctions();
    displayList();
  } else {
    console.log("No web storage support");
  }
}