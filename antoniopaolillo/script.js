
function saveName() {
  const inputName = document.getElementsByClassName('input-name')[0];
  inputName.addEventListener('blur', () => sessionStorage.setItem('name', inputName.value));
}

function setCookie() {
  const inputTermsAgree = document.getElementsByClassName('input-terms')[0];
  const days = 7;
  inputTermsAgree.addEventListener('change', () => {
    const expires = new Date(Date.now() + (days * 864e5)).toUTCString();
    document.cookie = `terms-agree =${encodeURIComponent(inputTermsAgree.checked)}; expires= ${expires}; path=/`;
  });
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

function gerateTotalPrice(value) {
  const scoreboard = document.getElementsByClassName('cart__title')[0];
  const scoreboardValuePosition = scoreboard.innerText.split('$')[1];
  let finalPrice = Number(scoreboardValuePosition) + Number(value);
  if (finalPrice < 0) {
    finalPrice = 0;
  }
  scoreboard.innerText = `Carrinho de compras, preço total: $${Math.round(finalPrice * 100) / 100}`;
  localStorage.setItem('price', finalPrice);
}

function cartItemClickListener(event) {
  const objectSku = event.target.innerText.substring(5, 13);
  const localStoragePosition = Object.keys(localStorage)
    .find(pos => localStorage[pos] === objectSku);
  gerateTotalPrice(-event.target.innerHTML.split('$')[1]);
  localStorage.removeItem(localStoragePosition);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


function gerateLocalStoragePosition() {
  let localStorageLength = localStorage.length;
  while (localStorage[localStorageLength]) {
    localStorageLength += 1;
  }
  return localStorageLength;
}

function addProductToCart(newProduct, product, acessApiKey) {
  newProduct.lastChild.addEventListener('click', () => {
    fetch(`https://api.bestbuy.com/v1/products(sku=${product.sku})?apiKey=${acessApiKey}&sort=sku.asc&show=sku,name,salePrice&format=json`)
      .then(response => response.json())
      .then((data) => {
        document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(data.products[0]));
        localStorage.setItem(`${gerateLocalStoragePosition()}`, data.products[0].sku);
        gerateTotalPrice(data.products[0].salePrice);
      })
      .catch(error => console.log(error));
  });
}

async function gerateProducts() {
  const acessApiKey = localStorage.getItem('apiKey');
  const api = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${acessApiKey}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;
  await fetch(api)
    .then(response => response.json())
    .then(data => data.products.forEach((product) => {
      const newProduct = createProductItemElement(product);
      document.getElementsByClassName('items')[0].appendChild(newProduct);
      newProduct.lastChild.addEventListener('click', addProductToCart(newProduct, product, acessApiKey));
    }))
    .catch(error => console.log(error));
}


function loadLocalStorage() {
  const localStorageKeys = Object.keys(localStorage);
  localStorageKeys.forEach((localStorageNewPosition) => {
    if (localStorageNewPosition !== 'apiKey' && localStorageNewPosition !== 'price') {
      fetch(`https://api.bestbuy.com/v1/products(sku=${localStorage[localStorageNewPosition]})?apiKey=${localStorage.apiKey}&sort=sku.asc&show=sku,name,salePrice&format=json`)
        .then(response => response.json())
        .then((data) => {
          document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement(data.products[0]));
          document.getElementsByClassName('cart__title')[0].innerText = `Carrinho de
            compras, preço total: $${Math.round(localStorage.price * 100) / 100}`;
        })
        .catch(error => console.log(error));
    }
  });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function clearStorage() {
  const apiKey = localStorage.apiKey;
  localStorage.clear();
  localStorage.apiKey = apiKey;
}

function createDeleteCartButton() {
  const cart = document.getElementsByClassName('cart')[0];
  const newButton = document.createElement('button');
  newButton.innerHTML = 'Limpar Carrinho de Compras';
  newButton.addEventListener('click', () => {
    const productsArray = document.getElementsByClassName('cart__item');
    Object.values(productsArray).forEach(product => product.remove());
    document.getElementsByClassName('cart__title')[0].innerText = 'Carrinho de compras, preço total: $0';
    clearStorage();
  });
  cart.appendChild(newButton);
}

function createPriceStorage() {
  if (!localStorage.price) {
    localStorage.setItem('price', 0);
  }
}

function customCartTitle() {
  const scoreboard = document.getElementsByClassName('cart__title')[0];
  scoreboard.innerText = 'Carrinho de compras, preço total: $';
}

window.onload = function onload() {
  saveName();
  setCookie();
  gerateProducts();
  loadLocalStorage();
  createDeleteCartButton();
  createPriceStorage();
  customCartTitle();
};

