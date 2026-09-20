import { expect, type Page } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { adminCase } from '../../../fixtures/annotate';
import { LOOP } from '../_helpers/loop-data';
import { applyNameFilter } from '../_helpers/list-filter';

const TOTAL = 2;
const SUITE = 'Fleet';

test.describe.configure({ mode: 'serial' });

async function openVehicles(page: Page): Promise<void> {
  await page.goto('/vehicles');
  await expect(page.getByRole('heading', { name: /Fleet Management|Vehicles/i })).toBeVisible({
    timeout: 30_000,
  });
}

async function findPlate(page: Page): Promise<boolean> {
  const listed = page.getByText(LOOP.plate, { exact: true });
  if (await listed.first().isVisible().catch(() => false)) {
    return true;
  }
  await applyNameFilter(page, LOOP.plate, /Search vehicles/i);
  try {
    await listed.first().waitFor({ state: 'visible', timeout: 15_000 });
    return true;
  } catch {
    return false;
  }
}

test.describe('REG-ADM Fleet vehicle form', () => {
  test(
    'REG-ADM-020 — Add Vehicle form lists required fleet fields',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-020',
          sequence: 1,
          total: TOTAL,
          priority: 'P2',
          regression: true,
          title: 'Add Vehicle form lists required fleet fields',
          preconditions: 'Logged in; `/vehicles`',
          data: '—',
          actionSteps: '1) Open Add Vehicle 2) Confirm required plate/make fields 3) Cancel without save',
          expected:
            'kb: Add Vehicle is Fleet → Vehicles → + Add Vehicle. Drivers, providers, and vehicles are required before route sheets.',
          expectedSource: 'kb',
        },
        async () => {
          await openVehicles(page);
          await page.getByRole('button', { name: /Add Vehicle/i }).click();
          const dialog = page.getByRole('dialog');
          await expect(dialog.getByText(/License Plate/i).first()).toBeVisible({ timeout: 15_000 });
          await expect(dialog.getByText(/Vehicle Type/i).first()).toBeVisible();
          await dialog.getByRole('button', { name: /Cancel/i }).click();
        },
      );
    },
  );

  test(
    'REG-ADM-022 — Create SEEDLOOP1 internal vehicle',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-022',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Create SEEDLOOP1 internal vehicle',
          preconditions: 'Logged in; Fleet Vehicles',
          data: `${LOOP.plate} | ${LOOP.vehicleMake} ${LOOP.vehicleModel} | ${LOOP.insuranceCompany} ${LOOP.policyNumber} | exp ${LOOP.fleetExpiration}`,
          actionSteps:
            '1) If plate listed, skip 2) Add Vehicle, Internal, plate/make/model/color/capacity/type 3) Registration + Insurance expirations 4) Add Vehicle',
          expected:
            'kb: Vehicles are required before route sheets. Add Vehicle is Fleet → Vehicles → + Add Vehicle.',
          expectedSource: 'kb',
        },
        async () => {
          await openVehicles(page);
          if (await findPlate(page)) {
            await expect(page.getByText(LOOP.plate, { exact: true }).first()).toBeVisible();
            return;
          }
          await page.getByRole('button', { name: /Add Vehicle/i }).click();
          const dialog = page.getByRole('dialog');
          await expect(dialog.getByText(/License Plate/i).first()).toBeVisible({ timeout: 15_000 });
          await dialog.getByLabel(/Internal/i).click();
          await dialog.getByPlaceholder('e.g., VAN-005').fill(LOOP.plate);
          await dialog.getByPlaceholder('e.g., Ford').fill(LOOP.vehicleMake);
          await dialog.getByPlaceholder('e.g., Transit').fill(LOOP.vehicleModel);
          await dialog.getByRole('combobox').filter({ hasText: /Select color|White|Color/i }).click();
          const white = page.getByRole('option', { name: LOOP.vehicleColor });
          if (await white.isVisible({ timeout: 5_000 }).catch(() => false)) {
            await white.click();
          } else {
            await page.getByText(LOOP.vehicleColor, { exact: true }).first().click();
          }
          await dialog.getByPlaceholder('e.g., 8').fill(LOOP.vehicleCapacity);
          await dialog.getByRole('combobox').filter({ hasText: /Select vehicle type/i }).click();
          await page.getByRole('option').first().click();
          await dialog.getByRole('tab', { name: /Registration/i }).click();
          await dialog.getByPlaceholder('MM/DD/YYYY').first().fill(LOOP.fleetExpiration);
          await dialog.getByRole('tab', { name: 'Insurance' }).click();
          await dialog.getByPlaceholder('e.g., State Farm').fill(LOOP.insuranceCompany);
          await dialog.getByPlaceholder('e.g., POL-123456').fill(LOOP.policyNumber);
          await dialog.getByPlaceholder('MM/DD/YYYY').first().fill(LOOP.fleetExpiration);
          await dialog.getByRole('button', { name: 'Add Vehicle' }).click();
          await expect(dialog.getByText(/License Plate/i).first()).toBeHidden({ timeout: 30_000 });
          expect(await findPlate(page)).toBeTruthy();
        },
      );
    },
  );
});
