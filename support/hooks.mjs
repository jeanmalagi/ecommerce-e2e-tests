import { Before, After } from '@cucumber/cucumber';
import { mkdirSync } from 'node:fs';
import { rename } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const VIDEO_DIR = 'test-results/videos';

function slugifyScenarioName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase() || 'scenario';
}

Before(async function ({ pickle }) {
  const isCI = Boolean(process.env.CI || process.env.JENKINS_URL);
  const scenarioName = pickle?.name || 'scenario';

  this.scenarioVideoBaseName = slugifyScenarioName(scenarioName);

  mkdirSync(VIDEO_DIR, { recursive: true });

  this.browser = await chromium.launch({ headless: isCI });
  this.context = await this.browser.newContext({
    recordVideo: {
      dir: VIDEO_DIR,
      size: {
        width: 1280,
        height: 720,
      },
    },
  });
  this.page = await this.context.newPage();
});

After(async function ({ result }) {
  const video = this.page?.video();

  if (this.context) {
    // Closing the context flushes recorded video files to disk.
    await this.context.close();
  }

  if (video) {
    try {
      const originalPath = await video.path();
      const status = (result?.status || 'unknown').toString().toLowerCase();
      const timestamp = Date.now();
      const newFileName = `${this.scenarioVideoBaseName || 'scenario'}__${status}__${timestamp}.webm`;
      const targetPath = join(VIDEO_DIR, newFileName);

      await rename(originalPath, targetPath);
    } catch {
      // If renaming fails, keep the original file name.
    }
  }

  if (this.browser) {
    await this.browser.close();
  }
});