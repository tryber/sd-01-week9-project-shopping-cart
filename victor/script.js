window.onload = function onload() {
  saveNameUserInBrowser()
  getApiKeyValues()
};

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
  document.querySelector('.items').appendChild(section)
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function saveApiKey() {
  return localStorage.getItem("APIKey")
}

function saveNameUserInBrowser() {
  document.querySelector(".input-terms").addEventListener('click', () => {
    const nameUser = document.querySelector('.input-name').value
    sessionStorage.setItem("nameUser", nameUser)
  })
}

function getApiKeyValues() {
  const API_KEY = saveApiKey()
  const API_URL = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`
  
  fetch(API_URL, {
    headers: { Accept: "application/json" }
  })
  .then((response) => response.json())
  .then((data) => { data.products.map(products => createProductItemElement(products)) })
}
