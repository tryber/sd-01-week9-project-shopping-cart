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

function getListing() {
  const API_KEY = getAPI()
  const API_URL = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`
  fetch (API_URL)
    .then(response => response.json().then(object => object.products.forEach (item => {
      const newItem = createProductItemElement(item)
      const itemSection = document.querySelector('.items')
      itemSection.appendChild(newItem)
    })))
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
