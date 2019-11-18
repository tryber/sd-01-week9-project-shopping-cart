function storeName() {
  const nameInput = document.querySelector('.input-name');
  nameInput.async = true;
  nameInput.addEventListener('change', event => sessionStorage.setItem('name', event.target.value));
}

function createLoader() {
  const cartList = document.querySelector('.cart__items');
  const loaderDiv = document.createElement('div');
  loaderDiv.className = 'lds-roller';
  loaderDiv.innerText = 'Loading...';
  for (let div = 0; div < 8; div += 1) {
    const animationDiv = document.createElement('div');
    loaderDiv.appendChild(animationDiv);
  }
  cartList.appendChild(loaderDiv);
}

function setCookie(name, value, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = d.toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/`;
}

function getAPI() {
  return localStorage.getItem('API_KEY');
}

function termsAgreementCookies() {
  const termsAgreementCheckbox = document.querySelector('.input-terms');
  termsAgreementCheckbox.addEventListener('change', () => {
    if (event.target.checked) {
      setCookie('terms_agreement', true, 365);
    } else {
      setCookie('terms_agreement', false, 365);
    }
  });
}

function refreshTotalPrice() {
  let totalPrice = 0;
  const priceField = document.querySelector('.total__price');
  Object.keys(localStorage).forEach((key) => {
    if (key !== 'API_KEY') {
      const actualItem = localStorage.getItem(key).split('$');
      const actualPrice = parseFloat(actualItem[1]);
      totalPrice += actualPrice;
    }
  });
  priceField.innerText = `Valor Total: $${totalPrice.toFixed(2)}`;
}

function refreshLocalStorage() {
  const cartList = document.querySelectorAll('.cart__item');
  const usedIndexesArray = [];

  for (let index = 0; index < cartList.length; index += 1) {
    localStorage.setItem(index, cartList[index].innerText);
    usedIndexesArray.push(index.toString());
  }

  Object.keys(localStorage).forEach((key) => {
    if (key !== 'API_KEY' && !usedIndexesArray.includes(key)) {
      localStorage.removeItem(key);
    }
  });

  refreshTotalPrice();
}

function cleanCart() {
  const clearCart = document.querySelector('.cleancart__button');
  clearCart.addEventListener('click', () => {
    const cartItems = document.querySelectorAll('.cart__item');
    cartItems.forEach(item => item.remove());
    refreshLocalStorage();
  });
}

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

function cartItemClickListener() {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(SKU) {
  const API_KEY = getAPI();
  const API_URL = `https://cors-anywhere.herokuapp.com/https://api.bestbuy.com/v1/products(sku=${SKU})?apiKey=${API_KEY}&sort=sku.asc&show=sku,name,salePrice&format=json`;
  fetch(API_URL)
    .then(response => response.json().then((object) => {
      const newCarItem = createCartItemElement(object.products[0]);
      const cartList = document.querySelector('.cart__items');
      newCarItem.addEventListener('click', () => {
        refreshLocalStorage();
      });
      cartList.appendChild(newCarItem);
      refreshLocalStorage();
    }))
    .then(() => {
      const loader = document.querySelector('.lds-roller');
      loader.className = '';
      loader.innerText = '';
    });
}

function getListing() {
  const API_KEY = getAPI();
  const API_URL = `https://cors-anywhere.herokuapp.com/https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;
  fetch(API_URL)
    .then(response => response.json().then(object => object.products.forEach((item) => {
      const newItem = createProductItemElement(item);
      const itemSection = document.querySelector('.items');
      newItem.lastChild.addEventListener('click', () => {
        createLoader();
        addToCart(item.sku);
      });
      itemSection.appendChild(newItem);
    })))
    .then(() => {
      const loader = document.querySelector('.lds-roller');
      loader.className = '';
      loader.innerText = '';
    });
}

function loadShoppingCart() {
  Object.keys(localStorage).forEach((key) => {
    if (key !== 'API_KEY') {
      const itemArray = localStorage.getItem(key).split('|');
      const newItemObj = {
        sku: itemArray[0].slice(5, -1),
        name: itemArray[1].slice(7, -1),
        salePrice: itemArray[2].slice(9),
      };
      const newCarItem = createCartItemElement(newItemObj);
      newCarItem.addEventListener('click', () => {
        refreshLocalStorage();
      });
      const cartList = document.querySelector('.cart__items');
      cartList.appendChild(newCarItem);
    }
  });
}

window.onload = function onload() {
  storeName();
  termsAgreementCookies();
  getListing();
  loadShoppingCart();
  cleanCart();
  refreshTotalPrice();
};
