function addLoading() {
  createLoading = document.createElement('span');
  createLoading.className = 'loading';
  createLoading.innerHTML = 'Loading...';
  document.getElementsByClassName('items')[0].appendChild(createLoading);
}

const removeLoading = () => document.getElementsByClassName('loading')[0].remove();

function saveName() {
  const inputName = document.querySelector('.input-name');
  inputName.addEventListener('input', () => sessionStorage.setItem('name', inputName.value));
}

function cartPrice(value) {
  const shopCart = document.getElementsByClassName('cart__title')[0];
  let currentPrice = shopCart.innerText.split('$')[1];
  if (isNaN(currentPrice)) currentPrice = 0;
  let finalPrice = Number(currentPrice) + Number(value);
  if (finalPrice < 0) finalPrice = 0;

  shopCart.innerText = `Carrinho de compras
  Valor Final: $${Math.round(finalPrice * 100) / 100}`;
  localStorage.setItem('price', finalPrice);
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

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

let cont = 0;

function addProductToCart(product, apiKey) {
  fetch(`https://api.bestbuy.com/v1/products(sku=${product.sku})?apiKey=${apiKey}&sort=sku.asc&show=sku,name,salePrice&format=json`)
    .then(response => response.json())
    .then((data) => {
      document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(data.products[0]));
      localStorage.setItem(`produto${cont}`, data.products[0].sku);
      cartPrice(data.products[0].salePrice);
    })
    .catch(error => console.log(error));
}

function listProducts() {
  const apiKey = localStorage.API;
  const url = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${apiKey}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;
  fetch(url)
    .then(response => response.json())
    .then(data => data.products.forEach((product) => {
      const newProduct = createProductItemElement(product);
      document.getElementsByClassName('items')[0].appendChild(newProduct);
      newProduct.lastChild.addEventListener('click', () => {
        if (localStorage.length <= 2) cont = 0;
        addProductToCart(product, apiKey);
        cont += 1;
      });
    }))
    .then(() => removeLoading())
    .catch(error => console.log(error));
}

function loadCartItems() {
  Object.keys(localStorage).forEach((key) => {
    if (key !== 'API' && key !== 'price') {
      fetch(`https://api.bestbuy.com/v1/products(sku=${localStorage[key]})?apiKey=${localStorage.API}&sort=sku.asc&show=sku,name,salePrice&format=json`)
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
  addLoading();
  saveName();
  listProducts();
  loadCartItems();
};
