function saveNameUserInBrowser() {
  document.querySelector('.input-terms').addEventListener('click', () => {
    const nameUser = document.querySelector('.input-name').value;
    sessionStorage.setItem('nameUser', nameUser);
  });
}

function getApiKeyValues() {
  const API_KEY = localStorage.getItem('APIKey');
  const API_URL = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;

  fetch(API_URL, { headers: { Accept: 'application/json' } })
  .then(response => response.json())
  .then(data => data.products.map((product) => {
    const addNewProduct = createProductItemElement(product);
    document.querySelectorAll('.items')[0].appendChild(addNewProduct);
    addNewProduct.addEventListener('click', addItemToShoppingCart(API_KEY, product.sku, addNewProduct));
  }))
  .catch(error => console.log(error));
}

function addItemToShoppingCart(API_KEY, sku, addNewProduct) {
  addNewProduct.addEventListener('click', () => {
    API_URL = `https://api.bestbuy.com/v1/products(sku=${sku})?apiKey=${API_KEY}&sort=sku.asc&show=sku,name,salePrice&format=json`;
    fetch(API_URL, { headers: { Accept: 'application/json' } })
    .then(response => response.json())
    .then(data => document.querySelectorAll('.cart__items')[0].appendChild(createCartItemElement(data.products[0])))
    .then(addCartInLocalStorage(sku))
    .then(removeCartInLocalStorage(sku));
  });
}

const itensArray = [];

function addCartInLocalStorage(sku) {
  itensArray.push(sku);
  localStorage.setItem('itens', JSON.stringify(itensArray));
  console.log(itensArray);
}

function removeCartInLocalStorage() {
  JSON.parse(localStorage.getItem('itens'));
  console.log(itensArray);
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
  document.querySelectorAll('.cart__items')[0].removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  saveNameUserInBrowser();
  getApiKeyValues();
};
