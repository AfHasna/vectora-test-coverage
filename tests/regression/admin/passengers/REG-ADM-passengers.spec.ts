import { expect, type Page } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { adminCase } from '../../../fixtures/annotate';
import { LOOP } from '../_helpers/loop-data';
import { applyNameFilter } from '../_helpers/list-filter';

const TOTAL = 2;
const SUITE = 'Passengers';
const PASSENGER_NAME = `${LOOP.passengerFirst} ${LOOP.passengerLast}`;
const GUARDIAN_NAME = `${LOOP.guardianFirst} ${LOOP.guardianLast}`;

test.describe.configure({ mode: 'serial' });

async function openPassengers(page: Page): Promise<void> {
  await page.goto('/stakeholders/passengers');
  await expect(page.getByRole('heading', { name: 'Passengers' })).toBeVisible({ timeout: 30_000 });
}

async function findPassenger(page: Page): Promise<boolean> {
  const listed = page.getByRole('button', { name: PASSENGER_NAME, exact: true });
  if (await listed.first().isVisible().catch(() => false)) {
    return true;
  }
  await applyNameFilter(page, LOOP.passengerLast);
  try {
    await listed.first().waitFor({ state: 'visible', timeout: 15_000 });
    return true;
  } catch {
    return false;
  }
}

test.describe('REG-ADM Passengers', () => {
  test(
    'REG-ADM-018 — Create SEED LoopChild passenger in Draft linked to client',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-018',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Create SEED LoopChild passenger linked to SEED client',
          preconditions: `Client ${LOOP.clientName} and guardian ${GUARDIAN_NAME} exist`,
          data: `${PASSENGER_NAME} | client ${LOOP.clientName} | place ${LOOP.placeName} | guardian ${GUARDIAN_NAME}`,
          actionSteps:
            '1) If passenger listed, skip 2) Add Passenger first/last 3) Needs: select SEED client and place 4) Contacts: Link guardian 5) Save Passenger',
          expected:
            'kb: Add passengers at /stakeholders/passengers/add, link to client in Needs & Assignments. New passengers start Draft. Pickup/dropoff lives on the route sheet wizard.',
          expectedSource: 'kb',
        },
        async () => {
          await openPassengers(page);
          if (await findPassenger(page)) {
            await expect(page.getByRole('button', { name: PASSENGER_NAME }).first()).toBeVisible();
            return;
          }
          await page.goto('/stakeholders/passengers/add');
          await expect(page.getByRole('heading', { name: /Add.*Passenger|New Passenger/i })).toBeVisible({
            timeout: 20_000,
          });
          await page.getByRole('textbox', { name: /First Name/i }).fill(LOOP.passengerFirst);
          await page.getByRole('textbox', { name: /Last Name/i }).fill(LOOP.passengerLast);
          await page.getByRole('tab', { name: /Needs/i }).click();
          await page.getByRole('combobox').filter({ hasText: /Select clients/i }).click();
          await page.getByPlaceholder('Search clients...').fill(LOOP.clientName);
          await page.getByRole('option', { name: LOOP.clientName }).first().click();
          await page.keyboard.press('Escape');
          const places = page.getByRole('combobox').filter({ hasText: /Select places/i });
          if (await places.isVisible().catch(() => false)) {
            await places.click();
            const placeSearch = page.getByPlaceholder('Search places...');
            if (await placeSearch.isVisible().catch(() => false)) {
              await placeSearch.fill(LOOP.placeName);
            }
            const placeOpt = page.getByRole('option', { name: new RegExp(LOOP.placeName, 'i') }).first();
            if (await placeOpt.isVisible({ timeout: 5_000 }).catch(() => false)) {
              await placeOpt.click();
            }
            await page.keyboard.press('Escape');
          }
          await page.getByRole('tab', { name: 'Contacts' }).click();
          await page.getByRole('button', { name: /Link to this Passenger/i }).click();
          const link = page.getByRole('dialog');
          await expect(link.getByRole('heading', { name: /Link/i })).toBeVisible({ timeout: 10_000 });
          const gSearch = link.getByPlaceholder(/Search/i);
          if (await gSearch.isVisible().catch(() => false)) {
            await gSearch.fill(LOOP.guardianLast);
          }
          const gOpt = link.getByRole('option', { name: new RegExp(GUARDIAN_NAME, 'i') }).or(
            link.getByText(GUARDIAN_NAME),
          );
          await gOpt.first().click();
          const confirm = link.getByRole('button', { name: /Link|Add|Save/i });
          if (await confirm.isVisible().catch(() => false)) {
            await confirm.click();
          }
          await page.getByRole('button', { name: 'Save Passenger' }).click();
          await expect(page.getByRole('heading', { name: 'Passengers' })).toBeVisible({ timeout: 40_000 });
          expect(await findPassenger(page)).toBeTruthy();
        },
      );
    },
  );

  test(
    'REG-ADM-024 — Set SEED LoopChild passenger status to Active',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-024',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Set SEED LoopChild passenger status to Active',
          preconditions: `Passenger ${PASSENGER_NAME} exists`,
          data: PASSENGER_NAME,
          actionSteps: '1) Find passenger 2) If Active, skip 3) Else inline status → Active',
          expected:
            'kb: New passengers start Draft. At least one passenger must be Active for route-run generation.',
          expectedSource: 'kb',
        },
        async () => {
          await openPassengers(page);
          expect(await findPassenger(page)).toBeTruthy();
          const row = page.locator('tr').filter({ hasText: PASSENGER_NAME }).first();
          const status = row.getByRole('combobox');
          const current = (await status.innerText().catch(() => '')).toLowerCase();
          if (current.includes('active') && !current.includes('inactive')) {
            return;
          }
          await status.click();
          await page.getByRole('option', { name: 'Active' }).click();
          await expect(status).toContainText(/Active/i, { timeout: 15_000 });
        },
      );
    },
  );
});
