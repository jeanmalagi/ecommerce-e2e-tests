import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';

When('ele tenta acessar a área administrativa', async function () {
  await this.page.goto('http://localhost:5174/admin');
});

Then('deve ser redirecionado para a lista de produtos', async function () {
  const title = this.page.getByRole('heading', { name: /produtos/i });
  await title.waitFor({ timeout: 10000 });

  const url = this.page.url();
  assert(url.includes('/products'), `URL inesperada: ${url}`);
});
