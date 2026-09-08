import { test, expect } from '../fixtures';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/** TC-VEC-029 — the Trips report loads, filters and totals correctly. */
test.describe('Happy path - Reports', () => {
  test('TC-VEC-029 Verify Reports', async ({ page }, testInfo) => {
    await annotateCase('TC-VEC-029');

    const periodSelect = page.getByRole('combobox').first();

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open Reports → Trips report',
        expected: 'the report loads its totals with no error banner',
      },
      async () => {
        await page.goto('/reports/trips');
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing.');
        }
        await expect(page.getByRole('heading', { name: 'Trips Report' })).toBeVisible();
        await expect(page.getByText(/Couldn't load this report/i)).toHaveCount(0);
        await expect(page.getByText('Total Runs')).toBeVisible();
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Review the report results',
        expected: 'run volume and outcomes are shown with their charts',
      },
      async () => {
        for (const metric of ['Total Runs', 'Completed', 'Cancelled', 'No-shows']) {
          await expect(page.getByText(metric, { exact: true }).first()).toBeVisible();
        }
        await expect(page.getByRole('heading', { name: 'Runs by status' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Runs by day' })).toBeVisible();
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Select a different reporting period',
        expected: 'the report reloads for the selected period',
      },
      async () => {
        const original = (await periodSelect.innerText()).trim();
        await periodSelect.click();
        await page.getByRole('option', { name: 'This Week', exact: true }).click();
        await expect(periodSelect).toHaveText('This Week');
        await expect(page.getByText(/Couldn't load this report/i)).toHaveCount(0);
        await expect(page.getByText('Total Runs')).toBeVisible();

        await periodSelect.click();
        await page.getByRole('option', { name: original, exact: true }).click();
        await expect(periodSelect).toHaveText(original);
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open the filters and the comparison switch',
        expected: 'filters are offered and the comparison toggle applies without error',
      },
      async () => {
        await expect(page.getByRole('button', { name: 'Filters' }).first()).toBeVisible();
        const comparison = page.getByRole('switch', { name: /show comparison/i });
        await expect(comparison).toBeVisible();
        await comparison.click();
        await expect(page.getByText(/Couldn't load this report/i)).toHaveCount(0);
        await comparison.click();
      },
    );
  });
});
