// Read-only pass for the three remaining questions:
//  - RSO-0013 pickup order and grouping (issue 9)
//  - a passenger's day-specific PM schedule (issue 3)
//  - what the Places screen shows for school calendars (issue 10)
// Nothing is filled, saved or submitted; the guard below aborts writes.
// Run: node scripts/investigate-gaps.mjs
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

const clean = (text) => text.replace(/\s+/g, ' ').trim();

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
  await route.abort('blockedbyclient');
});

// ---------- Issue 9: RSO-0013 pickup order ----------
await page.goto(`${BASE}/service-operations/route-sheets`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);
const size = page.getByRole('combobox').filter({ hasText: /^(10|25|50)$/ }).first();
if (await size.count()) {
  await size.click();
  await page.getByRole('option', { name: '50', exact: true }).click();
  await page.waitForTimeout(3000);
}

try {
  await page.getByText('RSO-0013', { exact: false }).first().click();
  await page.waitForTimeout(5000);
  const dialog = page.getByRole('dialog').first();
  await dialog.getByRole('tab', { name: 'Route & Stops' }).click();
  await page.waitForTimeout(4000);
  fs.writeFileSync(`mcp-output/issues/rso-0013-stops.txt`, await dialog.ariaSnapshot());
  const body = clean(await dialog.innerText());
  console.log('##### RSO-0013 Route & Stops');
  console.log(body.slice(0, 2200));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1500);
} catch (error) {
  console.log('##### RSO-0013 FAILED:', error.message.split('\n')[0]);
}

// ---------- Issue 3: day-specific PM schedule on a passenger ----------
try {
  await page.goto(`${BASE}/stakeholders/passengers`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);
  const row = page.locator('tbody tr').first();
  await row.locator('td').nth(1).click();
  await page.waitForTimeout(4500);

  const dialog = page.getByRole('dialog').first();
  fs.writeFileSync(`mcp-output/issues/passenger-detail.txt`, await dialog.ariaSnapshot());
  console.log('\n##### passenger detail');
  console.log('  tabs:', [...new Set((await dialog.getByRole('tab').allInnerTexts()).map(clean))].join(' | '));

  const scheduleTab = dialog.getByRole('tab', { name: /schedule/i }).first();
  if (await scheduleTab.count()) {
    await scheduleTab.click();
    await page.waitForTimeout(3500);
    fs.writeFileSync(`mcp-output/issues/passenger-schedule.txt`, await dialog.ariaSnapshot());
    console.log('  schedule text:', clean(await dialog.innerText()).slice(0, 1800));
  } else {
    console.log('  text:', clean(await dialog.innerText()).slice(0, 1500));
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1500);
} catch (error) {
  console.log('\n##### passenger FAILED:', error.message.split('\n')[0]);
}

// ---------- Issue 10: Places, school calendars ----------
try {
  await page.goto(`${BASE}/stakeholders/places`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4500);
  const rows = await page.locator('tbody tr').allInnerTexts();
  console.log('\n##### places list rows');
  for (const text of rows.slice(0, 6)) console.log('  -', clean(text));

  const school = page.getByText(/school/i).first();
  await school.click();
  await page.waitForTimeout(4500);
  const dialog = page.getByRole('dialog').first();
  if (await dialog.count()) {
    fs.writeFileSync(`mcp-output/issues/place-detail.txt`, await dialog.ariaSnapshot());
    console.log('  place tabs:', [...new Set((await dialog.getByRole('tab').allInnerTexts()).map(clean))].join(' | '));
    console.log('  place text:', clean(await dialog.innerText()).slice(0, 1600));
  }
} catch (error) {
  console.log('\n##### places FAILED:', error.message.split('\n')[0]);
}

await browser.close();
