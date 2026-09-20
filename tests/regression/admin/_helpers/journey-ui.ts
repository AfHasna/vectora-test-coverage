import { expect, type Locator, type Page } from '@playwright/test';
import { LOOP } from './loop-data';
import { applyNameFilter } from './list-filter';
import { fillGeocodedStreet } from './geocode-address';

export const PASSENGER_NAME = LOOP.passengerName;
export const GUARDIAN_NAME = LOOP.guardianName;

export async function filterAndOpenNamed(page: Page, name: string): Promise<void> {
  const listed = page.getByRole('button', { name, exact: true });
  try {
    await listed.first().waitFor({ state: 'visible', timeout: 8_000 });
  } catch {
    await applyNameFilter(page, name);
    await listed.first().waitFor({ state: 'visible', timeout: 15_000 });
  }
  await listed.first().click();
}

export async function openPassengerView(page: Page): Promise<void> {
  await page.goto('/stakeholders/passengers');
  await expect(page.getByRole('heading', { name: 'Passengers' })).toBeVisible({ timeout: 30_000 });
  await filterAndOpenNamed(page, PASSENGER_NAME);
  await expect(page.getByRole('dialog').getByRole('heading', { name: new RegExp(PASSENGER_NAME) })).toBeVisible({
    timeout: 20_000,
  });
}

export async function pickCommandOption(
  page: Page,
  trigger: Locator,
  searchPlaceholder: string | RegExp,
  option: string | RegExp,
): Promise<void> {
  await trigger.click();
  const search = page.getByPlaceholder(searchPlaceholder);
  if (await search.isVisible({ timeout: 4_000 }).catch(() => false)) {
    const text = typeof option === 'string' ? option : option.source;
    await search.fill(text.replace(/\\/g, ''));
  }
  const item = page.getByRole('option', { name: option }).or(page.getByText(option)).first();
  await item.click();
}

export async function openClientEdit(page: Page): Promise<void> {
  await page.goto('/stakeholders/clients');
  await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible({ timeout: 30_000 });
  await filterAndOpenNamed(page, LOOP.clientName);
  await page.getByRole('dialog').getByRole('button', { name: 'Edit Client' }).click();
  await expect(page.getByRole('heading', { name: /Edit Client/i })).toBeVisible({ timeout: 20_000 });
}

export async function openPassengerEdit(page: Page): Promise<void> {
  await openPassengerView(page);
  await page.getByRole('dialog').getByRole('button', { name: 'Edit Passenger' }).click();
  await expect(page.getByRole('heading', { name: /Edit Passenger/i })).toBeVisible({ timeout: 25_000 });
}

export async function ensurePassengerHomeAddress(page: Page): Promise<void> {
  await openPassengerEdit(page);
  if (await page.getByText(LOOP.street).first().isVisible().catch(() => false)) {
    await page.getByRole('button', { name: /Cancel|Back/i }).first().click();
    return;
  }
  await page.getByRole('button', { name: 'Add Address' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: /Add Address/i })).toBeVisible();
  await dialog.getByRole('combobox').filter({ hasText: /Select or type name/i }).click();
  const nickSearch = page.getByPlaceholder(/Search/i);
  if (await nickSearch.isVisible().catch(() => false)) {
    await nickSearch.fill('Home');
  }
  await page
    .locator('[cmdk-item], [role="option"]')
    .filter({ hasText: /^Home$/ })
    .first()
    .click();
  await fillGeocodedStreet(page, dialog);
  const saveAddress = dialog.getByRole('button', { name: 'Save Address' });
  await expect(saveAddress).toBeEnabled({ timeout: 20_000 });
  await saveAddress.click();
  await expect(dialog.getByRole('heading', { name: /Add Address/i })).toBeHidden({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByRole('heading', { name: 'Passengers' })).toBeVisible({ timeout: 40_000 });
}

export async function ensureClientPortalUser(page: Page): Promise<void> {
  await openClientEdit(page);
  await page.getByRole('tab', { name: 'Client Portal Access' }).click();
  await expect(page.getByText('Client Portal Access').first()).toBeVisible();
  try {
    await page.getByText(LOOP.clientEmail).first().waitFor({ state: 'visible', timeout: 8_000 });
    await page.getByRole('button', { name: /Cancel|Back/i }).first().click();
    return;
  } catch {
    // create the portal user
  }
  await page.locator('#portal-first-name').fill(LOOP.contactFirst);
  await page.locator('#portal-last-name').fill(LOOP.contactLast);
  await page.locator('#portal-email').fill(LOOP.clientEmail);
  await page.locator('#portal-password').fill(LOOP.clientPortalPassword);
  await page.getByRole('button', { name: /Activate Portal Access|Add Portal User/i }).click();
  await expect(page.getByText(LOOP.clientEmail).first()).toBeVisible({ timeout: 40_000 });
}

export async function filterByPassengerName(page: Page, query: string = PASSENGER_NAME): Promise<void> {
  const includeAssigned = page.getByLabel(/Include assigned trips/i);
  if (await includeAssigned.count()) {
    await includeAssigned.setChecked(true);
  }
  const search = page.getByPlaceholder(/Search routes|Search by route #, client/i);
  if (!(await search.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /Filters/i }).click();
  }
  await expect(search).toBeVisible({ timeout: 15_000 });
  await search.fill(query);
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
}

export async function openFirstRowActions(page: Page): Promise<void> {
  const row = page.getByRole('row').filter({ hasText: /RSO-|RSR-/ }).first();
  await openRowActions(row);
}

export async function openRowActions(row: Locator): Promise<void> {
  await row.locator('td').last().getByRole('button').click();
}

export async function findLoopSheet(page: Page): Promise<boolean> {
  await page.goto('/service-operations/route-sheets');
  await expect(page.getByRole('heading', { name: /Route Sheet/i })).toBeVisible({ timeout: 30_000 });
  try {
    await filterByPassengerName(page);
    await expect(page.getByText(PASSENGER_NAME).first()).toBeVisible({ timeout: 12_000 });
    return true;
  } catch {
    return false;
  }
}
