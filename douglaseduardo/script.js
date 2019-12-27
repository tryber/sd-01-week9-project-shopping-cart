const criarDocClasse = classe => document.querySelector(`.${classe}`);

const api = () => localStorage.getItem('chave_API');

const apiKeyEx5 = SKU =>
  `https://api.bestbuy.com/v1/products(sku=${SKU})?apiKey=${api()}&sort=sku.asc&show=sku,name,salePrice&format=json`;

let contador = 0;

function calculadoraDoCarrinho(value) {
  const preçoTotal = criarDocClasse('cart__title');
  const valorAtual = preçoTotal.innerText.split('$')[1];
  //console.log(valorAtual);
  let preçoFinal = Number(valorAtual) + Number(value);
  //console.log(Math.round(localStorage.price * 100) / 100);
  if (preçoFinal <= 0) {
    preçoFinal = 0;
  }
  preçoTotal.innerText = `Carrinho de compras, 
    preço total: R$${Math.round(localStorage.price * 100) / 100}`;
  localStorage.setItem('price', preçoFinal);
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
const valorParaColocarNoSpan = () =>
  (criarDocClasse('cart__items').innerText = `Carrinho de compras, 
    preço total: R$${Math.round(localStorage.price * 100) / 100}`)


function criarListaElemento(respostaJson) {
  respostaJson.forEach((element) =>
    criarDocClasse('cart__items').appendChild(createCartItemElement(element))
  );
}

criarDocClasse('limparCarrinho').addEventListener('click', () => {
  const pai = document.querySelectorAll('.cart__item');
  pai.forEach(item => item.remove());
  Object.keys(localStorage).forEach((chave) => {
    if (chave !== 'chave_API') localStorage.removeItem(chave);
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
      .then(data => criarListaElemento(data.products))
  };
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
        .then(data => {
          contador += 1;
          data.products.map((select) => localStorage.setItem(`produto nº${contador} com sku nº ${select.sku}`, select.sku));
          data.products.map((select) => calculadoraDoCarrinho(select.salePrice))

          return criarListaElemento(data.products)
        })
    });
  });
};

const usarAPI = () => {
  const endPoint = () =>
    `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${api()}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;
  fetch(endPoint(), { headers: { Accept: 'application/json' } })
    .then(response => response.json())
    .then(array => criarElemento(array.products));
};

usarAPI();

const salvaNomeBlur = () => {
  const classe = criarDocClasse('input-name')
  classe.addEventListener('blur', () => sessionStorage.setItem('name', classe.value));
}

salvaNomeBlur()

//=> aguardando aprovação se vai usar cockie ou não, já que deu erro para todos os alunos por causo do navegador Chrome...
// function setCookie() {
//   const inputTermsAgree = criarDocClasse('input-terms');
//   const diasTotais = 7;
//   inputTermsAgree.addEventListener('change', () => {
//     const expires = new Date(Date.now() + (diasTotais * 864e5)).toUTCString();
//     document.cookie = `terms-agree =${encodeURIComponent(inputTermsAgree.checked)}; expires= ${expires}; path=/`;
//   });
// }
