import { expect } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { clientCase } from '../../../fixtures/annotate';
import { LOOP } from '../../admin/_helpers/loop-data';
import { applyClientSearch, waitPageHeading } from '../_helpers/client-ui';

const TOTAL = 14;
const SUITE = 'Ops pages';

test.describe.configure({ mode: 'serial' });

test.describe('REG-CP Ops pages', () => {
  test(
    'REG-CP-010 — Incidents page loads for Loop School',
    { tag: ['@regression'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-010',
          sequence: 10,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Incidents page loads for Loop School',
          preconditions: 'Loop School session',
          data: LOOP.clientName,
          actionSteps: '1) Open `/incidents` 2) Assert Incidents heading; empty list is allowed',
          expected:
            'common: Incidents is tenant-scoped. Heading visible; “No incidents” is valid when none exist for Loop School.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/incidents');
          await waitPageHeading(page, 'Incidents');
        },
      );
    },
  );

  test(
    'REG-CP-011 — Driver compliance lists LoopDriver for this client',
    { tag: ['@regression'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-011',
          sequence: 11,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Driver compliance lists LoopDriver for this client',
          preconditions: 'Admin assigned LoopDriver to a Loop trip/sheet',
          data: LOOP.driverName,
          actionSteps: '1) Open `/compliance/driver-compliance` 2) Filter Search driver name for LoopDriver',
          expected:
            'known: Driver compliance for the client shows drivers serving this tenant. LoopDriver is listed after assignment.',
          expectedSource: 'known',
        },
        async () => {
          await page.goto('/compliance/driver-compliance');
          await waitPageHeading(page, 'Driver Compliance');
          await applyClientSearch(page, 'Search driver name...', LOOP.driverLast);
          await expect(
            page.getByText(LOOP.driverName).or(page.getByText(/No compliance records/i)).first(),
          ).toBeVisible({ timeout: 20_000 });
          const empty = page.getByText(/No compliance records/i);
          if (await empty.isVisible().catch(() => false)) {
            throw new Error('Driver Compliance is empty — LoopDriver should appear after REG-ADM-032 assignment.');
          }
        },
      );
    },
  );

  test(
    'REG-CP-012 — Messages page loads for Loop School',
    { tag: ['@regression'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-012',
          sequence: 12,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Messages page loads for Loop School',
          preconditions: 'Loop School session',
          data: LOOP.clientEmail,
          actionSteps: '1) Open `/messages` 2) Assert Messages heading',
          expected: 'common: Messages heading is visible for the Loop School user.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/messages');
          await waitPageHeading(page, 'Messages');
        },
      );
    },
  );

  test(
    'REG-CP-013 — Help page is available to the Loop School user',
    { tag: ['@regression', '@basic'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-013',
          sequence: 13,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          basic: true,
          title: 'Help page is available to the Loop School user',
          preconditions: 'Loop School session',
          data: '/help',
          actionSteps: '1) Open `/help` 2) Assert Help heading',
          expected: 'common: Help & getting started is visible without leaving the Loop tenant session.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/help');
          await waitPageHeading(page, /Help/i);
        },
      );
    },
  );

  test(
    'REG-CP-014 — Invoices page is tenant-scoped (empty allowed)',
    { tag: ['@regression'] },
    async ({ page }) => {
      await clientCase(
        page,
        {
          portal: 'Client',
          suite: SUITE,
          id: 'REG-CP-014',
          sequence: 14,
          total: TOTAL,
          priority: 'P3',
          regression: true,
          title: 'Invoices page is tenant-scoped (empty allowed)',
          preconditions: 'Loop School session; accounting mutations remain out of scope',
          data: LOOP.clientName,
          actionSteps: '1) Open `/invoices` 2) Assert Invoices heading; do not create invoices',
          expected:
            'common: Invoices heading is visible. Empty invoices is valid. No writes.',
          expectedSource: 'common',
        },
        async () => {
          await page.goto('/invoices');
          await waitPageHeading(page, 'Invoices');
        },
      );
    },
  );
});
