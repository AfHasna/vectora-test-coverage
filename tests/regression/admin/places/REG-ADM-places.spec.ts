import { expect, type Page } from '@playwright/test';
import { test } from '../../../fixtures/regression-test';
import { adminCase } from '../../../fixtures/annotate';
import { LOOP } from '../_helpers/loop-data';
import { fillGeocodedStreet } from '../_helpers/geocode-address';

const TOTAL = 2;
const SUITE = 'Places';

test.describe.configure({ mode: 'serial' });

async function openPlaces(page: Page): Promise<void> {
  await page.goto('/stakeholders/places');
  await expect(page.getByRole('heading', { name: 'Places' })).toBeVisible({ timeout: 30_000 });
}

async function findPlace(page: Page, name: string): Promise<boolean> {
  const listed = page.getByRole('button', { name: new RegExp(name, 'i') });
  if (await listed.first().isVisible().catch(() => false)) {
    return true;
  }
  const search = page.getByPlaceholder('Search by name...');
  if (!(await search.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: 'Filters' }).click();
  }
  await expect(search).toBeVisible();
  await search.fill(name);
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
  try {
    await listed.first().waitFor({ state: 'visible', timeout: 15_000 });
    return true;
  } catch {
    return false;
  }
}

test.describe('REG-ADM Places', () => {
  test(
    'REG-ADM-015 — Create SEED_QE Loop Place with geocoded address',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-015',
          sequence: 1,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Create SEED_QE Loop Place with geocoded address',
          preconditions: `Logged in; client ${LOOP.clientName} exists`,
          data: `${LOOP.placeName} | ${LOOP.street}, ${LOOP.city} ${LOOP.zip}`,
          actionSteps:
            '1) If place listed, skip 2) Add Place, name, Address tab geocode, Save Place',
          expected:
            'kb: After the client, configure places so the route sheet wizard can anchor ETAs. Address is used for routing.',
          expectedSource: 'kb',
        },
        async () => {
          await openPlaces(page);
          if (await findPlace(page, LOOP.placeName)) {
            await expect(page.getByRole('button', { name: new RegExp(LOOP.placeName, 'i') }).first()).toBeVisible();
            return;
          }
          await page.goto('/stakeholders/places/add');
          await expect(page.getByRole('heading', { name: 'Add Place' })).toBeVisible();
          await page.getByPlaceholder('Enter place name').fill(LOOP.placeName);
          const type = page.getByRole('combobox').filter({ hasText: /Select type/i });
          if (await type.isVisible().catch(() => false)) {
            await type.click();
            const school = page.getByRole('option', { name: /School/i }).first();
            if (await school.isVisible({ timeout: 5_000 }).catch(() => false)) {
              await school.click();
            } else {
              await page.keyboard.press('Escape');
            }
          }
          await page.getByRole('tab', { name: 'Address' }).click();
          await fillGeocodedStreet(page, page);
          const save = page.getByRole('button', { name: 'Save Place' });
          await expect(save).toBeEnabled({ timeout: 20_000 });
          await save.click();
          await expect(page.getByRole('heading', { name: 'Places' })).toBeVisible({ timeout: 40_000 });
          expect(await findPlace(page, LOOP.placeName)).toBeTruthy();
        },
      );
    },
  );

  test(
    'REG-ADM-016 — Add Bell In/Out calendar on SEED place',
    { tag: '@regression' },
    async ({ page }) => {
      await adminCase(
        page,
        {
          portal: 'Admin',
          suite: SUITE,
          id: 'REG-ADM-016',
          sequence: 2,
          total: TOTAL,
          priority: 'P1',
          regression: true,
          title: 'Add Bell In/Out calendar on SEED place',
          preconditions: `Place ${LOOP.placeName} exists`,
          data: `${LOOP.calendarName} | ${LOOP.calendarStart}–${LOOP.calendarEnd} | default weekday Bell In/Out`,
          actionSteps:
            '1) Edit SEED place 2) Calendars tab 3) If calendar listed, skip 4) Else Add Calendar name+dates, confirm Bell In/Out, Add Calendar, Save Changes',
          expected:
            'kb: Place calendar (Bell In / Bell Out) lets the route sheet wizard anchor ETAs.',
          expectedSource: 'kb',
        },
        async () => {
          await openPlaces(page);
          expect(await findPlace(page, LOOP.placeName)).toBeTruthy();
          await page.getByRole('button', { name: new RegExp(LOOP.placeName, 'i') }).first().click();
          await page.getByRole('button', { name: 'Edit Place' }).click();
          await expect(page.getByRole('heading', { name: 'Edit Place' })).toBeVisible({ timeout: 20_000 });
          await page.getByRole('tab', { name: 'Calendars' }).click();
          if (await page.getByText(LOOP.calendarName, { exact: true }).first().isVisible().catch(() => false)) {
            await page.getByRole('button', { name: 'Cancel' }).click();
            return;
          }
          const addCal = page.getByRole('button', { name: /Add (First )?Calendar/i }).first();
          await addCal.click();
          const dialog = page.getByRole('dialog');
          await expect(dialog.getByRole('heading', { name: 'Add Calendar' })).toBeVisible();
          await dialog.getByPlaceholder('e.g., School Year 2025-2026').fill(LOOP.calendarName);
          const dates = dialog.getByPlaceholder('MM/DD/YYYY');
          await dates.nth(0).fill(LOOP.calendarStart);
          await dates.nth(1).fill(LOOP.calendarEnd);
          const scheduleTab = dialog.getByRole('tab', { name: /Default Schedule/i });
          if (await scheduleTab.isVisible().catch(() => false)) {
            await scheduleTab.click();
            await expect(dialog.getByText('Bell In').first()).toBeVisible();
            await expect(dialog.getByText('Bell Out').first()).toBeVisible();
          }
          await dialog.getByRole('button', { name: 'Add Calendar' }).click();
          await expect(dialog.getByRole('heading', { name: 'Add Calendar' })).toBeHidden({ timeout: 15_000 });
          await expect(page.getByText(LOOP.calendarName).first()).toBeVisible();
          await page.getByRole('button', { name: 'Save Changes' }).click();
          await expect(page.getByRole('heading', { name: 'Places' })).toBeVisible({ timeout: 40_000 });
        },
      );
    },
  );
});
