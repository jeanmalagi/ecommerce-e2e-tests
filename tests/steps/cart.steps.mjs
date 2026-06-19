import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import assert from 'assert';

async function ensureCartIsEmpty(page) {
  const cartLink = page.getByRole('link', {
    name: /carrinho \(\d+\)/i
  });

  await cartLink.waitFor({ timeout: 10000 });

  const cartText = await cartLink.first().innerText();
  const match = cartText.match(/\((\d+)\)/);
  const cartCount = match ? Number(match[1]) : 0;

  if (cartCount === 0) {
    return;
  }

  await cartLink.first().click();

  const clearButton = page.getByTestId('clear-cart');
  await clearButton.waitFor({ timeout: 10000 });
  await clearButton.click();

  const confirmButton = page.getByRole('button', {
    name: /confirmar/i
  });
  await confirmButton.waitFor({ timeout: 10000 });
  await confirmButton.click();

  const emptyMessage = page.getByText(/seu carrinho está vazio/i);
  await emptyMessage.waitFor({ timeout: 10000 });

  const productsLink = page.getByRole('link', { name: /produtos/i });
  if (await productsLink.count()) {
    await productsLink.first().click();
  }
}


// ==============================
// ✅ GIVEN - CLIENTE LOGADO
// ==============================
Given('que o cliente está logado', async function () {

  await this.page.goto('http://localhost:5174/login');

  await this.page.getByPlaceholder('Digite seu email').fill('cliente@email.com');
  await this.page.fill('input[type="password"]', '123456');

  await this.page.click('button[type="submit"]');

  // ✅ espera carregar a tela de produtos
  const title = this.page.getByRole('heading', {
    name: /produtos/i
  });

  await title.waitFor();

  await ensureCartIsEmpty(this.page);
});


// ==============================
// ✅ GIVEN - COM PRODUTO NO CARRINHO
// ==============================
Given('que o cliente está com produto no carrinho', async function () {

  await this.page.goto('http://localhost:5174/login');

  await this.page.getByPlaceholder('Digite seu email').fill('cliente@email.com');
  await this.page.fill('input[type="password"]', '123456');

  await this.page.click('button[type="submit"]');

  const addButton = this.page.getByRole('button', {
    name: /adicionar/i
  }).first();

  await addButton.waitFor();

  await addButton.click();
});


// ==============================
// ✅ WHEN - ADICIONAR PRODUTO
// ==============================
When('ele adiciona um produto ao carrinho', async function () {

  const addButton = this.page.getByRole('button', {
    name: /adicionar/i
  }).first();

  await addButton.waitFor({ timeout: 10000 });

  await addButton.click();
});


// ==============================
// ✅ WHEN - ADICIONAR MÚLTIPLOS
// ==============================
When('ele adiciona múltiplos produtos ao carrinho', async function () {

  const addButtons = this.page.getByRole('button', {
    name: /adicionar/i
  });

  await addButtons.first().waitFor();

  await addButtons.nth(0).click();
  await addButtons.nth(1).click();
});


// ==============================
// ✅ WHEN - ABRIR CARRINHO
// ==============================
When('ele acessa o carrinho', async function () {

  const cartLink = this.page.getByRole('link', {
    name: /carrinho \(\d+\)/i
  });

  await cartLink.waitFor({ timeout: 10000 });

  await cartLink.click();
});

// ==============================
// ✅ WHEN - REMOVER PRODUTO
// ==============================
When('ele remove o produto do carrinho', async function () {

  // ==============================
  // ✅ CLICAR NO LINK DO CARRINHO
  // ==============================
  const cartLink = this.page.getByRole('link', {
    name: /carrinho \(\d+\)/i
  });

  await cartLink.waitFor({ timeout: 10000 });
  await cartLink.click();


  // ==============================
  // ✅ CLICAR NO BOTÃO LIMPAR
  // ==============================
  const clearButton = this.page.getByTestId('clear-cart');

  await clearButton.waitFor({ timeout: 10000 });
  await clearButton.click();


  // ==============================
  // ✅ ESPERAR MODAL APARECER
  // ==============================
  const confirmButton = this.page.getByRole('button', {
    name: /confirmar/i
  });

  await confirmButton.waitFor({ timeout: 10000 });


  // ==============================
  // ✅ CONFIRMAR REMOÇÃO
  // ==============================
  await confirmButton.click();
});

// ==============================
// ✅ THEN - VALIDAR ITEM
// ==============================
Then('deve ver o produto no carrinho', async function () {

  // ✅ localizar link do carrinho com número dinâmico
  const cartLink = this.page.getByRole('link', {
    name: /carrinho \(\d+\)/i
  });

  await cartLink.waitFor({ timeout: 10000 });

  // ✅ clicar no carrinho
  await cartLink.click();


  // ✅ validar botão FINALIZAR COMPRA
  const checkoutButton = this.page.getByRole('button', {
    name: /finalizar compra/i
  });

  await checkoutButton.waitFor({ timeout: 10000 });

  assert(await checkoutButton.isVisible());
});

// ==============================
// ✅ THEN - VALIDAR MULTIPLOS
// ==============================
Then('deve ver mais de um produto no carrinho', async function () {

  // ==============================
  // ✅ ABRIR CARRINHO
  // ==============================
  const cartLink = this.page.getByRole('link', {
    name: /carrinho \(\d+\)/i
  });

  await cartLink.waitFor({ timeout: 10000 });
  await cartLink.click();


  // ==============================
  // ✅ VALIDAR MAIS DE 1 ITEM
  // ==============================
  const increaseButtons = this.page.getByRole('button', { name: '+' });

  await increaseButtons.first().waitFor();

  const count = await increaseButtons.count();

  assert(count > 1, 'Menos de 2 produtos no carrinho');


  // ==============================
  // ✅ LIMPEZA DO CARRINHO (CLEANUP)
  // ==============================
  const clearButton = this.page.getByTestId('clear-cart');

  await clearButton.click();

  const confirmButton = this.page.getByRole('button', {
    name: /confirmar/i
  });

  await confirmButton.waitFor();
  await confirmButton.click();
});

// ==============================
// ✅ THEN - CARRINHO VAZIO
// ==============================
Then('o carrinho deve ficar vazio', async function () {

  const emptyMessage = this.page.getByText('Seu carrinho está vazio');

  await emptyMessage.waitFor({ timeout: 10000 });

  assert(await emptyMessage.isVisible());
});

// ==============================
// ✅ THEN - VALIDAR MENSAGEM VAZIO
// ==============================
Then('deve ver mensagem de carrinho vazio', async function () {

  const emptyMessage = this.page.getByText(/seu carrinho está vazio/i);

  await emptyMessage.waitFor({ timeout: 10000 });

  assert(await emptyMessage.isVisible());
});
