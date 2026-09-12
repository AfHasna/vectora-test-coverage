import fs from 'fs';
import { expect, test as base } from '@playwright/test';
import { roleCredentials, storageStatePath, type Role } from '@config/env';
import { installReadOnlyGuard } from '@utils/read-only-guard';

/**
 * Opens a page as a role other than the project's default, reusing the session
 * that auth.setup.ts saved for it. Use it for the permission cases:
 *
 *   const page = await asRole('operations-manager');
 *
 * The session is a file on disk, so nothing here signs in again.
 */
export type AsRole = (role: Role) => Promise<import('@playwright/test').Page>;

export const test = base.extend<{ asRole: AsRole }>({
  asRole: async ({ browser }, use) => {
    const contexts: import('@playwright/test').BrowserContext[] = [];

    await use(async (role: Role) => {
      const storageState = storageStatePath(role);
      if (!roleCredentials(role) || !fs.existsSync(storageState)) {
        test.skip(true, `No saved session for the ${role} role.`);
      }

      const context = await browser.newContext({ storageState });
      contexts.push(context);

      const page = await context.newPage();
      await installReadOnlyGuard(page);
      return page;
    });

    for (const context of contexts) {
      await context.close();
    }
  },
});

export { expect };
