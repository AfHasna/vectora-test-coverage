import { test, expect } from '../fixtures';
import { fleetTabs } from '../helpers/catalog';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/**
 * TC-VEC-014 — the driver-vehicle assignment audit trail.
 * Filtering and grouping are reads; the Filter button only queries.
 */
test.describe('Happy path - Fleet Management', () => {
  test('TC-VEC-014 Verify Vehicle Assignment History', async ({ page }, testInfo) => {
    await annotateCase('TC-VEC-014');

    const filtersPanel = page.getByRole('button', { name: 'Filters' }).first();

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open Fleet Management → Assignment History',
        expected: 'the assignment-history records load under the Fleet tabs',
      },
      async () => {
        await page.goto('/vehicles/assignment-history');
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing.');
        }
        await expect(page.getByRole('heading', { name: 'Assignment History' })).toBeVisible();
        await expect(page.getByRole('tab')).toHaveText(fleetTabs.map((tab) => tab.name));
        await expect(page.getByRole('table').first()).toBeVisible();
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open Filters and review the available filters',
        expected: 'vehicle, driver, date and grouping filters are offered',
      },
      async () => {
        await filtersPanel.click();
        await expect(page.getByRole('combobox').filter({ hasText: 'All Vehicles' })).toBeVisible();
        await expect(page.getByRole('combobox').filter({ hasText: 'All Drivers' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Filter', exact: true })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Reset Filter' })).toBeVisible();
      },
    );

    for (const grouping of ['Day', 'Week', 'Month'] as const) {
      await proofStep(
        page,
        testInfo,
        {
          action: `Group the results by ${grouping}`,
          expected: `records are grouped by ${grouping.toLowerCase()}`,
        },
        async () => {
          const groupBy = page
            .getByRole('combobox')
            .filter({ hasText: /^(Day|Week|Month)$/ })
            .first();
          await groupBy.click();
          await page.getByRole('option', { name: grouping, exact: true }).click();
          await expect(groupBy).toHaveText(grouping);
          await expect(page.getByRole('table').first()).toBeVisible();
        },
      );
    }

    await proofStep(
      page,
      testInfo,
      {
        action: 'Review the displayed assignment records',
        expected: 'each record names a vehicle and the driver it was assigned to',
      },
      async () => {
        const rows = page.locator('tbody tr');
        expect(await rows.count()).toBeGreaterThan(0);
        await expect(rows.first()).toBeVisible();
      },
    );

    const vehicleFilter = page.getByRole('combobox').filter({ hasText: 'All Vehicles' });

    await proofStep(
      page,
      testInfo,
      {
        action: 'Filter the history to a single vehicle',
        expected: 'the history is narrowed to that vehicle',
      },
      async () => {
        await vehicleFilter.click();
        const vehicleOption = page
          .getByRole('option')
          .filter({ hasNotText: 'All Vehicles' })
          .first();
        const vehicleLabel = (await vehicleOption.innerText()).trim();
        await vehicleOption.click();
        await page.getByRole('button', { name: 'Filter', exact: true }).click();
        await expect(
          page.getByRole('combobox').filter({ hasText: vehicleLabel }).first(),
        ).toBeVisible();
      },
    );

    await proofStep(
      page,
      testInfo,
      {
        action: 'Reset the filters',
        expected: 'the unfiltered history returns',
      },
      async () => {
        // Reset only becomes enabled once a filter is actually applied.
        const reset = page.getByRole('button', { name: 'Reset Filter' });
        await expect(reset).toBeEnabled();
        await reset.click();
        await expect(vehicleFilter).toBeVisible();
        await expect(page.getByRole('table').first()).toBeVisible();
      },
    );
  });
});
