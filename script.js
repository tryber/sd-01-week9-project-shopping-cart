function cartItemClickListener(event) {
  const LPSelected = event.target
  LPSelected.parentNode.removeChild(LPSelected)
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const changeItemClass = (classItem) => document.querySelector(`.${classItem}`)
function API() {
  const API_KEY = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${localStorage.api}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`
  fetch(API_KEY, {
    headers: { Accept: 'application/json' }
  })
    .then((response) => response.json())
    .then((data) => data.products.forEach(element => {
      const fullElement = createProductItemElement(element)
      changeItemClass('items').appendChild(fullElement)

      fullElement.lastChild.addEventListener('click', () => {
        const cart = document.querySelector('.cart__items')
        const NEW_API = `https://api.bestbuy.com/v1/products(sku=${element.sku})?apiKey=${localStorage.api}&sort=sku.asc&show=sku,name,salePrice&format=json`
        fetch(NEW_API)
          .then(responseNewAPI => responseNewAPI.json())
          .then((newData) => {
            const addLocalStorage = createCartItemElement(newData.products[0]);
            localStorage.setItem('archive', addLocalStorage.innerHTML);
            cart.appendChild(addLocalStorage);
          });
      });
    }));
}

function consumerName() {
  const inputConsumer = document.querySelector('.input-name')
  inputConsumer.addEventListener('change', () => {
    sessionStorage.setItem('consumer', inputConsumer.value)
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


window.onload = function onload() {
  API()
  consumerName()
}
