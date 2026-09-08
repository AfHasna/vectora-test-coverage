// One-off diagnostic: does the admin login POST reach the server, and what does
// it answer? No request guard here, so a failure is the server's answer, not ours.
// Run: node scripts/diagnose-login.mjs
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
console.log('email:', email);
console.log('password length:', password ? password.length : 'MISSING');

const browser = await chromium.launch({ headless: false, slowMo: 300 });
const page = await browser.newPage();

page.on('request', (request) => {
  if (request.method() !== 'GET') {
    console.log('>>', request.method(), request.url());
    const body = request.postData();
    if (body) {
      // Show the shape of the payload without printing the secret.
      const redacted = body.replace(/("password"\s*:\s*")([^"]*)(")/g, (_m, a, secret, c) =>
        `${a}<${secret.length} chars, matches env: ${secret === password}>${c}`,
      );
      console.log('   payload:', redacted.slice(0, 500));
    }
  }
});

page.on('response', async (response) => {
  const url = response.url();
  if (/auth|token|login|signin/i.test(url) && response.request().method() !== 'GET') {
    let body = '';
    try {
      body = (await response.text()).slice(0, 400);
    } catch {
      body = '<unreadable>';
    }
    console.log('<<', response.status(), url, body);
  }
});

page.on('requestfailed', (request) => {
  console.log('!! FAILED', request.method(), request.url(), request.failure()?.errorText);
});

await page.goto('https://admin.govectora.com/sign-in');
await page.getByRole('textbox', { name: 'Email' }).fill(email);
await page.getByRole('textbox', { name: 'Password' }).fill(password);
await page.getByRole('button', { name: /sign in/i }).click();
await page.waitForTimeout(8000);

console.log('final url:', page.url());
console.log('active page id:', await page.locator('html').getAttribute('data-active-page-id'));
console.log('--- page structure ---');
console.log(await page.locator('body').ariaSnapshot());
await browser.close();
