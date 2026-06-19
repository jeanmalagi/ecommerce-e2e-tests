import { Before, After } from '@cucumber/cucumber';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

Before(async function () {
  const isCI = Boolean(process.env.CI || process.env.JENKINS_URL);
  const videoDir = 'test-results/videos';

  mkdirSync(videoDir, { recursive: true });

  this.browser = await chromium.launch({ headless: isCI });
  this.context = await this.browser.newContext({
    recordVideo: {
      dir: videoDir,
      size: {
        width: 1280,
        height: 720,
      },
    },
  });
  this.page = await this.context.newPage();
});

After(async function () {
  if (this.context) {
    // Closing the context flushes recorded video files to disk.
    await this.context.close();
  }

  if (this.browser) {
    await this.browser.close();
  }
});