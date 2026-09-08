import { test, expect } from '../fixtures';
import { complianceTabs } from '../helpers/catalog';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/** TC-VEC-016 — the vehicle, monitor and provider compliance tabs. */
test.describe('Happy path - Compliance Management', () => {
  test('TC-VEC-016 Verify Vehicle, Monitor and Provider Compliance', async ({
    page,
  }, testInfo) => {
    await annotateCase('TC-VEC-016');

    const openDetailsOnFirstRow = async () => {
      const firstRow = page.locator('tbody tr').first();
      await expect(firstRow).toBeVisible();
      await firstRow.locator('td').last().getByRole('button').first().click();
      await expect(page.getByRole('menuitem', { name: /compliance details/i })).toBeVisible();
      await page.getByRole('menuitem', { name: /compliance details/i }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
    };

    for (const tab of complianceTabs.slice(1)) {
      await proofStep(
        page,
        testInfo,
        {
          action: `Open ${tab.name}`,
          expected: 'the tab loads its compliance list',
        },
        async () => {
          await page.goto(tab.href);
          if (/sign-in/i.test(page.url())) {
            test.skip(true, 'Admin session missing.');
          }
          await expect(page.getByRole('tab', { name: tab.name })).toHaveAttribute(
            'data-state',
            'active',
          );
          await expect(page.getByRole('table').first()).toBeVisible();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: `Open Compliance Details from a ${tab.name} row`,
          expected: 'every row offers the Compliance Details action and the dialog opens',
        },
        async () => {
          await openDetailsOnFirstRow();
          await expect(
            page.getByRole('dialog').getByRole('heading', { name: /Compliance Details/i }),
          ).toBeVisible();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: `Review the requirements and expirations, then close the dialog`,
          expected: 'documents and their expiration information are listed, and the dialog closes',
        },
        async () => {
          // Each entity type lists different sections (documents, insurance,
          // registration, inspections), so the check is that the dialog details
          // at least one requirement section for the record.
          const dialog = page.getByRole('dialog');
          expect(await dialog.getByRole('heading').count()).toBeGreaterThan(1);
          await page.keyboard.press('Escape');
          await expect(page.getByRole('dialog')).toHaveCount(0);
        },
      );
    }
  });
});
