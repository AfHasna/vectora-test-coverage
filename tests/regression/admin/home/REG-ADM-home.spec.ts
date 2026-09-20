import { expect } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { adminCase } from '../../../fixtures/annotate';

const TOTAL = 3;
const SUITE = 'Home & Knowledge Base';

test.describe.configure({ mode: 'serial' });

test.describe('REG-ADM Home & KB', () => {
  test(
    'REG-ADM-004 — Home dashboard loads with operational widgets',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-004',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Home dashboard loads with operational widgets',
          preconditions: 'Logged in as Admin; open `/`',
          data: 'Staging Admin session',
          actionSteps: '1) Go to `/` 2) Wait for Home heading',
          expected:
            'kb: Home is the hub — welcome/date and operational metrics (compliance / trips / status cards).',
          expectedSource: 'kb',
          actual: 'Practice: logged-in Home showed sidebar + dashboard shell.',
        },
        async () => {
          await page.goto('/');
          await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
          await expect(page.getByRole('button', { name: 'Account menu' })).toBeVisible();
        },
      );
    },
  );

  test(
    'REG-ADM-005 — Knowledge Base System Overview is readable',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-005',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Knowledge Base System Overview is readable',
          preconditions: 'Logged in; Settings → Knowledge Base',
          data: 'Path `/settings/knowledge-base/system-overview`',
          actionSteps: '1) Open Knowledge Base System Overview 2) Read What is Vectora',
          expected:
            'kb: Knowledge Base is under Settings. System Overview explains the platform and archive vs delete safety.',
          expectedSource: 'kb',
          actual: 'Practice: heading Knowledge Base + What is Vectora + Safety Guarantees visible.',
        },
        async () => {
          await page.goto('/settings/knowledge-base/system-overview');
          await expect(page.getByRole('heading', { name: 'Knowledge Base' })).toBeVisible();
          await expect(page.getByRole('heading', { name: 'What is Vectora?' })).toBeVisible();
          await expect(page.getByText(/Pre-flight linked-records check/i)).toBeVisible();
        },
      );
    },
  );

  test(
    'REG-ADM-006 — Clients list is the stakeholder entry point',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-006',
          sequence: 3,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Clients list is the stakeholder entry point',
          preconditions: 'Logged in',
          data: 'Path `/stakeholders/clients`',
          actionSteps: '1) Open Clients 2) Confirm Add Client and tab strip',
          expected:
            'kb: Tab strip order Clients · Client Monitors · Places · Guardians · Passengers. Onboarding starts with create client.',
          expectedSource: 'kb',
          actual: 'Practice: Clients heading, Add Client, tabs Clients/Places/Guardians/Passengers.',
        },
        async () => {
          await page.goto('/stakeholders/clients');
          await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible();
          await expect(page.getByRole('button', { name: 'Add Client' })).toBeVisible();
          await expect(page.getByRole('tab', { name: 'Places' })).toBeVisible();
          await expect(page.getByRole('tab', { name: 'Guardians' })).toBeVisible();
          await expect(page.getByRole('tab', { name: 'Passengers' })).toBeVisible();
        },
      );
    },
  );
});
