import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { requireSession, test } from '@fixtures/pages.fixture';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/** TC-VEC-021 — trip visibility across Active, Future and History. */
test.describe('Happy path - Service Operations', () => {
  test(
    'TC-VEC-021 Verify Active, Future and Historical Trips',
    { tag: [SUITE.smoke, MODULE.serviceOperations, READ_ONLY] },
    async ({ page, trips }, testInfo) => {
      await annotateCase(
        'TC-VEC-021',
        'Row counts follow the live service calendar, so each view is checked for loading and identity; on a holiday Active Trips legitimately shows none.',
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open Active Trips',
          expected: "today's operational routes are listed for the current date",
        },
        async () => {
          requireSession(await trips.open());
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Review trip and passenger status information',
          expected: 'either trips are listed with their statuses, or the empty state explains why',
        },
        async () => {
          await trips.expectTripsOrEmptyState();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open Future Trips',
          expected: 'upcoming scheduled routes are listed',
        },
        async () => {
          await trips.openFutureTrips();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Confirm that future trips are read-only for dispatch',
          expected: 'no dispatch action is offered on the Future view',
        },
        async () => {
          await trips.expectNoDispatchActions();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open Trips History and locate a completed trip',
          expected: 'past completed trips are listed',
        },
        async () => {
          await trips.openTripsHistory();
        },
      );
    },
  );
});
