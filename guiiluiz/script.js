const script = document.createElement('script');

script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.integrity = 'sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=';
script.crossOrigin = 'anonymous';
document.getElementsByTagName('head')[0].appendChild(script);

window.onload = function onload() {
  const apiKey = localStorage.apiKey;
  const productsEndPoint = `https://api.bestbuy.com/v1/products(releaseDate>today&
categoryPath.id in(cat02001))?apiKey=${apiKey}&format=json&
pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;
  const inputName = document.querySelector('.input-name');
  const itemsSection = document.querySelector('.items');

  inputName.addEventListener('input', () => {
    sessionStorage.name = inputName.value;
  })

  $.getJSON(productsEndPoint, (data) => {
  data.products.forEach((product,index) => {
    itemsSection.appendChild(createProductItemElement(product));
    document.getElementsByClassName('item__add')[index].addEventListener('click', () => {
      if (localStorage.shopList == undefined) {
        localStorage.shopList = JSON.stringify(product.sku);
      }else {
        localStorage.shopList += JSON.stringify(product.sku);
      }
      $.getJSON(`https://api.bestbuy.com/v1/products(sku=${product.sku})?apiKey=${apiKey}&sort=sku.asc&show=sku,name,salePrice&format=json`, (selected) => {
        document.querySelector(".cart__items").appendChild(createCartItemElement(selected.products[0]));
        })
      })
    index++
    })
  })
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

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target)
  let productSku = event.target.innerText.substring(5, 13)
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
