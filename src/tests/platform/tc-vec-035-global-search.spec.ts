import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { requireSession, test } from '@fixtures/pages.fixture';
import { expectActiveDialog, expectActivePage } from '@utils/assertions';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/**
 * TC-VEC-035 — global search across entities.
 * The dialog also lists Quick Actions such as "Add New Client"; those create
 * records and are never selected.
 */
test.describe('Happy path - Platform', () => {
  test(
    'TC-VEC-035 Verify Global Search',
    { tag: [SUITE.smoke, MODULE.platform, READ_ONLY] },
    async ({ page, home, clients }, testInfo) => {
      await annotateCase(
        'TC-VEC-035',
        'The dialog offers Quick Actions that create records; the test only selects entity results.',
      );

      const search = home.search;

      await proofStep(
        page,
        testInfo,
        {
          action: 'Sign in and open Global Search',
          expected: 'the search dialog opens with grouped suggestions',
        },
        async () => {
          requireSession(await home.open());
          await search.open();
          await search.expectSuggestions();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Search for an existing client',
          expected: 'the client appears under a Clients group',
        },
        async () => {
          await search.search('Hudson');
          await search.expectResult(/Hudson Public Schools/i);
          await search.expectGroup('Clients');
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Select the client result',
          expected: 'the client record opens',
        },
        async () => {
          await search.selectResult('Clients', /^Hudson Public Schools/i);
          // The result opens the client as a record dialog on the Clients page.
          await expectActivePage(page, clients.pageId);
          await expectActiveDialog(page, /clients\.view/);
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Reopen search and find a passenger, then a vehicle',
          expected: 'results are identified by entity type for both',
        },
        async () => {
          // Close the client record dialog before reaching for search again.
          await search.close();

          await search.open();
          await search.search('Aiden');
          await search.expectGroup('Passengers');

          await search.search('114684');
          await search.expectGroup('Vehicles');
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Close search without selecting a result',
          expected: 'the dialog closes and nothing is changed',
        },
        async () => {
          await search.close();
        },
      );
    },
  );
});
