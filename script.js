window.onload = function() {}

function createCartItemElement({ sku, name, salePrice }) {
  let li = document.createElement("li")
  li.className = "cart__item"
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`
  li.addEventListener("click", cartItemClickListener)
  return li
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function getSkuFromProductItem(item) {
  return item.querySelector("span.item__sku").innerText
}

function createProductItemElement({ sku, name, image }) {
  let section = document.createElement("section")
  section.className = "item"

  section.appendChild(createProductSkuElement(sku))
  section.appendChild(createProductTitleElement(name))
  section.appendChild(createProductImageElement(image))
  section.appendChild(createAddToCartButtonElement())
  return section
}

function createProductSkuElement(sku) {
  let span = document.createElement("span")
  span.className = "item__sku"
  span.innerText = sku
  return span
}

function createProductTitleElement(title) {
  let span = document.createElement("span")
  span.className = "item__title"
  span.innerText = title
  return span
}

function createProductImageElement(image_source) {
  let img = document.createElement("img")
  img.className = "item__image"
  img.src = image_source
  return img
}

function createAddToCartButtonElement() {
  let button = document.createElement("button")
  button.className = "item__add"
  button.innerText = "Adicionar ao carrinho!"
  return button
}