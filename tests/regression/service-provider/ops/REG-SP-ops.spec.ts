import { test } from '../../../fixtures/regression-test';
import { providerCase } from '../../../fixtures/annotate';
import { LOOP } from '../../admin/_helpers/loop-data';
import { waitPageHeading } from '../_helpers/sp-ui';

const TOTAL = 14;
const SUITE = 'Ops pages';

test.describe.configure({ mode: 'serial' });

test.describe('REG-SP Ops pages', () => {
  test(
    'REG-SP-011 — Messaging page loads',
    { tag: ['@regression'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-011',
          sequence: 11,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Messaging page loads',
          preconditions: '3B Trans session',
          data: LOOP.spEmail,
          actionSteps: '1) Open `/messaging` 2) Assert Messaging heading',
          expected: 'common: Messaging heading is visible.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/messaging');
          await waitPageHeading(page, 'Messaging');
        },
      );
    },
  );

  test(
    'REG-SP-012 — Help page loads',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-012',
          sequence: 12,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          basic: true,
          title: 'Help page loads',
          preconditions: '3B Trans session',
          data: '/help',
          actionSteps: '1) Open `/help` 2) Assert Help heading',
          expected: 'common: Help is available without leaving the SP session.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/help');
          await waitPageHeading(page, 'Help');
        },
      );
    },
  );

  test(
    'REG-SP-013 — Reports page loads (read-only)',
    { tag: ['@regression'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-013',
          sequence: 13,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Reports page loads (read-only)',
          preconditions: '3B Trans session',
          data: '/reports',
          actionSteps: '1) Open `/reports` 2) Assert Reports heading',
          expected: 'common: Reports heading is visible.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/reports');
          await waitPageHeading(page, 'Reports');
        },
      );
    },
  );

  test(
    'REG-SP-014 — Payouts page heading only (no accounting writes)',
    { tag: ['@regression'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-014',
          sequence: 14,
          total: TOTAL,
          priority: 'P3',
          regression: true,
          title: 'Payouts page heading only (no accounting writes)',
          preconditions: 'Accounting mutations remain out of scope',
          data: LOOP.spCompany,
          actionSteps: '1) Open `/accounting/payouts` 2) Assert Payouts heading; do not dispute or submit',
          expected: 'common: Payouts heading is visible. No writes.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/accounting/payouts');
          await waitPageHeading(page, 'Payouts');
        },
      );
    },
  );
});
