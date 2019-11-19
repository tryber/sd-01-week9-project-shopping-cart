const API_KEY = localStorage.token;
const urlAPI = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;

nameInputChange = () => {
  const nameInput = document.querySelector('.input-name');
  nameInput.addEventListener('input', () => {
    sessionStorage.name = nameInput.value;
  });
};

saveProduct = (value) => {
  localStorage.setItem(localStorage.length, value);
};

removeProductCart = value =>
  Object.keys(localStorage).find(num => localStorage[num] === value);

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}
async function catchApi() {
  const response = await fetch(urlAPI);
  const json = await response.json();
  return json;
}
function cartItemClickListener(event) {
  localStorage.removeItem(removeProductCart(event.target.innerHTML));
  event.target.remove();
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
catchApi()
  .then((response) => {
    console.log('yay');
    response.products.forEach((el) => {
      const product = createProductItemElement(el);
      document.querySelector('.items').appendChild(product);
      product.lastChild.addEventListener('click', () => {
        fetch(
          `https://api.bestbuy.com/v1/products(sku=${el.sku})?apiKey=${API_KEY}&sort=sku.asc&show=sku,name,salePrice&format=json`,
        )
          .then(result => result.json())
          .then((data) => {
            const productCart = document
              .getElementsByClassName('cart__items')[0]
              .appendChild(createCartItemElement(data.products[0]));
            saveProduct(productCart.innerHTML);
            removeProductCart(productCart.innerHTML);
          });
      });
    });
  })
  .catch((error) => {
    console.log('error');
    console.error(error);
  });

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  catchApi();
  nameInputChange();
  saveName();
  createProductImageElement();
  createCustomElement();
  createProductItemElement();
  createCartItemElement();
  cartItemClickListener();
  catchCart();
};
