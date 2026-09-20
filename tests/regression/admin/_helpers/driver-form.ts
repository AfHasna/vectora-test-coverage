import { expect, type Page } from '@playwright/test';
import { LOOP } from './loop-data';
import { fillGeocodedStreet } from './geocode-address';

export async function findLoopDriver(page: Page): Promise<boolean> {
  await page.goto('/workforce/drivers');
  await expect(page.getByRole('heading', { name: 'Drivers', exact: true })).toBeVisible({ timeout: 30_000 });
  const listed = page.getByRole('button', { name: LOOP.driverName, exact: true }).first();
  if (await listed.isVisible().catch(() => false)) {
    return true;
  }
  const search = page.getByPlaceholder(/Search by name or code/i);
  if (!(await search.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /Filters/i }).click();
  }
  const reset = page.getByRole('button', { name: 'Reset Filter' });
  if (await reset.isEnabled().catch(() => false)) {
    await reset.click();
  }
  await expect(search).toBeVisible();
  await search.fill(LOOP.driverLast);
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
  await page.getByText('Updating', { exact: false }).first().waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => {});
  return listed.isVisible({ timeout: 15_000 }).catch(() => false);
}

export async function ensureLoopInternalDriver(page: Page): Promise<void> {
  if (!(await findLoopDriver(page))) {
    await page.goto('/workforce/drivers/add');
  await expect(page.getByRole('heading', { name: /Add New Driver/i })).toBeVisible({ timeout: 20_000 });
  await page.locator('#firstName').fill(LOOP.driverFirst);
  await page.locator('#lastName').fill(LOOP.driverLast);
  const dob = page.getByPlaceholder(/mm\/dd\/yyyy/i).first();
  await dob.click();
  await dob.pressSequentially('01011990', { delay: 30 });
  await dob.press('Tab');
  await page.getByRole('combobox').filter({ hasText: /Select gender|Gender|Male|Female/i }).first().click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.locator('#phone').fill(LOOP.driverPhone);

  await page.getByRole('button', { name: 'Add Address' }).first().click();
  const addr = page.getByRole('dialog');
  await expect(addr.getByRole('heading', { name: /Add Address/i })).toBeVisible({ timeout: 10_000 });
  await fillGeocodedStreet(page, addr);
  await addr.getByRole('button', { name: /Save Address|Save/i }).click();
  await expect(addr).toBeHidden({ timeout: 15_000 }).catch(async () => {
    await page.keyboard.press('Escape');
  });

  await page.getByRole('button', { name: /Add Emergency Contact/i }).click();
  const contact = page.getByRole('dialog');
  await expect(contact.getByRole('heading', { name: /Add Emergency Contact/i })).toBeVisible({ timeout: 10_000 });
  await contact.getByPlaceholder(/Enter contact name/i).fill('SEED LoopEmerg');
  await contact.locator('input[type="tel"]').or(contact.getByRole('textbox', { name: /phone/i })).first().fill('(508) 555-0199');
  await contact.getByRole('button', { name: 'Add Contact' }).click();
  await expect(contact.getByRole('heading', { name: /Add Emergency Contact/i })).toBeHidden({ timeout: 15_000 });

  await page.getByRole('tab', { name: 'Service & Assignment' }).click();
  await page.getByRole('button', { name: /Add Service Area/i }).first().click();
  const area = page.getByRole('dialog');
  await expect(area.getByRole('heading', { name: /Add Service Area/i })).toBeVisible({ timeout: 10_000 });
  await area.locator('#service-area-name').fill(LOOP.city);
  await area.getByRole('button', { name: /Save|Add/i }).click();
  await expect(area).toBeHidden({ timeout: 10_000 });

  await page.getByRole('tab', { name: 'License & Documents' }).click();
  await page.getByRole('combobox').filter({ hasText: /Select license|License Type|Class/i }).first().click();
  await page.getByRole('option', { name: /Class D \(Standard\)/i }).click();
  const licenseExp = page.getByPlaceholder(/mm\/dd\/yyyy/i).first();
  await licenseExp.click();
  await licenseExp.pressSequentially('12312027', { delay: 30 });
  await licenseExp.press('Tab');
  await page.locator('#licenseNumber').fill(LOOP.driverLicense);

  await page.getByRole('tab', { name: 'Payment Info' }).click();
  await page.locator('#payRatePerMile').fill('1.50');
  await page.locator('#bankName').fill('Bank of America');
  await page.locator('#accountName').fill(LOOP.driverName);
  await page.locator('#accountNumber').fill('123456789');
  await page.locator('#routingNumber').fill('011000015');

  await page.getByRole('button', { name: 'Save Driver' }).click();
  await expect(page.getByText(/Driver created|Couldn't add driver|Missing required/i).first()).toBeVisible({
    timeout: 40_000,
  });
  await expect(page.getByText("Couldn't add driver")).toHaveCount(0);
  await expect(page.getByText(/Missing required/i)).toHaveCount(0);
  await expect(page).toHaveURL(/\/workforce\/drivers\/?$/, { timeout: 15_000 });
  }
  await prepareLoopDriverForAssignment(page);
}

/** Assignments picker only lists active drivers; eligible ones also need a paired vehicle. */
export async function prepareLoopDriverForAssignment(page: Page): Promise<void> {
  if (!(await findLoopDriver(page))) {
    throw new Error(`Driver ${LOOP.driverName} is not on the Drivers list`);
  }
  const rows = page.getByRole('row').filter({
    has: page.getByRole('button', { name: LOOP.driverName, exact: true }),
  });
  await expect(rows.first()).toBeVisible({ timeout: 15_000 });
  const n = await rows.count();
  for (let i = 0; i < n; i += 1) {
    const row = rows.nth(i);
    const status = row.getByRole('combobox').filter({ hasText: /Active|Suspended|Terminated/i }).last();
    await expect(status).toBeVisible({ timeout: 10_000 });
    if (!(await status.getByText('Active', { exact: true }).isVisible().catch(() => false))) {
      await status.click();
      await page.getByRole('option', { name: 'Active', exact: true }).click();
      await expect(page.getByText(/Status updated/i).first()).toBeVisible({ timeout: 20_000 }).catch(() => undefined);
    }
  }

  const paired = page.getByRole('combobox').filter({ hasText: LOOP.plate });
  if (await paired.first().isVisible().catch(() => false)) {
    return;
  }

  const row = rows.first();
  const vehicle = row.getByRole('combobox').filter({ hasText: /No vehicle/i }).first();
  if (!(await vehicle.isVisible().catch(() => false))) {
    return;
  }
  await vehicle.click();
  const vSearch = page.getByPlaceholder(/Search vehicles/i);
  if (!(await vSearch.isVisible().catch(() => false))) {
    return;
  }
  await vSearch.fill(LOOP.plate);
  const plateOpt = page.getByRole('option', { name: new RegExp(LOOP.plate) });
  if (await plateOpt.first().isVisible().catch(() => false)) {
    await plateOpt.first().click();
  }
}
