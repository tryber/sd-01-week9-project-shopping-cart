function addLoading() {
  createLoading = document.createElement('h1');
  createLoading.innerHTML = 'Loading...';
  document.getElementsByClassName('top-bar')[0].appendChild(createLoading);
}

const removeLoading = () => document.getElementsByClassName('top-bar')[0].lastChild.remove();

function saveNameUserInBrowser() {
  document.querySelector('.input-terms').addEventListener('click', () => {
    const nameUser = document.querySelector('.input-name').value;
    sessionStorage.setItem('nameUser', nameUser);
  });
}

function cartPrice(value) {
  const shopCart = document.getElementsByClassName('cart__title')[0];
  let currentPrice = shopCart.innerText.split('$')[1];
  if (isNaN(currentPrice)) currentPrice = 0;
  let totalPrice = Number(currentPrice) + Number(value);
  if (totalPrice < 0) totalPrice = 0;

  shopCart.innerText = `Carrinho de compras
  Valor Final: $${Math.round(totalPrice * 100) / 100}`;
  localStorage.setItem('price', totalPrice);
}

function cartItemClickListener(event) {
  const localStorageItem = Object.keys(localStorage)
    .find(item => localStorage[item] === event.target.innerText.substring(5, 13));
  cartPrice(-event.target.innerHTML.split('$')[1]);
  localStorage.removeItem(localStorageItem);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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

let cont = 0;

function addItemToShoppingCart(API_KEY, sku, addNewProduct) {
  addNewProduct.addEventListener('click', () => {
    API_URL = `https://api.bestbuy.com/v1/products(sku=${sku})?apiKey=${API_KEY}&sort=sku.asc&show=sku,name,salePrice&format=json`;
    fetch(API_URL, { headers: { Accept: 'application/json' } })
      .then(response => response.json())
      .then((data) => {
        document.querySelectorAll('.cart__items')[0].appendChild(createCartItemElement(data.products[0]));
        localStorage.setItem(`produto${cont}`, data.products[0].sku);
        cartPrice(data.products[0].salePrice);
      })
      .catch(error => console.log(error));
  })
}

function getApiKeyValues() {
  const API_KEY = localStorage.getItem('APIKey');
  const API_URL = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;

  fetch(API_URL, { headers: { Accept: 'application/json' } })
    .then(response => response.json())
    .then(data => data.products.forEach((product) => {
      const addNewProduct = createProductItemElement(product);
      document.querySelectorAll('.items')[0].appendChild(addNewProduct);
      addNewProduct.lastChild.addEventListener('click', () => {
        if (localStorage.length <= 2) cont = 0;
        addItemToShoppingCart(API_KEY, product.sku, addNewProduct);
        cont += 1;
      });
    }))
    .then(() => removeLoading())
    .catch(error => console.log(error));
}

function loadCart() {
  const API_KEY = localStorage.getItem('APIKey');
  Object.keys(localStorage).forEach((key) => {
    if (key !== 'API' && key !== 'price') {
      fetch(`https://api.bestbuy.com/v1/products(sku=${localStorage[key]})?apiKey=${API_KEY}&sort=sku.asc&show=sku,name,salePrice&format=json`)
      .then(response => response.json())
      .then((data) => {
        document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(data.products[0]));
        document.getElementsByClassName('cart__title')[0].innerText = `Carrinho de compras
        Valor Final: $${Math.round(localStorage.price * 100) / 100}`;
      });
    }
  });
}

window.onload = function onload() {
  saveNameUserInBrowser();
  getApiKeyValues();
  addLoading();
  loadCart();
};
