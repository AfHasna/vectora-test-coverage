import { test as base, expect } from '@playwright/test';
import { currentEnvironment, type EnvironmentConfig } from '@config/env';
import { installReadOnlyGuard } from '@utils/read-only-guard';

/**
 * The base test every spec builds on.
 *
 * It installs the read-only guard on the page before the spec touches it, so a
 * write cannot escape even from a mistake in a spec, and exposes the resolved
 * environment so specs can state which system they ran against.
 */
export const test = base.extend<{ environment: EnvironmentConfig }>({
  page: async ({ page }, use) => {
    await installReadOnlyGuard(page);
    await use(page);
  },
  // Playwright reads the destructuring pattern to work out a fixture's
  // dependencies, so this one has to stay empty rather than become `_`.
  // eslint-disable-next-line no-empty-pattern
  environment: async ({}, use) => {
    await use(currentEnvironment());
  },
});

export { expect };
