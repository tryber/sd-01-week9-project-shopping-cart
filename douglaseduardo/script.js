const criarDocClasse = classe => document.querySelector(`.${classe}`);

const api = () => localStorage.getItem('chave_API');

const apiKeyEx5 = SKU =>
  `https://api.bestbuy.com/v1/products(sku=${SKU})?apiKey=${api()}&sort=sku.asc&show=sku,name,salePrice&format=json`;

let contador = 0;

const loadingOn = () => {
  const h1 = document.createElement('h1');
  h1.innerHTML = 'Carregando... Aguarde!!!';
  criarDocClasse('top-bar').appendChild(h1);
};

loadingOn();

const loadingOff = () => criarDocClasse('top-bar').lastChild.remove();

function calculadoraDoCarrinho(value) {
  const preçoTotal = criarDocClasse('cart__title');
  let valorAtual = preçoTotal.innerText.split('$')[1];
  if (isNaN(valorAtual)) {
    valorAtual = 0;
  }
  let preçoFinal = Number(valorAtual) + Number(value);
  if (preçoFinal <= 0) {
    preçoFinal = 0;
  }
  localStorage.setItem('price', preçoFinal);
  preçoTotal.innerText = `Carrinho de compras, 
    preço total: R$${Math.round(localStorage.price * 100) / 100}`;
}

function cartItemClickListener(event) {
  const chave = Object.keys(localStorage).find(
    item => localStorage[item] === event.target.innerText.substring(5, 13),
  );
  calculadoraDoCarrinho(-event.target.innerHTML.split('$')[1]);
  localStorage.removeItem(chave);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function criarListaElemento(respostaJson) {
  respostaJson.forEach(element =>
    criarDocClasse('cart__items').appendChild(createCartItemElement(element)),
  );
}

criarDocClasse('limparCarrinho').addEventListener('click', () => {
  const pai = document.querySelectorAll('.cart__item');
  pai.forEach(item => item.remove());
  Object.keys(localStorage).forEach((chave) => {
    if (chave !== 'chave_API') {
      localStorage.removeItem(chave);
      criarDocClasse('cart__title').innerText = `Carrinho de compras, 
      preço total: R$0.00`;
    }
  });
});

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

Object.keys(localStorage).forEach((chave) => {
  if (chave !== 'chave_API' && chave !== 'price') {
    fetch(apiKeyEx5(Number(localStorage.getItem(chave))), {
      headers: { Accept: 'application/json' },
    })
      .then(response => response.json())
      .then(data => criarListaElemento(data.products));
  }
});

const criarElemento = (valoresParaCriar) => {
  valoresParaCriar.forEach((element) => {
    const filho = createProductItemElement(element);
    criarDocClasse('items').appendChild(filho);
    filho.lastChild.addEventListener('click', () => {
      fetch(apiKeyEx5(filho.firstChild.innerHTML), {
        headers: { Accept: 'application/json' },
      })
        .then(response => response.json())
        .then((data) => {
          contador += 1;
          data.products.map(select => localStorage.setItem(`produto nº${contador} com sku nº ${select.sku}`, select.sku));
          data.products.map(select => calculadoraDoCarrinho(select.salePrice));
          return criarListaElemento(data.products);
        });
    });
  });
}

const usarAPI = () => {
  const endPoint = () =>
    `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${api()}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;
  fetch(endPoint(), { headers: { Accept: 'application/json' } })
    .then(response => response.json())
    .then(array => criarElemento(array.products))
    .then(() => loadingOff());
};

usarAPI();

const salvaNomeBlur = () => {
  const classe = criarDocClasse('input-name')
  classe.addEventListener('blur', () => sessionStorage.setItem('name', classe.value));
};

salvaNomeBlur();
