// Exploration only: second pass. Finds the trips pages, the notification and
// global-search surfaces, and logs any request the read-only guard blocks so
// the allowlist can be corrected. Run: node scripts/explore-pages2.mjs
import fs from 'fs';
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const READ_ONLY_RPC = /\/rest\/v1\/rpc\/(?:get|list|search|count|fetch|check|has|is|validate)_/i;
const AUTH = /\/auth\/v1\/|iam__auth-gateway|iam__2fa-otp|\/token\?grant_type/i;

fs.mkdirSync('mcp-output/explore', { recursive: true });

const blocked = [];
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
  blocked.push(`${method} ${url}`);
  await route.abort('blockedbyclient');
});

const summarise = async (label) => {
  const headings = (await page.getByRole('heading').allInnerTexts())
    .map((t) => t.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  console.log(`  ${label} url=${page.url()}`);
  console.log(`    pageId=${await page.locator('html').getAttribute('data-active-page-id')}`);
  console.log(`    headings=${headings.slice(0, 6).join(' | ')}`);
};

// 1. Probe candidate trips routes.
console.log('\n##### trips route probe');
for (const path of [
  '/service-operations/active-trips',
  '/service-operations/future-trips',
  '/service-operations/trips-history',
  '/service-operations/trips',
  '/service-operations/on-demand-trips',
]) {
  await page.goto(`https://admin.govectora.com${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);
  await summarise(path);
}

// 2. Sidebar sub-items for Service Operations, read from the DOM.
console.log('\n##### all sidebar hrefs');
await page.goto('https://admin.govectora.com/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);
const hrefs = await page.locator('a[href]').evaluateAll((nodes) =>
  Array.from(new Set(nodes.map((n) => n.getAttribute('href')))).filter(
    (h) => h && h.startsWith('/'),
  ),
);
console.log('  ' + hrefs.join('\n  '));

// 3. Notification bell popover.
console.log('\n##### notifications');
await page.getByRole('button', { name: 'Notifications' }).click();
await page.waitForTimeout(2000);
fs.writeFileSync('mcp-output/explore/notifications-popover.txt', await page.locator('body').ariaSnapshot());
const viewAll = page.getByRole('link', { name: /view all/i }).or(page.getByRole('button', { name: /view all/i }));
console.log('  view-all count:', await viewAll.count());
if (await viewAll.count()) {
  console.log('  view-all href:', await viewAll.first().getAttribute('href'));
  await viewAll.first().click();
  await page.waitForTimeout(3000);
  await summarise('notifications page');
}

// 4. Global search dialog.
console.log('\n##### global search');
await page.goto('https://admin.govectora.com/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
await page.getByRole('button', { name: /Search/ }).first().click();
await page.waitForTimeout(1500);
fs.writeFileSync('mcp-output/explore/global-search.txt', await page.locator('body').ariaSnapshot());
console.log('  dialogs:', await page.getByRole('dialog').count());
console.log('  searchboxes:', await page.getByRole('searchbox').count(), 'textboxes:', await page.getByRole('textbox').count());

// 5. Driver availability and assignment history.
for (const [name, path] of [
  ['drivers-availability', '/workforce/drivers-availability'],
  ['assignment-history', '/vehicles/assignment-history'],
]) {
  console.log(`\n##### ${name}`);
  await page.goto(`https://admin.govectora.com${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);
  await summarise(path);
  fs.writeFileSync(`mcp-output/explore/${name}.txt`, await page.locator('body').ariaSnapshot());
  const buttons = (await page.getByRole('button').allInnerTexts())
    .map((t) => t.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 20);
  console.log('    buttons=', buttons.join(' | '));
}

console.log('\n##### BLOCKED REQUESTS');
console.log(blocked.length ? [...new Set(blocked)].join('\n') : '  none');

await browser.close();
