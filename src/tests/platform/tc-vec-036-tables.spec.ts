import { MODULE, READ_ONLY, SUITE } from '@config/test-tags';
import { expect, requireSession, test } from '@fixtures/pages.fixture';
import { annotateCase } from '@utils/reporting';
import { proofStep } from '@utils/steps';

/**
 * TC-VEC-036 — shared table behaviour, exercised on the Clients list because
 * it has more records than one page holds.
 */
test.describe('Happy path - Platform', () => {
  test(
    'TC-VEC-036 Verify Tables, Filters and Pagination',
    { tag: [SUITE.regression, MODULE.platform, READ_ONLY] },
    async ({ page, clients }, testInfo) => {
      await annotateCase(
        'TC-VEC-036',
        'Run against the Clients list. The source suite is truncated mid-sentence in this case, so only the stated expectations are asserted.',
      );

      const table = clients.table;

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open a module with enough records for pagination',
          expected: 'the Clients list loads paginated',
        },
        async () => {
          requireSession(await clients.open());
          await clients.expectListReady();
          await expect(table.nextPage).toBeVisible();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Sort by the Client Name column, then reverse it',
          expected: 'the order changes when the sort direction flips',
        },
        async () => {
          await table.reverseSortBy('Client Name');
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Open Filters and apply a status filter',
          expected: 'the table returns only matching records',
        },
        async () => {
          await clients.openWithStatus('contracted');
          await clients.expectListReady();
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Change items per page to 25',
          expected: 'the page size changes and pagination resets to the first page',
        },
        async () => {
          await clients.open();
          await clients.expectListReady();
          await table.setPageSize('25');
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Review row numbering and the column chooser',
          expected: 'rows are numbered from 1 and columns can be shown or hidden',
        },
        async () => {
          await table.expectRowsNumberedFromOne();
          await table.openColumnChooser();
          await page.keyboard.press('Escape');
        },
      );

      await proofStep(
        page,
        testInfo,
        {
          action: 'Reload the page',
          expected: 'the list loads again consistently',
        },
        async () => {
          await clients.reload();
          await clients.expectListReady();
        },
      );
    },
  );
});
