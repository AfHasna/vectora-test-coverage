import { expect } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { providerCase } from '../../../fixtures/annotate';
import { LOOP } from '../../admin/_helpers/loop-data';
import { applySpSearch, waitPageHeading } from '../_helpers/sp-ui';

const TOTAL = 14;
const SUITE = 'Workforce';

test.describe.configure({ mode: 'serial' });

test.describe('REG-SP Workforce', () => {
  test(
    'REG-SP-003 — Drivers roster is this SP, not Internal LoopDriver',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-003',
          sequence: 3,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Drivers roster is this SP, not Internal LoopDriver',
          preconditions: 'LoopDriver was created Internal in Admin REG-ADM-037 and assigned on Loop sheets',
          data: `${LOOP.driverName} must not appear | ${LOOP.spCompany}`,
          actionSteps:
            '1) Open `/workforce/drivers` 2) Search LoopDriver 3) Confirm the Internal Loop driver is not on this SP roster',
          expected:
            'kb: Provider portal shows this organization’s drivers only. Internal LoopDriver stays on Admin, not 3B Trans LLC.',
          expectedSource: 'kb',
        },
        async () => {
          await page.goto('/workforce/drivers');
          await waitPageHeading(page, 'Drivers');
          await applySpSearch(page, 'Search by driver name…', LOOP.driverLast);
          await expect(page.getByText(LOOP.driverName)).toHaveCount(0);
        },
      );
    },
  );

  test(
    'REG-SP-004 — Drivers list still loads this provider’s own roster',
    { tag: ['@regression'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-004',
          sequence: 4,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Drivers list still loads this provider’s own roster',
          preconditions: 'Stage 0 seed driver may exist on 3B Trans LLC',
          data: LOOP.seedSpDriverHint,
          actionSteps: '1) Reset/open Drivers 2) Assert heading; if a seed driver is listed it is not LoopDriver',
          expected:
            'known: Empty roster is valid. Any listed driver belongs to this SP and is not SEED LoopDriver.',
          expectedSource: 'known',
        },
        async () => {
          await page.goto('/workforce/drivers');
          await waitPageHeading(page, 'Drivers');
          await expect(page.getByText(LOOP.driverName)).toHaveCount(0);
        },
      );
    },
  );

  test(
    'REG-SP-005 — Monitors page loads for this provider',
    { tag: ['@regression'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-005',
          sequence: 5,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Monitors page loads for this provider',
          preconditions: '3B Trans session',
          data: LOOP.spCompany,
          actionSteps: '1) Open `/workforce/monitors` 2) Assert Monitors heading',
          expected: 'common: Monitors heading is visible. Empty is valid.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/workforce/monitors');
          await waitPageHeading(page, 'Monitors');
        },
      );
    },
  );

  test(
    'REG-SP-006 — Compliance page loads for this provider',
    { tag: ['@regression'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-006',
          sequence: 6,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Compliance page loads for this provider',
          preconditions: '3B Trans session',
          data: LOOP.spCompany,
          actionSteps: '1) Open `/workforce/compliance` 2) Assert Compliance heading',
          expected: 'common: Compliance is tenant-scoped to this SP.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/workforce/compliance');
          await waitPageHeading(page, 'Compliance');
        },
      );
    },
  );

  test(
    'REG-SP-007 — My Requests page loads',
    { tag: ['@regression'] },
    async ({ page }) => {
      await providerCase(
        page,
        {
          portal: 'Service Provider',
          suite: SUITE,
          id: 'REG-SP-007',
          sequence: 7,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'My Requests page loads',
          preconditions: '3B Trans session; do not submit a new request',
          data: '/workforce/requests',
          actionSteps: '1) Open `/workforce/requests` 2) Assert My Requests heading',
          expected: 'common: My Requests heading is visible.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/workforce/requests');
          await waitPageHeading(page, 'My Requests');
        },
      );
    },
  );
});
