// Exploration only: visits each page the read-only cases need and prints its
// headings, tabs and controls so specs can be written against real locators.
// Full snapshots are written to mcp-output/explore/*.txt.
// Run: node scripts/explore-pages.mjs
import fs from 'fs';
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const READ_ONLY_RPC = /\/rest\/v1\/rpc\/(?:get|list|search|count|fetch|check|has|is|validate)_/i;
const AUTH = /\/auth\/v1\/|iam__auth-gateway|iam__2fa-otp|\/token\?grant_type/i;

const PAGES = [
  ['home', '/'],
  ['workforce-drivers', '/workforce/drivers'],
  ['fleet-vehicles', '/vehicles'],
  ['compliance-drivers', '/compliance/drivers'],
  ['service-operations', '/service-operations/route-sheets'],
  ['reports-trips', '/reports/trips'],
  ['settings', '/settings'],
  ['clients', '/stakeholders/clients'],
];

fs.mkdirSync('mcp-output/explore', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: '.auth/admin.json' });
const page = await context.newPage();

await page.route('**/*', async (route) => {
  const method = route.request().method().toUpperCase();
  const url = route.request().url();
  if (!MUTATING.has(method) || AUTH.test(url) || READ_ONLY_RPC.test(url)) {
    await route.continue();
    return;
  }
  await route.abort('blockedbyclient');
});

for (const [name, path] of PAGES) {
  try {
    await page.goto(`https://admin.govectora.com${path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);

    const snapshot = await page.locator('body').ariaSnapshot();
    fs.writeFileSync(`mcp-output/explore/${name}.txt`, snapshot);

    const headings = await page.getByRole('heading').allInnerTexts();
    const tabs = await page.getByRole('tab').all();
    const tabInfo = [];
    for (const tab of tabs) {
      tabInfo.push(`${(await tab.innerText()).trim()} -> ${await tab.getAttribute('href')}`);
    }
    const buttons = (await page.getByRole('button').allInnerTexts())
      .map((text) => text.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .slice(0, 18);

    console.log(`\n##### ${name}  ${path}`);
    console.log('  url:', page.url());
    console.log('  pageId:', await page.locator('html').getAttribute('data-active-page-id'));
    console.log('  headings:', headings.map((h) => h.replace(/\s+/g, ' ').trim()).slice(0, 6).join(' | '));
    console.log('  tabs:');
    for (const info of tabInfo) console.log('    -', info);
    console.log('  buttons:', buttons.join(' | '));
    console.log('  tables:', await page.getByRole('table').count(), 'pagination:', await page.getByText(/of \d+ items/).count());
  } catch (error) {
    console.log(`\n##### ${name}  ${path}  FAILED: ${error.message.split('\n')[0]}`);
  }
}

await browser.close();
