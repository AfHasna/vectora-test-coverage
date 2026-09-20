import { expect } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { providerCase } from '../../../fixtures/annotate';
import { LOOP } from '../../admin/_helpers/loop-data';

const TOTAL = 14;
const SUITE = 'Home & tenant';

test.describe.configure({ mode: 'serial' });

test.describe('REG-SP Home & tenant', () => {
  test(
    'REG-SP-001 — Dashboard welcomes 3B Trans LLC',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-001',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Dashboard welcomes 3B Trans LLC',
          preconditions: 'Stage SP Vite :5175; session is seed.qe.sp (Stage 0 SEED provider)',
          data: LOOP.spEmail,
          actionSteps: '1) Open `/dashboard` 2) Wait for Welcome, 3B Trans LLC (or Dashboard heading)',
          expected:
            'known: Provider home is scoped to this organization. Welcome uses the company name, not a client district.',
          expectedSource: 'known',
        },
        async () => {
          await page.goto('/dashboard');
          await expect(
            page
              .getByRole('heading', { name: `Welcome, ${LOOP.spCompany}` })
              .or(page.getByRole('heading', { name: 'Dashboard' }))
              .first(),
          ).toBeVisible({ timeout: 25_000 });
          await expect(page.getByText("Today's Trip Statistics")).toBeVisible();
        },
      );
    },
  );

  test(
    'REG-SP-002 — Profile menu is 3B Trans LLC, not Loop School',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-002',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Profile menu is 3B Trans LLC, not Loop School',
          preconditions: 'Logged in as seed.qe.sp',
          data: `${LOOP.spCompany} | ${LOOP.spEmail}`,
          actionSteps: '1) Open profile menu 2) Read company + email',
          expected:
            'known: SP session is provider-scoped. Menu shows 3B Trans LLC and seed.qe.sp, not SEED_QE Loop School.',
          expectedSource: 'known',
        },
        async () => {
          await page.goto('/dashboard');
          await page.getByRole('button', { name: /profile menu/i }).click();
          await expect(page.getByText(LOOP.spCompany, { exact: true })).toBeVisible();
          await expect(page.getByText(LOOP.spEmail)).toBeVisible();
          await expect(page.getByText(LOOP.clientName)).toHaveCount(0);
        },
      );
    },
  );
});
