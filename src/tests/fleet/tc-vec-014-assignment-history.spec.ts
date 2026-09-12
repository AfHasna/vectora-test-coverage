import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { requireSession, test } from '@fixtures/pages.fixture';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/**
 * TC-VEC-014 — the driver-vehicle assignment audit trail.
 * Filtering and grouping are reads; the Filter button only queries.
 */
test.describe('Happy path - Fleet Management', () => {
  test(
    'TC-VEC-014 Verify Vehicle Assignment History',
    { tag: [SUITE.regression, MODULE.fleet, READ_ONLY] },
    async ({ page, assignmentHistory }, testInfo) => {
      await annotateCase('TC-VEC-014');

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open Fleet Management → Assignment History',
          expected: 'the assignment-history records load under the Fleet tabs',
        },
        async () => {
          requireSession(await assignmentHistory.open());
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
          await assignmentHistory.table.openFilters();
          await assignmentHistory.expectFilterOptions();
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
            await assignmentHistory.groupResultsBy(grouping);
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
          await assignmentHistory.table.expectHasRows();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Filter the history to a single vehicle',
          expected: 'the history is narrowed to that vehicle',
        },
        async () => {
          await assignmentHistory.filterToFirstVehicle();
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
          await assignmentHistory.resetFilters();
        },
      );
    },
  );
});
