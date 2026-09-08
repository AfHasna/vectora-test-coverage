// Exploration only: opens the filter panels, the compliance dialog and the
// trips pages, and lists their controls so the read-only specs can be written
// against real locators. Full snapshots go to mcp-output/explore/.
// Run: node scripts/explore-controls.mjs
import fs from 'fs';
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const WRITE_RPC =
  /\/rest\/v1\/rpc\/(?:create|insert|add|update|upsert|set|delete|remove|archive|restore|generate|assign|unassign|approve|reject|send|mark|apply|sync|reset|import|dispatch|complete|cancel)_/i;
const AUTH = /\/auth\/v1\/|iam__auth-gateway|iam__2fa-otp|\/token\?grant_type/i;

fs.mkdirSync('mcp-output/explore', { recursive: true });

const blocked = [];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: '.auth/admin.json' });
const page = await context.newPage();

await page.route('**/*', async (route) => {
  const method = route.request().method().toUpperCase();
  const url = route.request().url();
  const isRpc = url.includes('/rest/v1/rpc/');
  if (!MUTATING.has(method) || AUTH.test(url) || (isRpc && !WRITE_RPC.test(url))) {
    await route.continue();
    return;
  }
  blocked.push(`${method} ${url}`);
  await route.abort('blockedbyclient');
});

const controls = async (label) => {
  const names = async (role) =>
    (await page.getByRole(role).allInnerTexts())
      .map((t) => t.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
  console.log(`  --- ${label}`);
  console.log('    buttons:', (await names('button')).slice(0, 26).join(' | '));
  console.log('    comboboxes:', (await names('combobox')).slice(0, 12).join(' | '));
  console.log('    switches:', (await names('switch')).slice(0, 10).join(' | '));
  console.log('    radios:', (await names('radio')).slice(0, 10).join(' | '));
  console.log('    textboxes:', await page.getByRole('textbox').count());
};

const visit = async (path, wait = 3500) => {
  await page.goto(`https://admin.govectora.com${path}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(wait);
};

// 1. Drivers Availability, with the filter panel open.
console.log('\n##### drivers-availability');
await visit('/workforce/drivers-availability');
await controls('closed');
await page.getByRole('button', { name: 'Filters' }).first().click();
await page.waitForTimeout(1500);
await controls('filters open');
fs.writeFileSync('mcp-output/explore/avail-filters.txt', await page.locator('main').ariaSnapshot());

// 2. Assignment History, with the filter panel open.
console.log('\n##### assignment-history');
await visit('/vehicles/assignment-history');
await page.getByRole('button', { name: 'Filters' }).first().click();
await page.waitForTimeout(1500);
await controls('filters open');
fs.writeFileSync('mcp-output/explore/history-filters.txt', await page.locator('main').ariaSnapshot());

// 3. Driver Compliance row action -> Compliance Details.
console.log('\n##### compliance-drivers');
await visit('/compliance/drivers');
const rowMenus = page.getByRole('row').getByRole('button').filter({ hasText: '' });
console.log('    row buttons:', await rowMenus.count());
const lastCellButton = page.locator('tbody tr').first().locator('td').last().getByRole('button');
console.log('    action button in last cell:', await lastCellButton.count());
if (await lastCellButton.count()) {
  await lastCellButton.first().click();
  await page.waitForTimeout(1200);
  const menuItems = await page.getByRole('menuitem').allInnerTexts();
  console.log('    menu items:', menuItems.map((t) => t.replace(/\s+/g, ' ').trim()).join(' | '));
  const details = page.getByRole('menuitem', { name: /compliance details/i });
  if (await details.count()) {
    await details.first().click();
    await page.waitForTimeout(2500);
    console.log('    dialogs:', await page.getByRole('dialog').count());
    fs.writeFileSync(
      'mcp-output/explore/compliance-dialog.txt',
      await page.getByRole('dialog').first().ariaSnapshot(),
    );
    const dialogHeadings = await page.getByRole('dialog').getByRole('heading').allInnerTexts();
    console.log('    dialog headings:', dialogHeadings.map((t) => t.replace(/\s+/g, ' ').trim()).join(' | '));
  }
}

// 4. Trips pages.
for (const [name, path] of [
  ['active-trips', '/service-operations/active-trips'],
  ['future-trips', '/service-operations/future-trips'],
  ['trips-history', '/service-operations/trips-history'],
]) {
  console.log(`\n##### ${name}`);
  await visit(path);
  await controls(path);
  fs.writeFileSync(`mcp-output/explore/${name}.txt`, await page.locator('main').ariaSnapshot());
}

// 5. Notifications page.
console.log('\n##### notifications');
await visit('/notifications');
await controls('/notifications');
fs.writeFileSync('mcp-output/explore/notifications.txt', await page.locator('main').ariaSnapshot());

// 6. Settings -> General sections.
console.log('\n##### settings general');
await visit('/settings/general');
const sectionHeadings = await page.getByRole('button').allInnerTexts();
console.log('    section buttons:', sectionHeadings.map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' | '));
fs.writeFileSync('mcp-output/explore/settings-general.txt', await page.locator('main').ariaSnapshot());

// 7. Reports, to confirm the relaxed RPC rule fixes it.
console.log('\n##### reports');
await visit('/reports/trips', 6000);
console.log("    couldn't-load banner:", await page.getByText(/Couldn't load this report/i).count());
console.log('    Total Runs present:', await page.getByText('Total Runs').count());

console.log('\n##### BLOCKED REQUESTS');
console.log(blocked.length ? [...new Set(blocked)].join('\n') : '  none');

await browser.close();
