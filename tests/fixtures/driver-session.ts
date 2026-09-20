import { expect, test as base, type Page } from '@playwright/test';
import { optionalPortalConfig } from './env';
import { expectLoggedIn, login } from './login';
import { installReadOnlyGuard } from './read-only-guard';
import { LOOP } from '../regression/admin/_helpers/loop-data';

type Worker = {
  driverPage: Page;
};

export const test = base.extend<object, Worker>({
  driverPage: [
    async ({ browser }, use) => {
      const portal = optionalPortalConfig('driver');
      const connected = {
        ...portal,
        credentials: {
          ...portal.credentials,
          email: LOOP.seedDriverEmail,
          password: LOOP.seedDriverPassword,
        },
      };
      const context = await browser.newContext({
        baseURL: connected.baseURL,
        viewport: { width: 390, height: 844 },
      });
      const page = await context.newPage();
      await installReadOnlyGuard(page);
      await page.goto('/login');
      await login(page, connected);
      await expectLoggedIn(page, connected);
      await expect(page.getByText(/Hello, Ahmad|Hello, |No trips scheduled today|Home/i).first()).toBeVisible({
        timeout: 40_000,
      });
      await use(page);
      await context.close();
    },
    { scope: 'worker' },
  ],

  page: async ({ driverPage }, use) => {
    await use(driverPage);
  },
});

export { expect } from '@playwright/test';
