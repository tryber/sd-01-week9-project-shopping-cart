window.onload = function onload() {
    if (typeof(Storage) != "undefined") {
        restoreValues();
        storeInput();
        storeCheckbox();
    } else {
        console.log("No web storage support")
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

function acessAPIKey(ApiKey) {
    return localStorage.getItem(ApiKey)
}

function restoreValues() {
    document.getElementsByClassName("input-name")[0].value = sessionStorage.getItem("user_name");
    document.getElementsByClassName("input-terms")[0].checked = (convertArrayToObject(document.cookie.split(";")).checked == "true")
}

function storeInput() {
    document.getElementsByClassName("input-name")[0].addEventListener("change", event => {
        sessionStorage.setItem("user_name", event.target.value)
    })
}

function storeCheckbox() {
    document.getElementsByClassName("input-terms")[0].addEventListener("change", event => {
        event.target.checked ? createCookies("checked", true, " Tue, 01 Jan 2115 12:00:00 UTC") : createCookies("checked", false, "Tue, 01 Jan 2115 12:00:00 UTC")
    })
}

function createCookies(name, value, expires) {
    const date_expires = `expires= ${expires}`;
    document.cookie = name + "=" + value + "; " + date_expires;
}


function convertArrayToObject(array) {
    return array.reduce((obj, item) => {
        const keyValue = item.split("=")
        keyValue[0].charAt(0) == " " ? obj[keyValue[0].substring(1)] = keyValue[1] : obj[keyValue[0]] = keyValue[1]
        return obj
    }, {});
};