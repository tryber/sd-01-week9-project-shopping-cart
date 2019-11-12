window.onload = function onload() {

  const API_KEY = localStorage.token
  const urlAPI = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`

  catchApi()
    .then(response => {
      console.log("yay")
      console.log(response)
      response.products.forEach((el) => {
        document.querySelector(".items").appendChild(createProductItemElement(el))
      })
    })
    .catch(error => {
      console.log("error")
      console.error(error)
    })

  async function catchApi() {
    const response = await fetch(urlAPI, {
      headers: { 'Accept': "application/json" }
    })
    const json = await response.json();
    return json;
  }
  


  nameInputChange = () => {
    const nameInput = document.querySelector(".input-name");
    nameInput.addEventListener('input', () => {
      sessionStorage.name = nameInput.value
    });
  }
  nameInputChange()

  saveName = (key) => {
    sessionStorage.key = key
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
}