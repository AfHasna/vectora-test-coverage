import { test as base, expect } from '@playwright/test';
import { installReadOnlyGuard } from './helpers/readOnly';

export const test = base.extend({
  page: async ({ page }, use) => {
    await installReadOnlyGuard(page);
    await use(page);
  },
});

export { expect };
