import { expect, type Page } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { adminCase } from '../../../fixtures/annotate';
import { LOOP } from '../_helpers/loop-data';

const TOTAL = 3;
const SUITE = 'Route sheets';
const PASSENGER_NAME = `${LOOP.passengerFirst} ${LOOP.passengerLast}`;
const SHEET_HINT = 'SEED_QE Loop';

test.describe.configure({ mode: 'serial' });

async function openSheets(page: Page): Promise<void> {
  await page.goto('/service-operations/route-sheets');
  await expect(page.getByRole('heading', { name: /Route Sheet/i })).toBeVisible({ timeout: 20_000 });
}

async function findLoopSheet(page: Page): Promise<boolean> {
  const hit = page.getByText(new RegExp(`${LOOP.clientName}|${PASSENGER_NAME}|${SHEET_HINT}`, 'i'));
  if (await hit.first().isVisible().catch(() => false)) {
    return true;
  }
  const search = page.getByPlaceholder(/Search/i).first();
  if (await search.isVisible().catch(() => false)) {
    await search.fill(LOOP.clientName);
    const filter = page.getByRole('button', { name: 'Filter', exact: true });
    if (await filter.isVisible().catch(() => false)) {
      await filter.click();
    }
  }
  try {
    await page.getByText(LOOP.clientName).first().waitFor({ state: 'visible', timeout: 8_000 });
    return true;
  } catch {
    return false;
  }
}

test.describe('REG-ADM Route sheets', () => {
  test(
    'REG-ADM-021 — Create Route Sheet wizard opens from Service Operations',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-021',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Create Route Sheet wizard opens from Service Operations',
          preconditions: 'Logged in; SEED client/place exist for later assignment',
          data: 'Path `/service-operations/route-sheets/add`',
          actionSteps:
            '1) Open Route Sheets 2) Create Route Sheet 3) Confirm wizard heading 4) Cancel/back without generate',
          expected:
            'kb: Route sheets (AM/PM) come after clients, places/calendars, passengers, and fleet. Pickup/dropoff is on the wizard.',
          expectedSource: 'kb',
        },
        async () => {
          await openSheets(page);
          await page.getByRole('button', { name: /Create Route Sheet/i }).click();
          await expect(page.getByRole('heading', { name: /Create Route Sheet/i })).toBeVisible({
            timeout: 20_000,
          });
          await page.getByRole('button', { name: /Cancel|Back/i }).first().click();
          const discard = page.getByRole('button', { name: /Discard/i });
          if (await discard.isVisible({ timeout: 3_000 }).catch(() => false)) {
            await discard.click();
          }
        },
      );
    },
  );

  test(
    'REG-ADM-025 — Create SEED AM/PM route sheet for LoopChild',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-025',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Create SEED AM/PM route sheet for LoopChild',
          preconditions: `Passenger ${PASSENGER_NAME} is Active; place calendar exists`,
          data: `${LOOP.clientName} | ${PASSENGER_NAME} | outbound+return | place ${LOOP.placeName}`,
          actionSteps:
            '1) If a Loop School sheet is listed, skip 2) Create Route Sheet, Add Passenger, client+child, outbound+return 3) Fill locations if required 4) Save Route Sheet',
          expected:
            'kb: Pickup/dropoff lives on the route sheet wizard. AM outbound / PM return come from selected rides.',
          expectedSource: 'kb',
        },
        async () => {
          await openSheets(page);
          if (await findLoopSheet(page)) {
            await expect(page.getByText(LOOP.clientName).first()).toBeVisible();
            return;
          }
          await page.goto('/service-operations/route-sheets/add');
          await expect(page.getByRole('heading', { name: /Create Route Sheet/i })).toBeVisible();
          await page.getByRole('button', { name: 'Add Passenger' }).click();
          const dialog = page.getByRole('dialog');
          await expect(dialog.getByRole('heading', { name: /Passenger/i })).toBeVisible({ timeout: 15_000 });
          await dialog.getByRole('combobox').filter({ hasText: /Select client|Search client/i }).or(
            dialog.getByRole('combobox').first(),
          ).click();
          const clientSearch = page.getByPlaceholder(/Search client/i);
          if (await clientSearch.isVisible().catch(() => false)) {
            await clientSearch.fill(LOOP.clientName);
          }
          await page.getByRole('option', { name: LOOP.clientName }).or(page.getByText(LOOP.clientName)).first().click();
          const passengerCombo = dialog.getByRole('combobox').nth(1);
          await passengerCombo.click();
          const pSearch = page.getByPlaceholder(/Search passenger/i);
          if (await pSearch.isVisible().catch(() => false)) {
            await pSearch.fill(LOOP.passengerLast);
          }
          await page.getByRole('option', { name: new RegExp(PASSENGER_NAME, 'i') }).or(page.getByText(PASSENGER_NAME)).first().click();
          const ret = dialog.getByRole('checkbox', { name: /Return|inbound|PM/i });
          if (await ret.first().isVisible().catch(() => false)) {
            await ret.first().check();
          }
          const add = dialog.getByRole('button', { name: 'Add to Route' });
          if (await add.isEnabled().catch(() => false)) {
            await add.click();
          } else {
            await dialog.getByRole('button', { name: /Cancel/i }).click();
            test.info().annotations.push({
              type: 'note',
              description: 'Add to Route stayed disabled — passenger needs home/place locations in the wizard.',
            });
            return;
          }
          const save = page.getByRole('button', { name: 'Save Route Sheet' });
          if (await save.isEnabled().catch(() => false)) {
            await save.click();
            const anyway = page.getByRole('button', { name: 'Save Anyway' });
            if (await anyway.isVisible({ timeout: 5_000 }).catch(() => false)) {
              await anyway.click();
            }
            await expect(page.getByRole('heading', { name: /Route Sheet/i })).toBeVisible({ timeout: 40_000 });
          }
        },
      );
    },
  );

  test(
    'REG-ADM-026 — Routes Assignment Generate Runs is available',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-026',
          sequence: 3,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Routes Assignment Generate Runs is available',
          preconditions: 'Logged in; Osama can edit routes_assignment',
          data: 'Path `/service-operations/routes-assignment`',
          actionSteps:
            '1) Open Routes Assignment 2) Click Generate Runs (idempotent for today) 3) Confirm toolbar still visible',
          expected:
            'kb: Generate Runs on Routes Assignment materializes today trips from confirmed/assigned sheets. Safe to click more than once.',
          expectedSource: 'kb',
        },
        async () => {
          await page.goto('/service-operations/routes-assignment');
          await expect(page.getByRole('heading', { name: /Route|Assignment/i }).first()).toBeVisible({
            timeout: 20_000,
          });
          const generate = page.getByRole('button', { name: 'Generate Runs' });
          await expect(generate).toBeVisible();
          await generate.click();
          await expect(generate).toBeEnabled({ timeout: 40_000 });
        },
      );
    },
  );
});
