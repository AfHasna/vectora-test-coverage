import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { requireSession, test } from '@fixtures/pages.fixture';
import { DriversAvailabilityPage } from '@pages/workforce/DriversAvailabilityPage';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/** TC-VEC-010 — the weekly driver-availability matrix. */
test.describe('Happy path - Workforce Management', () => {
  test(
    'TC-VEC-010 Verify Driver Availability',
    { tag: [SUITE.regression, MODULE.workforce, READ_ONLY] },
    async ({ page, driversAvailability }, testInfo) => {
      await annotateCase(
        'TC-VEC-010',
        'The page has no "This Week" button; it navigates by date with 1 day / 7 days views, so those are used instead.',
      );

      let openingDate = '';

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open Workforce Management → Driver Availability',
          expected: 'the availability matrix loads with its tab selected',
        },
        async () => {
          requireSession(await driversAvailability.open());
          openingDate = await driversAvailability.currentDate();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Review the current period in the 7 days view',
          expected: 'the matrix shows drivers with their availability totals',
        },
        async () => {
          await driversAvailability.showSevenDays();
          await driversAvailability.expectSummaryTotals();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Move forward a week using the date field',
          expected: 'the matrix reloads on the later date',
        },
        async () => {
          await driversAvailability.goToDate(DriversAvailabilityPage.shiftDate(openingDate, 7));
          await driversAvailability.expectSummaryTotals();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Return to the opening date',
          expected: 'the matrix returns to the original period',
        },
        async () => {
          await driversAvailability.goToDate(openingDate);
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Filter to available drivers only, then clear the filters',
          expected: 'the filters change the matrix and can be cleared',
        },
        async () => {
          await driversAvailability.filterToAvailable();
          await driversAvailability.clearFilters();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Review the availability cells for assigned drivers',
          expected: 'assigned cells name the route they are assigned to',
        },
        async () => {
          await driversAvailability.expectAssignedCellNamesRoute();
        },
      );
    },
  );
});
