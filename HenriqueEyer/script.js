window.onload = function onload() {
  const getApi = () => localStorage.getItem('api');

  function gerateLocalStoragePosition() {
    let localStorageLength = localStorage.length;
    while (localStorage[localStorageLength]) {
      localStorageLength++;
    }
    return localStorageLength;
  }

  const setKeyStorageCar = ({ sku }) => {
    localStorage[gerateLocalStoragePosition()] = sku
  };

  const removeItemCar = value => Object.keys(localStorage)
    .find(num => localStorage[num] === `${value}`);

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
    const value = (event.target.innerText.substring(5, 13));
    localStorage.removeItem(removeItemCar(value));
    event.target.parentNode.removeChild(event.target);
  }

  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }


  function saveUser(value) {
    sessionStorage['user'] = value;
  }

  const returnElementByClass = name => document.querySelector(`.${name}`);

  returnElementByClass('input-name').addEventListener('change', () => {
    saveUser(returnElementByClass('input-name').value);
  });

  function createProducts(json) {
    const father = document.querySelector('.items');
    const ol = document.querySelector('.cart__items');

    json.products.forEach((element) => {
      const produto = createProductItemElement(element);

      father.appendChild(produto);
      produto.lastChild.addEventListener('click', (event) => {
        console.log(event)
        const url = `https://api.bestbuy.com/v1/products(sku=${getSkuFromProductItem(produto)})?apiKey=${getApi()}&sort=sku.asc&show=sku,name,salePrice&format=json`;
        catchDados(url)
          .then(response => {
            setKeyStorageCar(response['products'][0]);
            ol.appendChild(createCartItemElement(response['products'][0]));
          })
          .catch(error => {
            console.log('error');
            console.log(error);
          });
      })
    });
  }

  function loadCar() {
    const ol = document.querySelector('.cart__items');
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key !== 'api') {
        const url = `https://api.bestbuy.com/v1/products(sku=${localStorage[key]})?apiKey=${getApi()}&sort=sku.asc&show=sku,name,salePrice&format=json`
        catchDados(url)
          .then((response) => {
            ol.appendChild(createCartItemElement(response.products[0]));
          })
          .catch((error) => {
            console.log('error');
            console.log(error);
          });
      }
    }
  }

  loadCar();
  const API_URL = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${getApi()}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;
  catchDados(API_URL)
    .then((response) => {
      createProducts(response);
    })
    .catch((error) => {
      console.log('error');
      console.log(error);
    });

  async function catchDados(url) {
    const response = await fetch(url, {
      headers: { 'Accept': "application/json" }
    })
    const json = await response.json();
    return json;
  }
}
