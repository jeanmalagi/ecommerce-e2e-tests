import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import { chromium } from 'playwright';
import assert from 'assert';


// ==============================
// ✅ GIVEN - ADMIN LOGADO
// ==============================
Given('que o administrador está logado', async function () {

  if (!this.page) {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  await this.page.goto('http://localhost:5174/login');

  await this.page.getByPlaceholder('Digite seu email').fill('admin@email.com');
  await this.page.fill('input[type="password"]', '123456');

  await this.page.click('button[type="submit"]');

  // ✅ espera entrar no admin
  await this.page.getByText(/olá, admin/i).waitFor();
});


// ==============================
// ✅ GIVEN - CLIENTE LOGIN PAGE
// ==============================
Given('que o cliente acessa a página de login', async function () {

  if (!this.page) {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  await this.page.goto('http://localhost:5174/login');

  await this.page.getByPlaceholder('Digite seu email').waitFor();
});


// ==============================
// ✅ WHEN - NAVEGAÇÃO PRODUTOS
// ==============================
When('ele acessa a página de produtos', async function () {

  const productsLink = this.page.getByRole('link', { name: 'Produtos' });

  await productsLink.waitFor({ timeout: 10000 });

  await productsLink.click();
});


// ==============================
// ✅ WHEN - CLICK PRODUTO (ADMIN)
// ==============================
When('clica em um produto', async function () {

  const editButton = this.page.getByRole('button', {
    name: /editar/i
  }).first();

  await editButton.waitFor();

  await editButton.click();
});

When('ele cria um novo produto', async function () {

  // ==============================
  // ✅ CLICAR EM "+ NOVO PRODUTO"
  // ==============================
  const novoProdutoBtn = this.page.getByRole('button', {
    name: /\+ Novo Produto/i
  });

  await novoProdutoBtn.waitFor({ timeout: 10000 });
  await novoProdutoBtn.click();


  // ==============================
  // ✅ NOME DINÂMICO
  // ==============================
  const productName = `Produto Teste ${Date.now()}`;
  this.productName = productName;


  // ==============================
  // ✅ PREENCHER NOME
  // ==============================
  await this.page.getByPlaceholder('Nome do produto').fill(productName);


  // ==============================
  // ✅ PREENCHER DESCRIÇÃO
  // ==============================
  await this.page.getByPlaceholder('Descrição').fill('Descrição do produto teste');


  // ==============================
  // ✅ PREENCHER PREÇO
  // ==============================
  await this.page.getByPlaceholder('Preço').fill('50');


  // ==============================
  // ✅ PREENCHER ESTOQUE
  // ==============================
  await this.page.getByPlaceholder('Estoque').fill('10');


  // ==============================
  // ✅ SELECIONAR CATEGORIA
  // ==============================
  await this.page.locator('select').selectOption('Moda');


  // ==============================
  // ✅ CLICAR EM "CRIAR PRODUTO"
  // ==============================
  const createButton = this.page.getByRole('button', {
    name: /criar produto/i
  });

  await createButton.waitFor({ timeout: 10000 });
  await createButton.click();

});
// ==============================
// ✅ THEN - LISTA ADM
// ==============================
Then('deve ver uma lista de produtos', async function () {

  const editButtons = this.page.getByRole('button', {
    name: /editar/i
  });

  await editButtons.first().waitFor({ timeout: 10000 });

  const count = await editButtons.count();

  assert(count > 0, 'Nenhum produto encontrado');
});

// ==============================
// ✅ THEN - DETALHE PRODUTO
// ==============================
Then('deve ver os detalhes do produto', async function () {

  const saveButton = this.page.getByRole('button', {
    name: /salvar/i
  });

  await saveButton.waitFor();

  assert(await saveButton.isVisible());
});


// ==============================
// ✅ THEN - LISTA CLIENTE
// ==============================
Then('ele deve ver a lista de produtos', async function () {

  // ✅ título
  const title = this.page.getByRole('heading', {
    name: /produtos/i
  });

  // ✅ múltiplos botões adicionar (lista de produtos)
  const addButtons = this.page.getByRole('button', {
    name: /adicionar/i
  });

  await title.waitFor({ timeout: 10000 });
  await addButtons.first().waitFor({ timeout: 10000 });

  assert(await title.isVisible());

  const count = await addButtons.count();

  assert(count > 0, 'Nenhum botão adicionar encontrado');
});

When('ele edita um produto', async function () {

  // ==============================
  // ✅ CLICAR NO PRIMEIRO "EDITAR"
  // ==============================
  const editarBtn = this.page
    .getByRole('button', { name: /editar/i })
    .first();

  await editarBtn.waitFor({ timeout: 10000 });
  await editarBtn.click();


  // ==============================
  // ✅ NOVO NOME DINÂMICO
  // ==============================
  const updatedName = `Produto Editado ${Date.now()}`;
  this.updatedProductName = updatedName;


  // ==============================
  // ✅ EDITAR NOME
  // ==============================
  const nomeInput = this.page.locator('input[type="text"]').first();
  await nomeInput.clear();
  await nomeInput.fill(updatedName);


  // ==============================
  // ✅ EDITAR DESCRIÇÃO
  // ==============================
  const descricao = this.page.locator('textarea');
  await descricao.fill('Descrição editada do produto');


  // ==============================
  // ✅ EDITAR PREÇO
  // ==============================
  const preco = this.page.locator('input[type="text"]').nth(1);
  await preco.fill('100');


  // ==============================
  // ✅ EDITAR ESTOQUE
  // ==============================
  const estoque = this.page.locator('input[type="number"]');
  await estoque.fill('20');


  // ==============================
  // ✅ ALTERAR CATEGORIA
  // ==============================
  await this.page.locator('select').selectOption('Games');


  // ==============================
  // ✅ SALVAR ALTERAÇÕES
  // ==============================
  const salvarBtn = this.page.getByRole('button', {
    name: /salvar alterações/i
  });

  await salvarBtn.waitFor({ timeout: 10000 });
  await salvarBtn.click();

});

When('ele exclui o produto editado', async function () {

  // ==============================
  // ✅ LOCALIZAR O CARD PELO NOME
  // ==============================
  const card = this.page
    .locator('h3', { hasText: this.updatedProductName })
    .first()
    .locator('xpath=ancestor::div[1]');

  await card.waitFor({ timeout: 10000 });

  // ==============================
  // ✅ CLICAR NO BOTÃO "EXCLUIR"
  // ==============================
  const excluirBtn = card.getByRole('button', { name: /excluir/i });

  await excluirBtn.waitFor({ timeout: 10000 });
  await excluirBtn.click();


  // ==============================
  // ✅ CONFIRMAR NO MODAL
  // ==============================
  const confirmarBtn = this.page.getByRole('button', {
    name: /confirmar/i
  });

  await confirmarBtn.waitFor({ timeout: 10000 });
  await confirmarBtn.click();

});

Then('o produto deve ser excluído com sucesso', async function () {

  // ==============================
  // ✅ LOCALIZAR O TOAST
  // ==============================
  const toast = this.page.locator('.Toastify__toast--success', {
    hasText: 'Produto excluído com sucesso!'
  });

  // ==============================
  // ✅ VALIDAR QUE APARECEU
  // ==============================
  await toast.waitFor({ timeout: 5000 });

});

Then('as alterações devem ser salvas com sucesso', async function () {

  // ==============================
  // ✅ LOCALIZAR O TOAST
  // ==============================
  const toast = this.page.locator('.Toastify__toast--success', {
    hasText: 'Produto atualizado!'
 });

  // ==============================
  // ✅ VALIDAR QUE ELE APARECEU
  // ==============================
  await toast.waitFor({ timeout: 5000 });

});
Then('o produto deve ser criado com sucesso', async function () {

  // ==============================
  // ✅ LOCALIZAR O TOAST DE SUCESSO
  // ==============================
  const toast = this.page.locator('.Toastify__toast--success', {
    hasText: 'Produto criado!'
  });

  // ==============================
  // ✅ VALIDAR QUE ELE APARECEU
  // ==============================
  await toast.waitFor({ timeout: 5000 });

});