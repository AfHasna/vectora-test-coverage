// Read-only deep dive into the route sheets named in the issues tracker.
// Opens each one, captures the warning banners, the stop order and the
// passengers, and writes full snapshots to mcp-output/issues/<route>.txt.
// Nothing is filled, saved or submitted; the guard below aborts writes.
// Run: node scripts/investigate-routes.mjs
import fs from 'fs';
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE = 'https://admin.govectora.com';
const ROUTES = ['RSR-0014', 'RSO-0024', 'RSO-0013', 'RSR-0018'];

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const AUTH = /\/auth\/v1\/|iam__auth-gateway|iam__2fa-otp|\/token\?grant_type/i;
const WRITE_RPC =
  /\/rest\/v1\/rpc\/(?:create|insert|add|update|upsert|set|delete|remove|archive|restore|generate|assign|unassign|approve|reject|send|mark|apply|sync|reset|import|export|dispatch|complete|cancel|start|stop|toggle)_/i;

function isRead(url) {
  if (url.includes('/functions/v1/reports__')) return true;
  if (url.includes('/storage/v1/object/sign/')) return true;
  return url.includes('/rest/v1/rpc/') && !WRITE_RPC.test(url);
}

fs.mkdirSync('mcp-output/issues', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: '.auth/prod.super-admin.json' });
const page = await context.newPage();

await page.route('**/*', async (route) => {
  const method = route.request().method().toUpperCase();
  const url = route.request().url();
  if (!MUTATING.has(method) || AUTH.test(url) || isRead(url)) {
    await route.continue();
    return;
  }
  console.log(`  [guard] blocked ${method} ${url}`);
  await route.abort('blockedbyclient');
});

async function unique(locator, limit = 40) {
  const texts = await locator.allInnerTexts();
  return [...new Set(texts.map((text) => text.replace(/\s+/g, ' ').trim()).filter(Boolean))].slice(
    0,
    limit,
  );
}

// The list paginates; widen it so every route id is on one page.
await page.goto(`${BASE}/service-operations/route-sheets`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);

const sizeSelect = page
  .getByRole('combobox')
  .filter({ hasText: /^(10|25|50)$/ })
  .first();
if (await sizeSelect.count()) {
  await sizeSelect.click();
  await page.getByRole('option', { name: '50', exact: true }).click();
  await page.waitForTimeout(3000);
}

console.log('route ids on the list:', (await unique(page.locator('tbody tr td:nth-child(2)'))).join(' | '));

for (const routeId of ROUTES) {
  console.log(`\n##### ${routeId}`);
  try {
    const cell = page.getByText(routeId, { exact: false }).first();
    if (!(await cell.count())) {
      console.log('  not on the current page of the list');
      continue;
    }
    await cell.click();
    await page.waitForTimeout(5000);

    const slug = routeId.toLowerCase();
    fs.writeFileSync(`mcp-output/issues/${slug}.txt`, await page.locator('body').ariaSnapshot());

    console.log('  url:', page.url());
    console.log('  pageId:', await page.locator('html').getAttribute('data-active-page-id'));
    console.log('  headings:', (await unique(page.getByRole('heading'), 12)).join(' | '));
    console.log('  tabs:', (await unique(page.getByRole('tab'), 12)).join(' | '));

    const warnings = await unique(
      page.getByText(/needs attention|Gap before|mismatch|skipped stop/i),
      12,
    );
    console.log('  warnings:', warnings.length ? warnings.join(' || ') : 'none');

    const stops = await unique(page.getByText(/^#?\d+\s|Stop \d+/), 20);
    console.log('  stop markers:', stops.join(' | '));

    console.log('  school text on page:', (await unique(page.getByText(/school/i), 8)).join(' | '));

    // Leave the record without touching anything.
    await page.goto(`${BASE}/service-operations/route-sheets`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3500);
  } catch (error) {
    console.log(`  FAILED: ${error.message.split('\n')[0]}`);
  }
}

await browser.close();
