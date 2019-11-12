window.onload = function onload() {
  
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
  //Novo código
  
  const API_KEY = () => {
    return localStorage.getItem("API_KEY")
  }
  
  let nomeDeEntrada = document.getElementsByClassName("input-name")[0]
  nomeDeEntrada.addEventListener('keyup', function () {
    sessionStorage.setItem('Nome', this.value)
  })
  
  const elementosNoHtml = document.querySelector('.items')
  const skuNamePrice = document.querySelector('.cart__items')

  
  const API_URL = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY()}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`
  fetch(API_URL)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data.products.forEach(element => {
      const child = createProductItemElement(element)
      elementosNoHtml.appendChild(child)
      
      child.lastChild.addEventListener('click', () => {
        const API_URL_PRODUCT = `https://api.bestbuy.com/v1/products(sku=${child.firstChild.textContent})?apiKey=${API_KEY()}&sort=sku.asc&show=sku,name,salePrice&format=json`
        fetch(API_URL_PRODUCT)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          skuNamePrice.appendChild(createCartItemElement(data.products[0]))
        })
      })
    })
  })
  
  function cartItemClickListener(event) {
    event.target.parentNode.removeChild(event.target)
    //event.target.remove
  }
  
  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }
};