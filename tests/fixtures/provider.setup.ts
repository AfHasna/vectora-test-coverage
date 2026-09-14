import fs from 'fs';
import path from 'path';
import { test as setup } from '@playwright/test';
import { optionalPortalConfig, storageStatePath } from './env';
import { expectLoggedIn, login } from './login';
import { installReadOnlyGuard } from './read-only-guard';

setup('sign in to service provider portal', async ({ page }) => {
  const storageState = storageStatePath('provider');
  fs.mkdirSync(path.dirname(storageState), { recursive: true });
  await installReadOnlyGuard(page);

  const portal = optionalPortalConfig('provider');
  if (!portal.credentials.email || !portal.credentials.password) {
    fs.writeFileSync(storageState, JSON.stringify({ cookies: [], origins: [] }, null, 2));
    setup.skip(true, `No credentials configured for ${portal.name}.`);
    return;
  }

  await login(page, portal);
  await expectLoggedIn(page);
  await page.context().storageState({ path: storageState });
});
