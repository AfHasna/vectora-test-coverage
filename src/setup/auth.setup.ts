import fs from 'fs';
import path from 'path';
import { test as setup } from '@playwright/test';
import { ROLES, roleCredentials, storageStatePath, type Role } from '@config/env';
import { SignInPage } from '@pages/auth/SignInPage';
import { installReadOnlyGuard } from '@utils/read-only-guard';

/**
 * Signs in once per role and saves the session, so no spec spends time on the
 * login form. A role without credentials is skipped, not failed, and an empty
 * session file is written so the projects depending on it can still be listed.
 *
 * This project runs with traces, videos and failure snapshots switched off,
 * because any of them would capture the credentials.
 */
for (const role of ROLES) {
  setup(`sign in as ${role}`, async ({ page }) => {
    const storageState = storageStatePath(role);
    fs.mkdirSync(path.dirname(storageState), { recursive: true });
    await installReadOnlyGuard(page);

    const credentials = roleCredentials(role);
    if (!credentials) {
      writeEmptySession(storageState);
      setup.skip(true, `No credentials configured for the ${role} role.`);
      return;
    }

    const signIn = new SignInPage(page);
    await signIn.open();
    await signIn.enterEmail(credentials.email);
    await signIn.enterPassword(credentials.password);
    await signIn.submit();
    await signIn.completeTwoFactor(credentials.otp);
    await signIn.expectSignedIn();

    await page.context().storageState({ path: storageState });
  });
}

function writeEmptySession(file: string): void {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ cookies: [], origins: [] }, null, 2));
  }
}

export type { Role };
