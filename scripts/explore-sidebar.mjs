// Exploration only: reveals the Stakeholder Management flyout so the spec can
// navigate the sidebar the way a user does. Run: node scripts/explore-sidebar.mjs
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
  await route.abort('blockedbyclient');
});

await page.goto('https://admin.govectora.com/');
await page.waitForTimeout(2000);
console.log('landed on:', page.url(), await page.locator('html').getAttribute('data-active-page-id'));

const parent = page.getByRole('link', { name: 'Stakeholder Management' });
console.log('sidebar item count:', await parent.count());

const probe = async (label) => {
  const monitors = page.getByRole('link', { name: 'Client Monitors' });
  const menus = page.locator('[role="menu"], [data-radix-popper-content-wrapper], [data-sidebar="menu-sub"]');
  console.log(
    `${label}: Client Monitors links=${await monitors.count()}, popper/menu nodes=${await menus.count()}`,
  );
};

await probe('before hover');
await parent.first().hover();
await page.waitForTimeout(2500);
await probe('after hover 2.5s');

const box = await parent.first().boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
  await page.waitForTimeout(2500);
  await probe('after mouse.move');
}

console.log('=== SIDEBAR REGION ===');
console.log(await page.locator('list, [data-sidebar]').first().ariaSnapshot().catch(() => 'n/a'));

await page.screenshot({ path: 'mcp-output/sidebar-flyout.png' });
await browser.close();
