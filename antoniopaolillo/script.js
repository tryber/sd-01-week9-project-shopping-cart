window.onload = function onload() {

  (function saveName() {
    const inputName = document.getElementsByClassName("input-name")[0]
    inputName.addEventListener("blur", () => sessionStorage.setItem('name', inputName.value))
  })();

  (function setCookie() {
    const inputTermsAgree = document.getElementsByClassName("input-terms")[0];
    inputTermsAgree.addEventListener("change", function settingCookie() {
      const expires = new Date(Date.now() + 7 * 864e5).toUTCString()
      document.cookie = "terms-agree" + '=' + encodeURIComponent(inputTermsAgree.checked) + '; expires=' + expires + '; path=' + '/'
    })
  })();

  (async function gerateProducts () {
    const acessApiKey = localStorage.getItem('apiKey');
    const api = `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${acessApiKey}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;
    const response = await fetch(api)
    .then(response => response.json())
    .then(data => data.products.forEach((product) => {
      document.getElementsByClassName("items")[0].appendChild(createProductItemElement(product))
    }))
  })();

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
};
