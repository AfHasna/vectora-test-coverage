import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { expect, requireSession, test } from '@fixtures/pages.fixture';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/** TC-VEC-029 — the Trips report loads, filters and totals correctly. */
test.describe('Happy path - Reports', () => {
  test(
    'TC-VEC-029 Verify Reports',
    { tag: [SUITE.smoke, MODULE.reports, READ_ONLY] },
    async ({ page, tripsReport }, testInfo) => {
      await annotateCase('TC-VEC-029');

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open Reports → Trips report',
          expected: 'the report loads its totals with no error banner',
        },
        async () => {
          requireSession(await tripsReport.open());
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
          await tripsReport.expectMetrics(['Total Runs', 'Completed', 'Cancelled', 'No-shows']);
          await tripsReport.expectCharts();
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
          const original = await tripsReport.currentPeriod();
          await tripsReport.selectPeriod('This Week');
          await tripsReport.expectMetrics(['Total Runs']);
          await tripsReport.selectPeriod(original);
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
          await expect(tripsReport.table.filtersButton).toBeVisible();
          await tripsReport.toggleComparison();
          await tripsReport.toggleComparison();
        },
      );
    },
  );
});
