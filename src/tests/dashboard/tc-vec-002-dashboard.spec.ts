import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { expect, requireSession, test } from '@fixtures/pages.fixture';
import { expectActivePage } from '@utils/assertions';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/** TC-VEC-002 — the Home dashboard shows its operational and compliance summaries. */
test.describe('Happy path - Dashboard', () => {
  test(
    'TC-VEC-002 Verify Home Dashboard',
    { tag: [SUITE.smoke, MODULE.dashboard, READ_ONLY] },
    async ({ page, home, clients }, testInfo) => {
      await annotateCase('TC-VEC-002');

      await proofStep(
        page,
        testInfo,
        {
          action: 'Sign in as an authorized user and open Home',
          expected: 'the dashboard loads without an error',
        },
        async () => {
          requireSession(await home.open());
          await home.expectWelcome();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Review the client summary',
          expected: 'the Clients card lists its status categories and a total',
        },
        async () => {
          await expect(home.summaryCard('Clients')).toHaveAttribute(
            'href',
            '/stakeholders/clients',
          );
          await home.expectClientStatuses([
            'Contracted',
            'Vendor Listed',
            'Backup Listed',
            'Prospect',
          ]);
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Review the driver, vehicle, passenger, monitor and service-provider summaries',
          expected: 'every card links to its list page and shows a total',
        },
        async () => {
          await home.expectSummaryCardsLinkToTheirLists();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: "Review Today's Operations",
          expected: "the Today's Operations section shows its operational tiles",
        },
        async () => {
          await home.expectTodaysOperations([
            'Online Drivers',
            'Active Trips',
            'Draft Route Sheets',
          ]);
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Review the trip-completion trend',
          expected: 'the trend section renders its chart',
        },
        async () => {
          await home.expectTripCompletionTrend();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Review compliance alerts and trips needing resolution',
          expected: 'both summaries are present with the compliance section',
        },
        async () => {
          await home.expectComplianceSummary();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Verify the "Last Updated" information',
          expected: 'the dashboard states when it was last refreshed',
        },
        async () => {
          await home.expectLastUpdated();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Click the Contracted client summary',
          expected: 'the Clients list opens filtered to that status',
        },
        async () => {
          // The link carries ?status=contracted, but the app rewrites the URL
          // once the list has applied the filter, so assert on the page itself.
          await home.statusLink('Contracted').click();
          await expectActivePage(page, clients.pageId);
          await clients.expectLoaded();
          await clients.expectListReady();
        },
      );
    },
  );
});
