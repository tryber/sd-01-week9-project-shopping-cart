window.onload = function onload() {
    const api = () => localStorage.getItem("chave_API")
    const apiKeyEx5 = (SKU) => `https://api.bestbuy.com/v1/products(sku=${SKU})?apiKey=${api()}&sort=sku.asc&show=sku,name,salePrice&format=json`
    const criarListaElemento = (respostaJson) => {
        respostaJson.forEach(element => {
            pgClss("cart__items").appendChild(createCartItemElement(element))
        })
    }

    const criarElemento = (valoresParaCriar) => {
        valoresParaCriar.forEach(element => {
            const filho = createProductItemElement(element)
            pgClss('items').appendChild(filho)
            filho.lastChild.addEventListener('click', () => {
                fetch(apiKeyEx5(pgClss('item__sku').innerHTML), {
                        headers: { Accept: "application/json" }
                    })
                    .then((response) => response.json())
                    .then((array) => criarListaElemento(array.products))
            })
        })
    }



    const usarAPI = () => {

        const endPoint = () => `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${api()}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`
        fetch(endPoint(), {
                headers: { Accept: "application/json" }
            })
            .then((response) => response.json())
            .then((array) => criarElemento(array.products))

    }
    usarAPI()


    const pgClss = (classe) => document.querySelector(`.${classe}`)

    pgClss('input-name').addEventListener('blur', () => {
        return localStorage.nome = inputName.value

    })


    //     pgClss('input-terms').addEventListener('change', () => {
    //       //document.cookie="chave=valor; expires=DATA PARA EXPIRAR; path=CAMINHO";
    //     let valor = pgClss('input-terms').checked
    //     let coockie = ""
    //     if (valor) {
    //       coockie = 
    //     } else {
    //       coockie =
    //     }
    //     return coockie
    // })





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
}