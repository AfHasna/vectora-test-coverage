// Read-only deep dive inside the route-sheet dialog: the Route & Stops tab and
// the Passengers & Monitors tab, plus the reference data behind the billing
// issue. Snapshots go to mcp-output/issues/<name>.txt.
// Nothing is filled, saved or submitted; the guard below aborts writes.
// Run: node scripts/investigate-stops.mjs
import fs from 'fs';
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE = 'https://admin.govectora.com';
const ROUTES = ['RSR-0014', 'RSO-0013', 'RSR-0018'];

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
  await route.abort('blockedbyclient');
});

const clean = (text) => text.replace(/\s+/g, ' ').trim();

async function openRouteSheets() {
  await page.goto(`${BASE}/service-operations/route-sheets`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const size = page
    .getByRole('combobox')
    .filter({ hasText: /^(10|25|50)$/ })
    .first();
  if (await size.count()) {
    await size.click();
    await page.getByRole('option', { name: '50', exact: true }).click();
    await page.waitForTimeout(3000);
  }
}

await openRouteSheets();

for (const routeId of ROUTES) {
  console.log(`\n##### ${routeId}`);
  try {
    await page.getByText(routeId, { exact: false }).first().click();
    await page.waitForTimeout(4500);

    const dialog = page.getByRole('dialog').first();
    const slug = routeId.toLowerCase();

    for (const tabName of ['Overview', 'Passengers & Monitors', 'Route & Stops']) {
      const tab = dialog.getByRole('tab', { name: tabName });
      if (!(await tab.count())) continue;
      await tab.click();
      await page.waitForTimeout(3500);

      fs.writeFileSync(
        `mcp-output/issues/${slug}-${tabName.replace(/[^a-z]/gi, '-').toLowerCase()}.txt`,
        await dialog.ariaSnapshot(),
      );

      const body = clean(await dialog.innerText());
      console.log(`  --- ${tabName}`);

      const warnings = body.match(/[^.]*(needs attention|Gap before|mismatch|skipped)[^.]*\./gi);
      if (warnings) console.log('    warnings:', [...new Set(warnings.map(clean))].join(' || '));

      const stopLines = body.match(/(?:Stop\s*#?\d+|#\d+)[^#]{0,120}/gi);
      if (stopLines) {
        console.log('    stops:');
        for (const line of [...new Set(stopLines.map(clean))].slice(0, 14)) {
          console.log('      -', line);
        }
      }

      if (tabName === 'Passengers & Monitors') {
        console.log('    text:', body.slice(0, 900));
      }
    }

    await page.keyboard.press('Escape');
    await page.waitForTimeout(2000);
  } catch (error) {
    console.log(`  FAILED: ${error.message.split('\n')[0]}`);
    await openRouteSheets();
  }
}

// Issue 4: does "Minivan" exist as a vehicle type, and what pricing categories
// does the system actually offer?
for (const [name, path] of [
  ['ref-vehicle-types', '/settings/reference-data/vehicle-types'],
  ['ref-index', '/settings/reference-data'],
]) {
  try {
    await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    fs.writeFileSync(`mcp-output/issues/${name}.txt`, await page.locator('body').ariaSnapshot());
    console.log(`\n##### ${name} ${page.url()}`);
    console.log('  tabs:', [...new Set((await page.getByRole('tab').allInnerTexts()).map(clean))].join(' | '));
    console.log('  rows:', [...new Set((await page.locator('tbody tr').allInnerTexts()).map(clean))].slice(0, 20).join(' | '));
    console.log('  minivan mentions:', await page.getByText(/minivan/i).count());
  } catch (error) {
    console.log(`\n##### ${name} FAILED: ${error.message.split('\n')[0]}`);
  }
}

await browser.close();
