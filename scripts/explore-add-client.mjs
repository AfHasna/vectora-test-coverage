// Exploration only: opens Clients, opens the Add Client form, and prints the
// accessibility tree so the spec can be written against real labels.
// Nothing is submitted, and writes are blocked. Run: node scripts/explore-add-client.mjs
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const READ_ONLY_RPC = /\/rest\/v1\/rpc\/(?:get|list|search|count|fetch|check|has|is|validate)_/i;
const AUTH = /\/auth\/v1\/|iam__auth-gateway|iam__2fa-otp|\/token\?grant_type/i;

const browser = await chromium.launch({ headless: false, slowMo: 250 });
const context = await browser.newContext({ storageState: '.auth/admin.json' });
const page = await context.newPage();

await page.route('**/*', async (route) => {
  const method = route.request().method().toUpperCase();
  const url = route.request().url();
  if (!MUTATING.has(method) || AUTH.test(url) || READ_ONLY_RPC.test(url)) {
    await route.continue();
    return;
  }
  console.log('BLOCKED', method, url);
  await route.abort('blockedbyclient');
});

await page.goto('https://admin.govectora.com/stakeholders/clients');
await page.waitForLoadState('networkidle').catch(() => {});
console.log('url:', page.url());
console.log('active page id:', await page.locator('html').getAttribute('data-active-page-id'));
console.log('=== CLIENTS PAGE ===');
console.log((await page.locator('main').ariaSnapshot().catch(() => page.locator('body').ariaSnapshot())).slice(0, 4000));

const addClient = page.getByRole('button', { name: /add client/i }).first();
console.log('add-client button count:', await page.getByRole('button', { name: /add client/i }).count());
await addClient.click();
await page.waitForTimeout(2500);

console.log('=== AFTER CLICKING ADD CLIENT ===');
console.log('url:', page.url());
console.log((await page.locator('body').ariaSnapshot()).slice(0, 6000));

await page.screenshot({ path: 'mcp-output/add-client.png', fullPage: false });
await browser.close();
