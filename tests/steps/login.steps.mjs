import {
  Given,
  When,
  Then,
  After,
  setDefaultTimeout
} from '@cucumber/cucumber';

import { chromium } from 'playwright';
import assert from 'assert';

// ✅ Timeout global
setDefaultTimeout(30 * 1000);

// ✅ GIVEN
Given('que o usuário acessa a página de login', async function () {
  this.browser = await chromium.launch({ headless: false });
  this.page = await this.browser.newPage();

  await this.page.goto('http://localhost:5174/login', {
    waitUntil: 'domcontentloaded'
  });

  // ✅ aguarda renderização do React
  await this.page.getByPlaceholder('Digite seu email').waitFor();
});

// ✅ STEP DINÂMICO
When('ele preenche {string} e {string}', async function (email, senha) {
  await this.page.getByPlaceholder('Digite seu email').fill(email);
  await this.page.fill('input[type="password"]', senha);
});

// ✅ CLICK + CAPTURA DE ALERT
When('clica no botão de login', async function () {

  this.dialogMessage = null;

  // ✅ prepara escuta ANTES
  const dialogPromise = this.page.waitForEvent('dialog').then(dialog => {
    this.dialogMessage = dialog.message();
    return dialog.accept();
  }).catch(() => null); // ✅ evita quebra se não houver dialog

  await this.page.click('button[type="submit"]');

  await dialogPromise; // ✅ espera captura (ou não)
});

// ✅ SUCESSO
Then('ele deve ser redirecionado para a área administrativa', async function () {

  const logoutButtons = this.page.getByRole('button', { name: 'Sair' });

  // ✅ pega o botão do header
  const mainLogout = logoutButtons.first();

  await mainLogout.waitFor({ timeout: 10000 });

  assert(await mainLogout.isVisible());

  await mainLogout.click();

  // ✅ depois aparece o botão do modal (segundo)
  const confirmLogout = logoutButtons.nth(1);

  await confirmLogout.waitFor();

  await confirmLogout.click();
});

// ✅ ERRO LOGIN (senha inválida)
Then('deve ver uma mensagem de erro de autenticação', async function () {

  assert(this.dialogMessage, 'Nenhum alert foi exibido');

  assert(
    this.dialogMessage.toLowerCase().includes('email ou senha inválidos')
  );
});

// ✅ USUÁRIO NÃO EXISTENTE
Then('deve ver uma mensagem de usuário não encontrado', async function () {

  assert(this.dialogMessage, 'Nenhum alert foi exibido');

  // ⚠️ backend usa mesma mensagem → esperado
  assert(
    this.dialogMessage.toLowerCase().includes('email ou senha inválidos')
  );
});

// ✅ HOOK AUTOMÁTICO (fecha browser SEMPRE)
After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});