
function addLoading() {
  newSpan = document.createElement('span');
  newSpan.className = 'loading';
  newSpan.innerHTML = 'Loading...';
  document.getElementsByClassName('top-bar')[0].appendChild(newSpan);
}
function removeLoading() {
  const loading = document.getElementsByClassName('loading')[0];
  if (loading) {
    loading.remove();
  }
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

function API_KEY() {
  return localStorage.getItem('API_KEY');
}

function saveNameInPage() {
  const nomeDeEntrada = document.getElementsByClassName('input-name')[0];
  nomeDeEntrada.addEventListener('keyup', function addName() {
    sessionStorage.setItem('Nome', this.value);
  });
}

function cartItemClickListener(event, value) {
  event.target.remove();
}

let carTotal = 0;
const paragrath = document.createElement('p');
function valueOfProduts(salePrice) {
  carTotal += salePrice;
  paragrath.innerText = `${carTotal.toFixed(2)}`;
  return paragrath;
}

function clearCarItem() {
  const button = document.getElementsByTagName('button')[0];
  button.addEventListener('click', () => {
    const elementOfCarItem = document.getElementsByClassName('cart__items')[0];
    while (elementOfCarItem.firstChild) {
      elementOfCarItem.firstChild.remove();
    }
    localStorage.removeItem('comments');
    carTotal = 0;
    paragrath.innerText = '0';
  });
}

function saveList(sku, name, salePrice) {
  const object = { sku, name, salePrice };
  if (!localStorage.comments) {
    const newComment = JSON.stringify([object]);
    localStorage.setItem('comments', newComment);
  } else {
    const actualComments = localStorage.comments;
    const formatedActualComments = JSON.parse(actualComments);
    const finalComments = [...formatedActualComments, object];
    localStorage.comments = JSON.stringify(finalComments);
  }
}

function showList() {
  const tagOl = document.querySelector('.cart__items');
  if (localStorage.comments) {
    const local = JSON.parse(localStorage.comments);
    for (let index = 0; index < local.length; index+= 1) {
      const li = document.createElement('li');
      li.innerHTML = `SKU: ${local[index].sku} | NAME: ${local[index].name} | PRICE: $${local[index].salePrice}`;
      tagOl.appendChild(li);
      li.addEventListener('click', cartItemClickListener);
      clearCarItem();
    }
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saveList(sku, name, salePrice);
  return li;
}

function listOfElementsAtpage() {
  const valueCar = document.getElementById('value-car');
  const elementosNoHtml = document.querySelector('.items');
  const skuNamePrice = document.querySelector('.cart__items');
  const salePriceCar = document.getElementsByClassName('cart__title')[0];
  const API_URL = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY()}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;
  fetch(API_URL)
  .then(response => response.json())
  .then((data) => {
    data.products.forEach((element) => {
      const child = createProductItemElement(element);
      elementosNoHtml.appendChild(child);
      removeLoading();
      child.lastChild.addEventListener('click', () => {
        const API_URL_PRODUCT = `https://api.bestbuy.com/v1/products(sku=${child.firstChild.textContent})?apiKey=${API_KEY()}&sort=sku.asc&show=sku,name,salePrice&format=json`;
        fetch(API_URL_PRODUCT)
        .then(response => response.json())
        .then((dados) => {
          skuNamePrice.appendChild(createCartItemElement(dados.products[0]));
          if (valueCar) { valueCar.remove(); }
          salePriceCar.appendChild(valueOfProduts(dados.products[0].salePrice));
        });
      });
    });
  });
}

window.onload = function onload() {
  addLoading();
  API_KEY();
  saveNameInPage();
  listOfElementsAtpage();
  clearCarItem();
  showList();
};
