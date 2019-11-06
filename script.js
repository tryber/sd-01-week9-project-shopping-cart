window.onload = function() {}

function createProductItemElement({ sku, name, image }) {
  let section = document.createElement("section");
  section.className = "item";

  section.appendChild(createCustomElement("span", "item__sku", sku));
  section.appendChild(createCustomElement("span", "item__title", name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement("button", "item__add", "Adicionar ao carrinho!"));

  return section;
}

function createProductImageElement(image_source) {
  let img = document.createElement("img");
  img.className = "item__image";
  img.src = image_source;
  return img;
}

function createCustomElement(element, className, innerText) {
  let e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector("span.item__sku").innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  let li = document.createElement("li");
  li.className = "cart__item";
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener("click", cartItemClickListener);
  return li;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}