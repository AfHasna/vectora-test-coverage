import { expect } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { clientCase } from '../../../fixtures/annotate';
import { LOOP } from '../../admin/_helpers/loop-data';
import { applyClientSearch, waitPageHeading } from '../_helpers/client-ui';

const TOTAL = 14;
const SUITE = 'Passengers';

test.describe.configure({ mode: 'serial' });

test.describe('REG-CP Passengers', () => {
  test(
    'REG-CP-003 — Passengers list shows SEED LoopChild',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-003',
          sequence: 3,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          basic: true,
          title: 'Passengers list shows SEED LoopChild',
          preconditions: 'Loop School session; Admin REG-ADM-018 created LoopChild on this client',
          data: LOOP.passengerName,
          actionSteps: '1) Open `/passengers` 2) Filter Search passengers for LoopChild',
          expected:
            'kb: Passengers belong to the client. LoopChild must appear for Loop School and not require a second tenant.',
          expectedSource: 'kb',
        },
        async () => {
          await page.goto('/passengers');
          await waitPageHeading(page, 'Passengers');
          await applyClientSearch(page, 'Search passengers...', LOOP.passengerLast);
          await expect(page.getByRole('button', { name: LOOP.passengerName, exact: true }).first()).toBeVisible({
            timeout: 20_000,
          });
        },
      );
    },
  );

  test(
    'REG-CP-004 — LoopChild profile opens with Loop School on the record',
    { tag: ['@regression'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-004',
          sequence: 4,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'LoopChild profile opens with Loop School on the record',
          preconditions: 'REG-CP-003 found LoopChild',
          data: `${LOOP.passengerName} | ${LOOP.clientName}`,
          actionSteps: '1) Click LoopChild 2) Read profile Clients / Schools',
          expected:
            'known: Passenger profile is read-only from this portal. Clients / Schools includes SEED_QE Loop School.',
          expectedSource: 'known',
        },
        async () => {
          await page.goto('/passengers');
          await waitPageHeading(page, 'Passengers');
          await applyClientSearch(page, 'Search passengers...', LOOP.passengerLast);
          await page.getByRole('button', { name: LOOP.passengerName, exact: true }).first().click();
          const dialog = page.getByRole('dialog');
          await expect(dialog).toBeVisible({ timeout: 15_000 });
          await expect(dialog.getByText(LOOP.clientName).first()).toBeVisible();
        },
      );
    },
  );
});
