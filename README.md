# Boas vindas ao repositório do projeto de Carrinho de Compras!

Você já usa o GitHub diariamente para desenvolver os exercícios, certo? Agora, para desenvolver os projetos, você deverá seguir as instruções a seguir. Fique atento a cada passo, e se tiver qualquer dúvida, nos envie por _Slack_! #vqv 🚀

Aqui você vai encontrar os detalhes de como estruturar o desenvolvimento do seu projeto a partir desse repositório, utilizando uma branch específica e um _Pull Request_ para colocar seus códigos.

---

## Criação de conta no BestBuy

Sua página _web_ consumirá dados da API do [Best Buy](https://www.bestbuy.com/) e para realizar chamadas que funcionem, você precisará de uma _API Key_.

Siga as instruções da seção [Getting Started](https://bestbuyapis.github.io/api-documentation/?shell#getting-started) para criar uma conta e gerar uma _API Key_.

Você usará o valor de _API Key_ em **todas** as requisições para o [Best Buy](https://www.bestbuy.com/).

Se você quiser aprender mais sobre a API do _Best Buy_, veja os links abaixo:

- [Best Buy API Documentation](https://bestbuyapis.github.io/api-documentation)
- [Best Buy Query Builder](http://bestbuyapis.github.io/bby-query-builder)

## Utilização dos templates (index.html, style.css e script.js)

Você **não** deve alterar a lógica das funções implementadas no arquivo `script.js`.

Os arquivos `index.html` e `style.css` serão alterados apenas se você decidir fazer os requisitos bônus.
Você pode alterar estes arquivos, mas lembre-se de **não** alterar a hierarquia presente na estrutura.

## Requisitos do projeto

⚠️ Lembre-se que o seu projeto só será avaliado se estiver passando pelos _checks_ do **CodeClimate** e do **TravisCI**

### 1. Salve a api key no **LocalStorage**

**Não salve nem realize um _commit_ de sua _api key_!!!**

Sua _api key_ é a sua chave para acessar a API do Best Buy, se você fizer um _commit_ com ela no código, qualquer pessoa poderá realizar chamadas à API do Best Buy como se fosse **você**.

Para contornar esse problema, adicione sua _api key_ no **LocalStorage** utilizando o **Console** do **Google Chrome**.

Crie uma função para acessar o valor da _api key_.

### 2. Salve o nome da pessoa

Você deve salvar o nome da pessoa que utiliza a página na **SessionStorage**.
A pessoa deve digitar o nome dela no campo `<input class="input-name" type="text">` (já presente na página).

### 3. Salve se a pessoa concorda com os termos da sua página

Salve se a pessoa concorda com os termos da sua página ou não nos **Cookies**.
A pessoa deve marcar ou desmarcar o campo `<input class="input-terms" type="checkbox">` (já presente na página).

### 4. Listagem de produtos

Você deve criar uma listagem de produtos que devem ser consultados através da API do BestBuy.

Você deve utilizar o _endpoint_:
```javascript
"https://api.bestbuy.com/v1/products(releaseDate>today&categoryPath.id in(cat02001))?apiKey=${API_KEY}&format=json&pageSize=30&show=sku,name,image,customerTopRated&sort=bestSellingRank"
```
onde `${API_KEY}` deve ser o valor da sua `api_key`.

O retorno desse _endpoint_ será algo no formato:
```json
{
    "from": 1,
    "to": 3,
    "currentPage": 1,
    "total": 1432,
    "totalPages": 478,
    "queryTime": "0.022",
    "totalTime": "0.031",
    "partial": false,
    "canonicalUrl": "/v1/products(releaseDate>today&categoryPath.id in(cat02001))?show=sku,name,image,customerTopRated&sort=bestSellingRank&pageSize=3&format=json&apiKey=${API_KEY}",
    "products": [
        {
            "sku": 20818637,
            "name": "Curtains [LP] - VINYL",
            "image": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/2081/20818637_sa.jpg",
            "customerTopRated": false
        },
        {
            "sku": 29837267,
            "name": "The Ocean Blue [LP] - VINYL",
            "image": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/2983/29837267_sa.jpg",
            "customerTopRated": false
        },
        {
            "sku": 29837276,
            "name": "Cerulean [LP] - VINYL",
            "image": "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/2983/29837276_sa.jpg",
            "customerTopRated": false
        }
    ]
}
```
A lista de produtos que devem ser exibidos é o _array_ `products` no `JSON` acima.

Você **deve** utilizar a função `createProductItemElement(product)` para criar os componentes _HTML_ referentes a um produto.

Adicione o elemento retornado da função `createProductItemElement(product)` como filho do elemento `<section class="items">`.

### 5. Adicione o produto ao carrinho de compras

Cada produto na página _HTML_ possui um botão com o nome `Adicionar ao carrinho!`.

Ao clicar nesse botão você deve realizar uma requisição para o _endpoint_:
```javascript
"https://api.bestbuy.com/v1/products(sku=${SKU})?apiKey=${API_KEY}&sort=sku.asc&show=sku,name,salePrice&format=json"
```
onde `${SKU}` deve ser o valor do `sku` do item clicado e `${API_KEY}` deve ser o valor da sua `api_key`.

O retorno desse _endpoint_ será algo no formato:
```JSON
{
    "from": 1,
    "to": 1,
    "currentPage": 1,
    "total": 1,
    "totalPages": 1,
    "queryTime": "2.695",
    "totalTime": "2.703",
    "partial": false,
    "canonicalUrl": "/v1/products(sku=20818637)?show=sku,name,salePrice&sort=sku&format=json&apiKey=ICsbqGAthpKjJOtEq6cvgTht",
    "products": [
        {
            "sku": 20818637,
            "name": "Curtains [LP] - VINYL",
            "salePrice": 29.99
        }
    ]
}
```
Preste atenção que a lista `products` deve conter apenas **um** item.

Você **deve** utilizar a função `createCartItemElement(product)` para criar os componentes _HTML_ referentes a um item do carrinho.

Adicione o elemento retornado da função `createCartItemElement(product)` como filho do elemento `<ol class="cart__items">`.

### 6. Remova o item do carrinho de compras ao clicar nele

Ao clicar no **produto no carrinho de compra**, ele deve ser removido da lista.
Para isso, uma função (já existente) chamada `cartItemClickListener(event)` deve ser implementada com a lógica necessária para realizar a remoção.

### 7. Salve o carrinho de compras no **LocalStorage**

O carrinho de compras deve ser salvo no **LocalStorage**, ou seja, todas as **adições** e **remoções** devem ser abordadas para que a lista atual seja salva.

O carrinho de compras deve ser populado ao carregar a página.

### 8. (BÔNUS) Botão para limpar carrinho de compras

Crie um botão para remover todos os itens do carrinho de compras.

### 9. (BÔNUS) Custo total do carrinho de compras

Apresente o valor total do carrinho de compras.

### 10. (BÔNUS) "loading" durante uma requisição à API

Uma requisição à API gasta um tempo e durante ele, ficamos sem saber se está tudo certo ou se algo deu errado.
Normalmente é utilizada alguma forma para mostrar que a requisição está em andamento.
Mostre a palavra "loading..." em alguma lugar da página **apenas durante** a requisição à API.

## Instruções para entregar seu projeto:

### ANTES DE COMEÇAR A DESENVOLVER:

1. Clone o repositório
  * `git clone https://github.com/tryber/sd-01-week9-project-shopping-cart.git`.
  * Entre na pasta do repositório que você acabou de clonar:
    * `cd sd-01-week9-project-shopping-cart`

2. Crie uma branch a partir da branch `master`
  * Verifique que você está na branch `master`
    * Exemplo: `git branch`
  * Se não estiver, mude para a branch `master`
    * Exemplo: `git checkout master`
  * Agora, crie uma branch onde você vai guardar os `commits` do seu projeto
    * Você deve criar uma branch no seguinte formato: `nome-de-usuario-nome-do-projeto`
    * Exemplo: `git checkout -b joaozinho-project-shopping-cart`

3. Crie uma pasta na raiz do projeto com o seu nome e um arquivo **README.md** dentro dessa pasta:
  * Verifique que você está na raiz do projeto
    * Exemplo: `pwd` -> o retorno vai ser algo tipo _/Users/joaozinho/code/**sd-01-week9-project-shopping-cart**_
  * Crie a pasta e o arquivo **README.md**
    * Exemplo:
      * `mkdir joaozinho`
      * `echo "Instruções a seguir:" > joaozinho/README.md`

4. Adicione ao diretória criado os arquivos `index.html`, `style.css` e `script.js` presentes na raiz desse repositório. Você utilizará esses arquivos como base.

5. Adicione as mudanças ao _stage_ do Git e faça um `commit`
  * Verifique que as mudanças ainda não estão no _stage_
    * Exemplo: `git status` (deve aparecer listada a pasta _joaozinho_ em vermelho)
  * Adicione o novo arquivo ao _stage_ do Git
      * Exemplo:
        * `git add .` (adicionando todas as mudanças - _que estavam em vermelho_ - ao stage do Git)
        * `git status` (deve aparecer listado o arquivo _joaozinho/README.md_ em verde)
  * Faça o `commit` inicial
      * Exemplo:
        * `git commit -m 'iniciando o projeto. VAMOS COM TUDO :rocket:'` (fazendo o primeiro commit)
        * `git status` (deve aparecer uma mensagem tipo _nothing to commit_ )

6. Adicione a sua branch com o novo `commit` ao repositório remoto
  * Usando o exemplo anterior: `git push -u origin joaozinho-project-shopping-cart`

7. Crie um novo `Pull Request` _(PR)_
  * Vá até a página de _Pull Requests_ do [repositório no GitHub](https://github.com/tryber/sd-01-week9-project-shopping-cart/pulls)
  * Clique no botão verde _"New pull request"_
  * Clique na caixa de seleção _"Compare"_ e escolha a sua branch **com atenção**
  * Clique no botão verde _"Create pull request"_
  * Adicione uma descrição para o _Pull Request_ e clique no botão verde _"Create pull request"_
  * **Não se preocupe em preencher mais nada por enquanto!**
  * Volte até a [página de _Pull Requests_ do repositório](https://github.com/tryber/sd-01-week9-project-shopping-cart/pulls) e confira que o seu _Pull Request_ está criado

---

### DURANTE O DESENVOLVIMENTO

* ⚠ **LEMBRE-SE DE CRIAR TODOS OS ARQUIVOS DENTRO DA PASTA COM O SEU NOME** ⚠


* Faça `commits` das alterações que você fizer no código regularmente

* Lembre-se de sempre após um (ou alguns) `commits` atualizar o repositório remoto

* Os comandos que você utilizará com mais frequência são:
  1. `git status` _(para verificar o que está em vermelho - fora do stage - e o que está em verde - no stage)_
  2. `git add` _(para adicionar arquivos ao stage do Git)_
  3. `git commit` _(para criar um commit com os arquivos que estão no stage do Git)_
  5. `git push -u nome-da-branch` _(para enviar o commit para o repositório remoto na primeira vez que fizer o `push` de uma nova branch)_
  4. `git push` _(para enviar o commit para o repositório remoto após o passo anterior)_

---

### DEPOIS DE TERMINAR O DESENVOLVIMENTO

Para **"entregar"** seu projeto, siga os passos a seguir:

* Vá até a página **DO SEU** _Pull Request_, adicione a label de _"code-review"_ e marque seus colegas
  * No menu à direita, clique no _link_ **"Labels"** e escolha a _label_ **code-review**
  * No menu à direita, clique no _link_ **"Assignees"** e escolha **o seu usuário**
  * No menu à direita, clique no _link_ **"Reviewers"** e digite `students`, selecione o time `tryber/students`

Se ainda houver alguma dúvida sobre como entregar seu projeto, [aqui tem um video explicativo](https://vimeo.com/362189205).

---

### REVISANDO UM PULL REQUEST

⚠⚠⚠

À medida que você e os outros alunos forem entregando os projetos, vocês serão alertados **via Slack** para também fazer a revisão dos _Pull Requests_ dos seus colegas. Fiquem atentos às mensagens do _"Pull Reminders"_ no _Slack_!

Os monitores também farão a revisão de todos os projetos, e irão avaliar tanto o seu _Pull Request_, quanto as revisões que você fizer nos _Pull Requests_ dos seus colegas!!!

Use o material que você já viu sobre [Code Review](https://course.betrybe.com/real-life-engineer/code-review/) para te ajudar a revisar os projetos que chegaram para você.
