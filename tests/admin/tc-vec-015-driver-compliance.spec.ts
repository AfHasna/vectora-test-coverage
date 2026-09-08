import { test, expect } from '../fixtures';
import { complianceTabs } from '../helpers/catalog';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/** TC-VEC-015 — driver compliance details open from the row action menu. */
test.describe('Happy path - Compliance Management', () => {
  test('TC-VEC-015 Verify Driver Compliance Details', async ({ page }, testInfo) => {
    await annotateCase('TC-VEC-015');

    const firstRow = page.locator('tbody tr').first();
    let driverName = '';

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open Compliance Management → Driver Compliance',
        expected: 'the driver compliance list loads with the compliance tabs',
      },
      async () => {
        await page.goto('/compliance/drivers');
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing.');
        }
        await expect(page.getByRole('heading', { name: 'Compliance Management' })).toBeVisible();
        await expect(page.getByRole('tab')).toHaveText(complianceTabs.map((tab) => tab.name));
        await expect(page.getByRole('table')).toBeVisible();
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Locate a driver with compliance information',
        expected: 'the first row names a driver and its checks and documents',
      },
      async () => {
        await expect(firstRow).toBeVisible();
        driverName = (await firstRow.locator('td').nth(1).innerText()).trim().split('\n')[0];
        expect(driverName.length).toBeGreaterThan(0);
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open the row action menu and select Compliance Details',
        expected: 'the menu offers Compliance Details and the dialog opens for that driver',
      },
      async () => {
        await firstRow.locator('td').last().getByRole('button').first().click();
        await expect(page.getByRole('menuitem', { name: /compliance details/i })).toBeVisible();
        await page.getByRole('menuitem', { name: /compliance details/i }).click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await expect(
          page.getByRole('dialog').getByRole('heading', { name: /Compliance Details/i }),
        ).toBeVisible();
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Review the status banner, expirations and outstanding issues',
        expected: 'background checks and documents are listed for the driver',
      },
      async () => {
        const dialog = page.getByRole('dialog');
        await expect(dialog.getByRole('heading', { name: 'Background Checks' })).toBeVisible();
        await expect(dialog.getByRole('heading', { name: 'Documents' })).toBeVisible();
        await expect(dialog.getByRole('heading', { name: new RegExp(driverName, 'i') })).toBeVisible();
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Close the dialog',
        expected: 'the list returns with no dialog open',
      },
      async () => {
        await page.keyboard.press('Escape');
        await expect(page.getByRole('dialog')).toHaveCount(0);
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Click the driver name',
        expected: 'the related driver profile opens',
      },
      async () => {
        await firstRow.getByRole('button', { name: driverName }).click();
        // The profile opens as a record dialog rather than a route change.
        await expect(page.locator('html')).toHaveAttribute(
          'data-active-dialog-id',
          /record-view/,
        );
        await expect(page.getByRole('dialog')).toBeVisible();
      },
    );
  });
});
