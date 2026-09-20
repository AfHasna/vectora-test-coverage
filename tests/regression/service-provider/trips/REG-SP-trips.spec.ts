import { expect } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { providerCase } from '../../../fixtures/annotate';
import { LOOP } from '../../admin/_helpers/loop-data';
import { applySpSearch, waitPageHeading } from '../_helpers/sp-ui';

const TOTAL = 14;
const SUITE = 'Trips';

test.describe.configure({ mode: 'serial' });

test.describe('REG-SP Trips', () => {
  test(
    'REG-SP-008 — Active trips do not leak LoopChild Internal assignment',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-008',
          sequence: 8,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Active trips do not leak LoopChild Internal assignment',
          preconditions: 'Admin assigned LoopChild to Internal LoopDriver, not 3B Trans',
          data: LOOP.passengerName,
          actionSteps:
            '1) Open `/trips/active-trips` 2) Search LoopChild 3) Confirm Loop School passenger is not on this SP board',
          expected:
            'kb: Provider trips are this organization’s assignments. Internal Loop runs stay off 3B Trans Active Trips.',
          expectedSource: 'kb',
        },
        async () => {
          await page.goto('/trips/active-trips');
          await waitPageHeading(page, 'Active Trips');
          await applySpSearch(page, 'Search by trip, driver, monitor…', LOOP.passengerLast);
          await expect(page.getByText(LOOP.passengerName)).toHaveCount(0);
          await expect(page.getByText(LOOP.clientName)).toHaveCount(0);
        },
      );
    },
  );

  test(
    'REG-SP-009 — Future trips page loads for this provider',
    { tag: ['@regression'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-009',
          sequence: 9,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Future trips page loads for this provider',
          preconditions: '3B Trans session',
          data: LOOP.spCompany,
          actionSteps: '1) Open `/trips/future-trips` 2) Assert heading; LoopChild must not appear',
          expected: 'common: Future Trips heading visible. Loop School trips stay off this SP.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/trips/future-trips');
          await waitPageHeading(page, 'Future Trips');
          await expect(page.getByText(LOOP.passengerName)).toHaveCount(0);
        },
      );
    },
  );

  test(
    'REG-SP-010 — Trip history page loads for this provider',
    { tag: ['@regression'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-010',
          sequence: 10,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Trip history page loads for this provider',
          preconditions: '3B Trans session',
          data: LOOP.spCompany,
          actionSteps: '1) Open `/trips/trips-history` 2) Assert Trips History heading',
          expected: 'common: History is provider-scoped.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/trips/trips-history');
          await waitPageHeading(page, 'Trips History');
        },
      );
    },
  );
});
