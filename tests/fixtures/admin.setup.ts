import fs from 'fs';
import path from 'path';
import { test as setup } from '@playwright/test';
import { optionalPortalConfig, storageStatePath } from './env';
import { expectLoggedIn, login } from './login';
import { installReadOnlyGuard } from './read-only-guard';

setup.setTimeout(180_000);

setup('sign in to admin', async ({ page }) => {
  const storageState = storageStatePath('admin');
  fs.mkdirSync(path.dirname(storageState), { recursive: true });
  await installReadOnlyGuard(page);

  const portal = optionalPortalConfig('admin');
  if (!portal.credentials.email || !portal.credentials.password) {
    fs.writeFileSync(storageState, JSON.stringify({ cookies: [], origins: [] }, null, 2));
    setup.skip(true, `No credentials configured for ${portal.name}.`);
    return;
  }

  if (fs.existsSync(storageState)) {
    try {
      const saved = JSON.parse(fs.readFileSync(storageState, 'utf8')) as {
        origins?: { origin: string; localStorage?: { name: string; value: string }[] }[];
      };
      const origin = saved.origins?.find((entry) => entry.origin.includes('localhost:5173'));
      if (origin?.localStorage?.length) {
        await page.addInitScript((items: { name: string; value: string }[]) => {
          for (const item of items) {
            window.localStorage.setItem(item.name, item.value);
          }
        }, origin.localStorage);
        await page.goto('/');
        const home = page.getByRole('heading', { name: /Home|Dashboard/i }).or(page.getByText(/Welcome/i)).first();
        const menu = page.getByRole('button', { name: /account menu|user menu|profile menu/i });
        const signedIn = await home.or(menu).waitFor({ state: 'visible', timeout: 15_000 }).then(() => true).catch(() => false);
        if (signedIn && !page.url().includes('sign-in') && !(await page.getByText(/Too many attempts/i).isVisible().catch(() => false))) {
          await page.context().storageState({ path: storageState });
          return;
        }
      }
    } catch {
      // fall through to a fresh login
    }
  }

  await login(page, portal);
  await expectLoggedIn(page, portal);
  await page.context().storageState({ path: storageState });
});
