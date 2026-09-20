import fs from 'fs';
import path from 'path';
import { test as setup } from '@playwright/test';
import { optionalPortalConfig, storageStatePath } from './env';
import { expectLoggedIn, login } from './login';
import { installReadOnlyGuard } from './read-only-guard';
import { LOOP } from '../regression/admin/_helpers/loop-data';

setup('sign in to client portal', async ({ page }) => {
  const storageState = storageStatePath('client');
  fs.mkdirSync(path.dirname(storageState), { recursive: true });
  await installReadOnlyGuard(page);

  const portal = optionalPortalConfig('client');
  const connected = {
    ...portal,
    credentials: {
      ...portal.credentials,
      email: LOOP.clientEmail,
      password: LOOP.clientPortalPassword,
    },
  };
  if (!connected.credentials.email || !connected.credentials.password) {
    fs.writeFileSync(storageState, JSON.stringify({ cookies: [], origins: [] }, null, 2));
    setup.skip(true, `No credentials configured for ${portal.name}.`);
    return;
  }

  await login(page, connected);
  await expectLoggedIn(page, connected);
  await page.context().storageState({ path: storageState });
});
