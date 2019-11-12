window.onload = function onload() {
  function storeName () {
    const nameInput = document.querySelector('.input-name')
    nameInput.addEventListener('change', (event) => sessionStorage.setItem('name', event.target.value))
  }

  function termsAgreementCookies() {
    const termsAgreementCheckbox = document.querySelector('.input-terms')
    termsAgreementCheckbox.addEventListener('change', () => {
      if (event.target.checked) {
        setCookie('terms_agreement', true, 365)
      } else {
        setCookie('terms_agreement', false, 365)
      }
    })
  }

  storeName()
  termsAgreementCookies()
  getListing()
  loadShoppingCart()
  removeButton()
};

function getAPI () {
  return localStorage.getItem('API_KEY')
}

function setCookie(name, value, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = d.toUTCString()
  document.cookie = `${name}=${value};expires=${expires};path=/`
}

function refreshLocalStorage() {
  const cartList = document.querySelectorAll('.cart__items')
  const cartChildren = cartList[0].children
  const usedIndexesArray = []

  for (let index = 0; index < cartChildren.length ; index++) {
    localStorage.setItem(index, cartChildren[index].innerText)
    usedIndexesArray.push(index.toString())
    console.log(typeof usedIndexesArray[0])
  }

  Object.keys(localStorage).forEach(key => {
    if (key !== 'API_KEY' && !usedIndexesArray.includes(key)) {
      localStorage.removeItem(key)
    }
  })
}

function loadShoppingCart() {
  Object.keys(localStorage).forEach(key => {
    if (key !== 'API_KEY') {
      const itemArray = localStorage.getItem(key).split('|')
      const newItemObj = {
        sku : itemArray[0].slice(5,-2),
        name : itemArray[1].slice(7,-1),
        salePrice: itemArray[2].slice(9)
      }
      const newCarItem = createCartItemElement(newItemObj)
      const cartList = document.querySelector('.cart__items')
      cartList.appendChild(newCarItem)
    }
  })
}

function addToCart(SKU) {
  const API_KEY = getAPI(),
        API_URL = `https://cors-anywhere.herokuapp.com/https://api.bestbuy.com/v1/products(sku=${SKU})?apiKey=${API_KEY}&sort=sku.asc&show=sku,name,salePrice&format=json`
  fetch(API_URL)
    .then(response => response.json().then(object => {
      const newCarItem = createCartItemElement(object.products[0])
      const cartList = document.querySelector('.cart__items')
      cartList.appendChild(newCarItem)
      refreshLocalStorage()
      }))
}

function getListing() {
  const API_KEY = getAPI(),
        API_URL = `https://cors-anywhere.herokuapp.com/https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`
        fetch (API_URL)
    .then(response => response.json().then(object => object.products.forEach (item => {
      const newItem = createProductItemElement(item)
      const itemSection = document.querySelector('.items')
      newItem.lastChild.addEventListener('click', () => addToCart(item.sku))
      itemSection.appendChild(newItem)
    })))
}

function removeButton() {
  const removeButton = document.querySelector('.remove__button')
  const cartItems = document.querySelectorAll('.cart__item')
  removeButton.addEventListener('click', () => {
    cartItems.forEach((item) => item.remove())
    refreshLocalStorage()
  })
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  event.target.remove();
  refreshLocalStorage()
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
