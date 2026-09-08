import fs from 'fs';
import path from 'path';
import { test as setup } from '@playwright/test';
import { installReadOnlyGuard } from './helpers/readOnly';
import {
  adminCredentials,
  completeTwoFactor,
  enterEmail,
  enterPassword,
  expectSignedIn,
  openSignIn,
  submitSignIn,
} from './helpers/auth';

const authFile = path.resolve(__dirname, '../.auth/admin.json');

setup('save admin session', async ({ page }) => {
  await installReadOnlyGuard(page);
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    if (fs.existsSync(authFile)) {
      return;
    }
    fs.writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }, null, 2));
    setup.skip(true, 'No ADMIN_EMAIL/ADMIN_PASSWORD and no .auth/admin.json.');
    return;
  }

  const { email, password } = adminCredentials();
  await openSignIn(page);
  await enterEmail(page, email);
  await enterPassword(page, password);
  await submitSignIn(page);
  await completeTwoFactor(page);
  await expectSignedIn(page);

  await page.context().storageState({ path: authFile });
});
