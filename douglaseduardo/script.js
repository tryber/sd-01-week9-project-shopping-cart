global.window.onload = function onload() {};

const pgClss = classe => global.document.querySelector(`.${classe}`);

const api = () => global.localStorage.getItem('chave_API');

const apiKeyEx5 = SKU =>
  `https://api.bestbuy.com/v1/products(sku=${SKU})?apiKey=${api()}&sort=sku.asc&show=sku,name,salePrice&format=json`;

let contador = 0;

function criadorKey() {
  let listaUniversal = '';
  const carrinho = global.document.getElementsByClassName('cart__item');
  carrinho.map((select) => {
    listaUniversal = `SKU_${select.innerText.substring(5, 13)}_Num_${contador}`;
    return listaUniversal;
  });

  return listaUniversal;
}

function modificarLista() {
<<<<<<< HEAD
    const olOrdenado = document.getElementsByClassName('cart__item');
    for (let i = 0; i < olOrdenado.length; i++) {
        localStorage[criadorKey()] = olOrdenado[i].innerText.substring(5, 13)
    };
    return localStorage;
}

function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
}

function criarListaElemento(respostaJson) {
    respostaJson.forEach(element => pgClss('cart__items').appendChild(createCartItemElement(element)));
}

document.querySelector('.limparCarrinho').addEventListener('click', () => {
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
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
    return section;
}

function cartItemClickListener(event) {
    const chave = Object.keys(localStorage)
        .find(item => localStorage[item] === event.target.innerText.substring(5, 13));
    localStorage.removeItem(chave);
    event.target.remove();
}

Object.keys(localStorage).forEach(chave => {
    fetch(apiKeyEx5(Number(localStorage.getItem(chave))), { headers: { Accept: 'application/json' } })
        .then(response => response.json())
        .then(array => criarListaElemento(array.products));
=======
  const olOrdenado = global.document.getElementsByClassName('cart__item');
  for (let i = 0; i < olOrdenado.length; i += 1) {
    global.localStorage[criadorKey()] = olOrdenado[i].innerText.substring(5, 13);
  }
  return global.localStorage;
}

function cartItemClickListener(event) {
  const chave = Object.keys(global.localStorage).find(
    item => global.localStorage[item] === event.target.innerText.substring(5, 13),
  );
  global.localStorage.removeItem(chave);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = global.document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function criarListaElemento(respostaJson) {
  respostaJson.forEach(element =>
    pgClss('cart__items').appendChild(createCartItemElement(element)),
  );
}

global.document.querySelector('.limparCarrinho').addEventListener('click', () => {
  const pai = global.document.querySelectorAll('.cart__item');
  pai.forEach(item => item.remove());
  Object.keys(global.localStorage).forEach((chave) => {
    if (chave !== 'chave_API') global.localStorage.removeItem(chave);
  });
});

function createProductImageElement(imageSource) {
  const img = global.document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = global.document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = global.document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

Object.keys(global.localStorage).forEach((chave) => {
  fetch(apiKeyEx5(Number(global.localStorage.getItem(chave))), {
    headers: { Accept: 'application/json' },
  })
    .then(response => response.json())
    .then(array => criarListaElemento(array.products));
>>>>>>> ee95f801ff64b2637d317ff460766eb278441902
});

const criarElemento = (valoresParaCriar) => {
<<<<<<< HEAD
    valoresParaCriar.forEach((element) => {
        const filho = createProductItemElement(element);
        pgClss('items').appendChild(filho);
        filho.lastChild.addEventListener('click', () => {
            fetch(apiKeyEx5(filho.firstChild.innerHTML), { headers: { Accept: 'application/json' } })
                .then(response => response.json())
                .then(array => criarListaElemento(array.products))
                .then(() => contador++)
                .then(() => modificarLista())
        });
    });
}

function criadorKey() {
    let listaUniversal = '';
    const carrinho = document.getElementsByClassName('cart__item');
    for (let i of carrinho) listaUniversal = `SKU_${i.innerText.substring(5, 13)}_Num_${contador}`;
    return listaUniversal;
}

const usarAPI = () => {
    const endPoint = () => `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${api()}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`;
    fetch(endPoint(), { headers: { Accept: 'application/json' } })
        .then(response => response.json())
        .then(array => criarElemento(array.products))
}
=======
  valoresParaCriar.forEach((element) => {
    const filho = createProductItemElement(element);
    pgClss('items').appendChild(filho);
    filho.lastChild.addEventListener('click', () => {
      fetch(apiKeyEx5(filho.firstChild.innerHTML), {
        headers: { Accept: 'application/json' },
      })
        .then(response => response.json())
        .then(array => criarListaElemento(array.products))
        .then(() => {
          contador += 1;
        })
        .then(() => modificarLista());
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
>>>>>>> ee95f801ff64b2637d317ff460766eb278441902

usarAPI();

pgClss('input-name').addEventListener('blur', () => {
<<<<<<< HEAD
    return localStorage.nome = inputName.value
});
=======
  global.localStorage.nome = pgClss('input-name').value;
});
>>>>>>> ee95f801ff64b2637d317ff460766eb278441902
