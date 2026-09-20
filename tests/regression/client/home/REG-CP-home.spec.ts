import { expect } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { clientCase } from '../../../fixtures/annotate';
import { LOOP } from '../../admin/_helpers/loop-data';
import { waitPageHeading } from '../_helpers/client-ui';

const TOTAL = 14;
const SUITE = 'Home & tenant';

test.describe.configure({ mode: 'serial' });

test.describe('REG-CP Home & tenant', () => {
  test(
    'REG-CP-001 — Dashboard loads for the Loop School portal user',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-001',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Dashboard loads for the Loop School portal user',
          preconditions: 'Stage Client Vite; session is seed.qe.loop.client (not the Westborough Stage 0 user)',
          data: LOOP.clientEmail,
          actionSteps: '1) Open `/` 2) Wait for Dashboard heading and glance cards',
          expected:
            'known: Client home is the tenant hub — Dashboard heading plus today-at-a-glance stats for this organization only.',
          expectedSource: 'known',
        },
        async () => {
          await page.goto('/');
          await waitPageHeading(page, 'Dashboard');
          await expect(page.getByRole('heading', { name: 'Today at a glance' })).toBeVisible();
          await expect(page.getByText('Active Passengers')).toBeVisible();
        },
      );
    },
  );

  test(
    'REG-CP-002 — Account menu is scoped to SEED_QE Loop School',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-002',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Account menu is scoped to SEED_QE Loop School',
          preconditions: 'Logged in as the Loop School portal user from REG-ADM-029',
          data: `${LOOP.clientName} | ${LOOP.clientEmail}`,
          actionSteps: '1) Open User menu 2) Read client name and email',
          expected:
            'known: Portal session is tenant-scoped. Menu must show SEED_QE Loop School and the Loop client email, not another district.',
          expectedSource: 'known',
        },
        async () => {
          await page.goto('/');
          await page.getByRole('button', { name: 'User menu' }).click();
          await expect(page.getByText(LOOP.clientName, { exact: true })).toBeVisible();
          await expect(page.getByText(LOOP.clientEmail)).toBeVisible();
          await expect(page.getByText(/Westborough Public Schools/i)).toHaveCount(0);
        },
      );
    },
  );
});
