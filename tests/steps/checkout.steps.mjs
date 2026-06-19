import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import assert from 'assert';

Given('que o usuário cliente está logado', async function () {

  await this.page.goto('http://localhost:5174/login');

  await this.page.getByPlaceholder('Digite seu email').fill('cliente@email.com');
  await this.page.fill('input[type="password"]', '123456');

  await this.page.click('button[type="submit"]');

  // ✅ espera carregar a tela de produtos
  const title = this.page.getByRole('heading', {
    name: /produtos/i
  });

  await title.waitFor();
});

When('ele adiciona um ou mais produtos ao carrinho', async function () {
  const addButtons = this.page.getByRole('button', { name: /adicionar/i });

  await addButtons.first().waitFor({ timeout: 10000 });

  const count = await addButtons.count();

  await addButtons.first().click();

  if (count > 1) {
    await addButtons.nth(1).click();
  }
});

When('acessa o carrinho', async function () {
  const cartLink = this.page.getByRole('link', { name: /carrinho \(\d+\)/i });

  await cartLink.waitFor({ timeout: 10000 });
  await cartLink.click();
});

When('confirma os produtos do carrinho', async function () {
  const checkoutButton = this.page.getByRole('button', {
    name: /finalizar compra/i
  });

  await checkoutButton.waitFor({ timeout: 10000 });
  assert(await checkoutButton.isVisible());
});

When('finaliza a compra', async function () {
  const checkoutButton = this.page.getByRole('button', {
    name: /finalizar compra/i
  });

  await checkoutButton.click();
});

When('confirma a compra', async function () {
  // Escopa o botão de confirmação ao modal de finalização
  const modalHeading = this.page.getByRole('heading', { name: /confirmar compra\?/i });
  await modalHeading.waitFor({ timeout: 10000 });

  const modal = modalHeading.locator('xpath=ancestor::div[1]');

  const confirmButton = modal.getByRole('button', { name: /^Finalizar$/i });
  await confirmButton.waitFor({ timeout: 10000 });
  await confirmButton.click();
});

Then('o pedido deve ser criado com sucesso', async function () {
  const successToast = this.page.getByText(/pedido realizado com sucesso!/i);

  await successToast.waitFor({ timeout: 10000 });
  assert(await successToast.isVisible());
});

When('o usuário administrador acessa a tela de pedidos', async function () {
  const ordersLink = this.page.getByRole('link', {
    name: /pedidos/i
  });

  await ordersLink.waitFor({ timeout: 10000 });
  await ordersLink.click();
});

When('altera o status para {string}', async function (status) {
  const value = statusValueMap[status];
  assert(value, `Status inválido: ${status}`);

  const statusSelect = this.page.getByRole('combobox').first();

  await statusSelect.waitFor({ timeout: 10000 });
  await statusSelect.selectOption(value);

  const confirmButton = this.page.getByRole('button', {
    name: /confirmar/i
  });

  await confirmButton.waitFor({ timeout: 10000 });
  await confirmButton.click();
});

Then('o status do pedido deve ser {string}', async function (status) {
  const label = statusLabelMap[status];
  assert(label, `Status inválido: ${status}`);

  const statusElement = this.page.getByText(label).first();

  await statusElement.waitFor({ timeout: 10000 });
  assert(await statusElement.isVisible());
});