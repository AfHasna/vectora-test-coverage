// Exploration only: loads the Trips report with NO request guard, so any
// failure is the product's own. Run: node scripts/explore-reports.mjs
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: '.auth/admin.prod.json' });
const page = await context.newPage();

page.on('response', async (response) => {
  if (response.status() >= 400) {
    let body = '';
    try {
      body = (await response.text()).slice(0, 300);
    } catch {
      body = '<unreadable>';
    }
    console.log('HTTP', response.status(), response.request().method(), response.url(), body);
  }
});
page.on('console', (message) => {
  if (message.type() === 'error') console.log('CONSOLE', message.text().slice(0, 300));
});

await page.goto('https://admin.govectora.com/reports/trips', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(6000);

console.log('url:', page.url());
console.log('--- main ---');
console.log((await page.locator('main').ariaSnapshot()).slice(0, 2500));

await browser.close();
