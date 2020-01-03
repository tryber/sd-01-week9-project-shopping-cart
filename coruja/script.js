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

let carTotal = 0;
const paragrath = document.createElement('p');

const localStorePrice = () => {
  classValues = document.getElementsByClassName('values')[0];
  if (classValues) {
    localStorage.setItem('price', classValues.textContent);
  } else {
    localStorage.setItem('price', carTotal);
  }
};

function newLocalStorage(items) {
  const local = JSON.parse(localStorage.comments);
  const newStorage = local.find((item) => {
    item.sku === items;
  });
  const removeItemLocalStorage = local.indexOf(newStorage);
  local.splice(removeItemLocalStorage, 1);
  localStorage.comments = JSON.stringify(local);
}

function cartItemClickListener(event) {
  const valueCar = document.getElementById('value-car');
  const salePriceCar = document.getElementsByClassName('cart__title')[0];
  salePriceCar.lastChild.remove();
  if (valueCar) {
    valueCar.remove();
  }
  const decreaseValue = event.target.textContent.length;
  const decreaseValueCar = Number(
    event.target.textContent.substring(decreaseValue - 5, decreaseValue));
  carTotal -= decreaseValueCar;
  paragrath.innerText = `${carTotal.toFixed(2)}`;
  salePriceCar.appendChild(paragrath);
  event.target.remove();
  localStorePrice();
  const skuProduct = Number(event.target.innerText.substring(5, 13));
  newLocalStorage(skuProduct);
}

const initialPrice = () => {
  if (localStorage.price) {
    const valueTotal = document.getElementById('value-total');
    valueTotal.innerText = localStorage.price;
    carTotal = parseFloat(localStorage.price);
  }
};

function valueOfProduts(salePrice) {
  const salePriceCar = document.getElementsByClassName('cart__title')[0];
  salePriceCar.lastChild.remove();
  paragrath.className = 'values';
  carTotal += salePrice;
  paragrath.innerText = `${carTotal.toFixed(2)}`;
  salePriceCar.appendChild(paragrath);
  localStorePrice();
}

function clearCarItem() {
  const button = document.getElementsByTagName('button')[0];
  button.addEventListener('click', () => {
    const elementOfCarItem = document.getElementsByClassName('cart__items')[0];
    const valueTotal = document.getElementById('value-total');
    while (elementOfCarItem.firstChild) {
      elementOfCarItem.firstChild.remove();
    }
    localStorage.removeItem('comments');
    carTotal = 0;
    paragrath.innerText = '0.00';
    if (valueTotal) {
      valueTotal.textContent = '0.00';
    }
    if (localStorage.price) {
      localStorage.removeItem('price');
    }
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
    for (let index = 0; index < local.length; index += 1) {
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
              valueOfProduts(dados.products[0].salePrice);
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
  initialPrice();
};
