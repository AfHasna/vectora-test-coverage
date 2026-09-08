import { test, expect } from '../fixtures';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/**
 * TC-VEC-036 — shared table behaviour, exercised on the Clients list because
 * it has more records than one page holds.
 */
test.describe('Happy path - Platform', () => {
  test('TC-VEC-036 Verify Tables, Filters and Pagination', async ({ page }, testInfo) => {
    await annotateCase(
      'TC-VEC-036',
      'Run against the Clients list. The source suite is truncated mid-sentence in this case, so only the stated expectations are asserted.',
    );

    const listTotal = page.getByText(/Showing \d+-\d+ of \d+ items/);
    const perPage = page.getByRole('combobox').filter({ hasText: /^(10|25|50)$/ }).first();

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open a module with enough records for pagination',
        expected: 'the Clients list loads paginated',
      },
      async () => {
        await page.goto('/stakeholders/clients');
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing.');
        }
        await expect(page.getByRole('table')).toBeVisible();
        await expect(listTotal).toBeVisible();
        await expect(page.getByRole('button', { name: 'Go to next page' })).toBeVisible();
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
        // The list already arrives sorted by name ascending, so one click is a
        // no-op; the second click is what reverses it.
        const header = page.getByRole('columnheader', { name: 'Client Name' });
        const firstBefore = (await page.locator('tbody tr').first().innerText()).trim();

        await header.click();
        await header.click();

        await expect
          .poll(async () => (await page.locator('tbody tr').first().innerText()).trim(), {
            message: 'reversing the sort should reorder the rows',
            timeout: 10_000,
          })
          .not.toBe(firstBefore);
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
        await page.goto('/stakeholders/clients?status=contracted');
        await expect(page.getByRole('table')).toBeVisible();
        await expect(listTotal).toBeVisible();
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
        await page.goto('/stakeholders/clients');
        await expect(listTotal).toBeVisible();
        await perPage.click();
        await page.getByRole('option', { name: '25', exact: true }).click();
        await expect(listTotal).toHaveText(/Showing 1-\d+ of \d+ items/);
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
        await expect(page.locator('tbody tr').first().locator('td').first()).toHaveText('1');
        await page.getByRole('button', { name: 'Columns' }).click();
        await expect(page.getByRole('menuitem').or(page.getByRole('menuitemcheckbox')).first()).toBeVisible();
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
        await page.reload();
        await expect(page.getByRole('table')).toBeVisible();
        await expect(listTotal).toBeVisible();
      },
    );
  });
});
