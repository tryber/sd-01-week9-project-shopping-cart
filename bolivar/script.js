function setInd() {
  return new Promise((resolve) => {
    const ind = Number(localStorage.getItem('ind'));
    if (!ind) {
      localStorage.setItem('ind', 0);
      resolve('Index stored with sucess');
    } else {
      resolve('Index in local stored');
    }
  });
}

function storeInput() {
  document.getElementsByClassName('input-name')[0].addEventListener('change', (event) => {
    sessionStorage.setItem('user_name', event.target.value);
  });
}

function createCookies(name, value, expires) {
  const dateExpires = `expires= ${expires}`;
  document.cookie = `${name} = ${value} ; ${dateExpires}`;
}

function storeCheckbox() {
  document.getElementsByClassName('input-terms')[0].addEventListener('click', (event) => {
    if (event.target.checked) {
      createCookies('checked', true, ' Tue, 01 Jan 2115 12:00:00 UTC');
    } else {
      createCookies('checked', false, 'Tue, 01 Jan 2115 12:00:00 UTC');
    }
  });
}

function convertArrayToObject(array) {
  const arr = array;
  return arr.reduce((obj, item) => {
    const objs = obj;
    const keyValue = item.split('=');
    if (keyValue[0].charAt(0) === ' ') {
      objs[keyValue[0].substring(1)] = keyValue[1];
    } else {
      objs[keyValue[0]] = keyValue[1];
    }
    return obj;
  }, {});
}

function restoreValues() {
  document.getElementsByClassName('input-name')[0].value = sessionStorage.getItem('user_name');
  document.getElementsByClassName('input-terms')[0].checked = (convertArrayToObject(document.cookie.split(';')).checked === 'true');
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

function generateProduct() {
  return new Promise(
    (resolve) => {
      $.getJSON(
        `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${localStorage.getItem('APIkey')}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`,
        (data) => {
          data.products.forEach((elm) => {
            document.getElementById('loading').innerHTML = 'loading...';
            setTimeout(() => {
              document.getElementsByClassName('items')[0].appendChild(createProductItemElement(elm));
              resolve();
            }, 3000);
          });
        },
      );
    });
}


function sumPrice() {
  const array = Object.keys(localStorage).filter(key => key !== 'APIkey' && key !== 'ind');
  const newArray = [];
  array.forEach(key =>
    newArray.push(localStorage.getItem(key).split('$')[1].split('<')[0]));
  const sum = newArray.reduce((total, price) => Number(total) + Number(price), 0).toFixed(2);
  document.getElementById('price').innerHTML = `Preço total: $${sum}`;
}

function cleanLoading() {
  document.getElementById('loading').innerHTML = '';
}

function cartItemClickListener(event) {
  let ind = 0;
  document.getElementsByClassName('cart__items')[0].removeChild(event.target);
  Object.keys(localStorage).forEach((key) => {
    if (localStorage.getItem(key) === event.target.outerHTML && ind === 0) {
      localStorage.removeItem(key);
      ind += 1;
    }
  });
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

function addShoppingCar(SKU) {
  return new Promise(
    () => {
      $.getJSON(
        `https://api.bestbuy.com/v1/products(sku=${SKU})?apiKey=${localStorage.getItem('APIkey')}&sort=sku.asc&show=sku,name,salePrice&format=json`,
        (data) => {
          document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(data.products[0]));
          createCartItemElement(data.products[0]).addEventListener('click', cartItemClickListener);
          localStorage.setItem('ind', parseInt(localStorage.getItem('ind'), 0) + 1);
          localStorage.setItem(parseInt(localStorage.getItem('ind'), 0), createCartItemElement(data.products[0]).outerHTML);
        },
      );
    });
}

function promiseButton(event) {
  return new Promise((resolve) => {
    document.getElementById('loading').innerHTML = 'loading...';
    addShoppingCar(event.target.parentNode.firstElementChild.innerText);
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

function buttonListener() {
  const buttons = document.getElementsByClassName('item__add');
  for (i = 0; i < buttons.length; i += 1) {
    buttons[i].addEventListener('click', (event) => {
      promiseButton(event).then(() => {
        sumPrice();
        cleanLoading();
      });
    });
  }
}

function displayList() {
  return new Promise((resolve) => {
    const newArray = [];
    for (i = 0; i < Object.keys(localStorage).length; i += 1) {
      if (localStorage.getItem(Object.keys(localStorage)[i]).charAt(0) === '<') {
        newArray.push(Object.keys(localStorage)[i]);
        newArray.sort((a, b) => a - b);
      }
    }
    newArray.forEach((key) => {
      document.getElementsByClassName('cart__items')[0].innerHTML += localStorage.getItem(key);
      return 0;
    });
    for (i = 0; i < document.getElementsByClassName('cart__item').length; i += 1) {
      document.getElementsByClassName('cart__item')[i].addEventListener('click', cartItemClickListener);
    }
    resolve();
  });
}

function clean() {
  const range = document.getElementsByClassName('cart__item').length;
  for (i = range - 1; i >= 0; i -= 1) {
    document.getElementsByClassName('cart__items')[0].removeChild(document.getElementsByClassName('cart__item')[i]);
  }
  const array = Object.keys(localStorage).filter(key => (key !== 'APIkey') && (key !== 'ind'));
  array.forEach(key => localStorage.removeItem(key));
  setTimeout(() => {
    sumPrice();
  }, 1000);
}

async function asyncCall() {
  const respSetInd = await setInd();
  console.log(respSetInd);
  storeInput();
  storeCheckbox();
  restoreValues();
  await generateProduct();
  cleanLoading();
  setTimeout(() => {
    buttonListener();
  }, 1000);
  displayList().then(() => sumPrice());
  document.getElementById('button-clean').addEventListener('click', clean);
}

window.onload = function onload() {
  if (typeof Storage !== 'undefined') {
    asyncCall();
  } else {
    console.log('No web storage support');
  }
};
