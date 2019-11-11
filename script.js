window.onload = function onload() {
  API()
  consumerName ()
}

  const changeItemClass = (classItem) => document.querySelector(`.${classItem}`)
  function API () {
    const API_KEY = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${localStorage.api}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`
    fetch(API_KEY, {
      headers: { Accept: 'application/json'}
    })
    .then((response) => response.json())
    .then((data) => data.products.forEach(element => changeItemClass('items').appendChild(createProductItemElement(element))))
  }
  
  function consumerName () {
    const inputConsumer = document.querySelector('.input-name')
    inputConsumer.addEventListener('change', () => {
      sessionStorage.setItem('consumer',inputConsumer.value)
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

  function cartItemClickListener(event) {
    
  }

  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }

