window.onload = function onload() {
    const usarAPI = () => {
        const api = () => localStorage.getItem("chave_API")
        const endPoint = () => `https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${api()}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank`
        fetch(endPoint(), {
                headers: { Accept: "application/json" }
            })
            .then((response) => response.json())
            .then((array) => array.products.forEach(element => pgClss('items').appendChild(createProductItemElement(element))))
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