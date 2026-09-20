import { expect, test as base, type Page } from '@playwright/test';
import { optionalPortalConfig } from './env';
import { expectLoggedIn, login } from './login';
import { installReadOnlyGuard } from './read-only-guard';
import { LOOP } from '../regression/admin/_helpers/loop-data';

type Worker = {
  guardianPage: Page;
};

export const test = base.extend<object, Worker>({
  guardianPage: [
    async ({ browser }, use) => {
      const portal = optionalPortalConfig('guardian');
      const connected = {
        ...portal,
        credentials: {
          ...portal.credentials,
          email: LOOP.guardianEmail,
          password: LOOP.guardianMobilePassword,
        },
      };
      const context = await browser.newContext({
        baseURL: connected.baseURL,
        viewport: { width: 390, height: 844 },
      });
      const page = await context.newPage();
      await installReadOnlyGuard(page);
      await page.goto('/sign-in');
      await login(page, connected);
      await expectLoggedIn(page, connected);
      await expect(
        page
          .getByText(/Hello,/i)
          .or(page.getByRole('tab', { name: /home|trips|more/i }))
          .first(),
      ).toBeVisible({ timeout: 40_000 });
      await use(page);
      await context.close();
    },
    { scope: 'worker' },
  ],

  page: async ({ guardianPage }, use) => {
    await use(guardianPage);
  },
});

export { expect } from '@playwright/test';
