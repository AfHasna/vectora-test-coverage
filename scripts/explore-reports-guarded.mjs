// Exploration only: loads the Trips report WITH the guard and logs what it
// blocks, to find which read call the allowlist is missing.
// Run: node scripts/explore-reports-guarded.mjs
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const READ_ONLY_RPC = /\/rest\/v1\/rpc\/(?:get|list|search|count|fetch|check|has|is|validate)_/i;
const AUTH = /\/auth\/v1\/|iam__auth-gateway|iam__2fa-otp|\/token\?grant_type/i;

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
  console.log('BLOCKED', method, url);
  console.log('   body:', (route.request().postData() ?? '').slice(0, 200));
  await route.abort('blockedbyclient');
});

await page.goto('https://admin.govectora.com/reports/trips', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(6000);

const failed = await page.getByText(/Couldn't load this report/i).count();
console.log('error banner count:', failed);
console.log('has Total Runs:', await page.getByText('Total Runs').count());

await browser.close();
