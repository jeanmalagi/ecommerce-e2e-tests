import { Before, After } from '@cucumber/cucumber';
import { chromium } from 'playwright';

Before(async function () {
  const isCI = Boolean(process.env.CI || process.env.JENKINS_URL);
  this.browser = await chromium.launch({ headless: isCI });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});