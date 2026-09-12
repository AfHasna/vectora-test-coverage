// Read-only investigation of the issues in the Vectora System Issues Tracker.
// Opens the screens and records each issue names, captures what is actually on
// screen, and writes full snapshots to mcp-output/issues/*.txt.
// Nothing is filled, saved or submitted; the guard below aborts writes.
// Run: node scripts/investigate-issues.mjs
import fs from 'fs';
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE = 'https://admin.govectora.com';
const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const AUTH = /\/auth\/v1\/|iam__auth-gateway|iam__2fa-otp|\/token\?grant_type/i;
const WRITE_RPC =
  /\/rest\/v1\/rpc\/(?:create|insert|add|update|upsert|set|delete|remove|archive|restore|generate|assign|unassign|approve|reject|send|mark|apply|sync|reset|import|export|dispatch|complete|cancel|start|stop|toggle)_/i;

function isRead(url) {
  if (url.includes('/functions/v1/reports__')) return true;
  if (url.includes('/storage/v1/object/sign/')) return true;
  return url.includes('/rest/v1/rpc/') && !WRITE_RPC.test(url);
}

const PAGES = [
  ['route-sheets', '/service-operations/route-sheets'],
  ['places', '/stakeholders/places'],
  ['active-trips', '/service-operations/active-trips'],
  ['reference-data', '/settings/reference-data'],
];

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

for (const [name, path] of PAGES) {
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);

    fs.writeFileSync(`mcp-output/issues/${name}.txt`, await page.locator('body').ariaSnapshot());

    const headings = (await page.getByRole('heading').allInnerTexts())
      .map((text) => text.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    const columns = (await page.getByRole('columnheader').allInnerTexts())
      .map((text) => text.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    const tabs = (await page.getByRole('tab').allInnerTexts())
      .map((text) => text.replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    console.log(`\n##### ${name}  ${path}`);
    console.log('  url:', page.url());
    console.log('  pageId:', await page.locator('html').getAttribute('data-active-page-id'));
    console.log('  headings:', headings.slice(0, 8).join(' | '));
    console.log('  tabs:', tabs.join(' | '));
    console.log('  columns:', columns.join(' | '));
    console.log('  school mentioned on screen:', await page.getByText(/school/i).count());
    console.log('  rows:', await page.locator('tbody tr').count());
  } catch (error) {
    console.log(`\n##### ${name}  ${path}  FAILED: ${error.message.split('\n')[0]}`);
  }
}

await browser.close();
