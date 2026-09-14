import { test as base } from '@playwright/test';
import { PORTAL_FROM_PROJECT, type PortalKey } from './env';
import { installReadOnlyGuard } from './read-only-guard';
import { runCase, type RunnableCase } from './run-case';

type RegressionFixtures = {
  portalKey: PortalKey;
  runCase: (meta: Omit<RunnableCase, 'portalKey'> & { portalKey?: PortalKey }) => Promise<void>;
};

export const test = base.extend<RegressionFixtures>({
  // Playwright requires an empty fixture destructure here; a dummy name breaks the runner.
  // eslint-disable-next-line no-empty-pattern
  portalKey: async ({}, use, testInfo) => {
    const key = PORTAL_FROM_PROJECT[testInfo.project.name];
    if (!key) {
      throw new Error(`Project ${testInfo.project.name} is not mapped to a portal.`);
    }
    await use(key);
  },

  page: async ({ page }, use) => {
    await installReadOnlyGuard(page);
    await use(page);
  },

  runCase: async ({ page, portalKey }, use) => {
    await use(async (meta) => {
      await runCase(page, { ...meta, portalKey: meta.portalKey ?? portalKey });
    });
  },
});

export { expect } from '@playwright/test';
