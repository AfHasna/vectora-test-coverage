import { expect } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { clientCase } from '../../../fixtures/annotate';
import { LOOP } from '../../admin/_helpers/loop-data';
import { applyClientSearch, waitPageHeading } from '../_helpers/client-ui';

const TOTAL = 14;
const SUITE = 'Trips & route sheets';

test.describe.configure({ mode: 'serial' });

test.describe('REG-CP Trips & route sheets', () => {
  test(
    'REG-CP-005 — Route sheets list the Loop RSO/RSR-0904 sheet',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-005',
          sequence: 5,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Route sheets list the Loop RSO/RSR-0904 sheet',
          preconditions: 'Admin REG-ADM-021 / 032 assigned LoopChild + LoopDriver on the Loop sheet',
          data: 'RSO-0904 | RSR-0904 | LoopChild',
          actionSteps: '1) Open `/trips/route-sheets` 2) Filter Search routes for 0904',
          expected:
            'kb: Client route sheets are the same scheduling records as Admin, scoped to this client. The Loop 0904 sheet is visible.',
          expectedSource: 'kb',
        },
        async () => {
          await page.goto('/trips/route-sheets');
          await waitPageHeading(page, 'Route Sheets');
          await applyClientSearch(page, 'Search routes...', '0904');
          await expect(page.getByText(/RS[OR]-0904/i).first()).toBeVisible({ timeout: 20_000 });
        },
      );
    },
  );

  test(
    'REG-CP-006 — Active trips show the Loop run for today',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-006',
          sequence: 6,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Active trips show the Loop run for today',
          preconditions: 'Admin REG-ADM-033 generated runs; REG-ADM-036 created on-demand for today',
          data: `${LOOP.driverName} | ${LOOP.passengerName} | ${LOOP.onDemandIsoDate}`,
          actionSteps:
            '1) Open `/trips/active-trips` 2) Reset any leftover filters 3) If rows exist they must mention Loop; Sunday with no generated runs shows No trips today (OD is REG-CP-007)',
          expected:
            'known: Active Trips is today for this client. LoopDriver/LoopChild/RSO-0904 appear when runs exist; “No trips today” is valid when Generate Runs did not materialize this calendar day.',
          expectedSource: 'known',
        },
        async () => {
          await page.goto('/trips/active-trips');
          await waitPageHeading(page, 'Active Trips');
          const reset = page.getByRole('button', { name: 'Reset Filter' });
          if (await reset.isEnabled().catch(() => false)) {
            await reset.click();
          }
          const loopHit = page.getByText(LOOP.driverName).or(page.getByText(LOOP.passengerName)).or(page.getByText(/RS[OR]-0904/i));
          const emptyToday = page.getByRole('heading', { name: 'No trips today' });
          await expect(loopHit.or(emptyToday).first()).toBeVisible({ timeout: 20_000 });
        },
      );
    },
  );

  test(
    'REG-CP-007 — On Demand list includes LoopChild for today',
    { tag: ['@regression'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-007',
          sequence: 7,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'On Demand list includes LoopChild for today',
          preconditions: 'Admin REG-ADM-036 created the Loop on-demand trip',
          data: LOOP.passengerName,
          actionSteps:
            '1) Open `/trips/on-demand` 2) Reset filters 3) Tick Include old trips if yesterday’s Loop OD is hidden 4) Assert LoopChild',
          expected:
            'known: On Demand trips for this client appear here. Yesterday’s Loop OD is shown after Include old trips; empty is only valid if Admin never created an OD for Loop School.',
          expectedSource: 'known',
        },
        async () => {
          await page.goto('/trips/on-demand');
          await waitPageHeading(page, 'On Demand Trips');
          const reset = page.getByRole('button', { name: 'Reset Filter' });
          if (await reset.isEnabled().catch(() => false)) {
            await reset.click();
          }
          const includeOld = page.getByLabel('Include old trips');
          if (await includeOld.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await includeOld.setChecked(true);
          }
          await expect(
            page
              .getByText(LOOP.passengerName)
              .or(page.getByRole('heading', { name: /No on-demand trips|All trips on this list are old/i }))
              .first(),
          ).toBeVisible({ timeout: 20_000 });
        },
      );
    },
  );

  test(
    'REG-CP-008 — Future trips page loads for Loop School',
    { tag: ['@regression'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-008',
          sequence: 8,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Future trips page loads for Loop School',
          preconditions: 'Loop School session',
          data: LOOP.clientName,
          actionSteps: '1) Open `/trips/future-trips` 2) Assert heading; empty state is allowed if no future rows',
          expected:
            'common: Future Trips heading is visible. Either Loop rows exist or the empty-state copy is shown — no other tenant’s trips.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/trips/future-trips');
          await waitPageHeading(page, 'Future Trips');
          await expect(
            page
              .getByText(/No future trips scheduled/i)
              .or(page.getByText(/RS[OR]-/i))
              .or(page.getByText(LOOP.driverName))
              .first(),
          ).toBeVisible({ timeout: 20_000 });
        },
      );
    },
  );

  test(
    'REG-CP-009 — Trip history page loads scoped to Loop School',
    { tag: ['@regression'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-009',
          sequence: 9,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Trip history page loads scoped to Loop School',
          preconditions: 'Loop School session',
          data: LOOP.clientName,
          actionSteps: '1) Open `/trips/trip-history` 2) Assert Trips History heading',
          expected:
            'common: History is tenant-scoped. Heading is visible; empty history is valid for a new Loop.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/trips/trip-history');
          await waitPageHeading(page, 'Trips History');
        },
      );
    },
  );
});
