import { test, expect } from '../fixtures';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/**
 * TC-VEC-035 — global search across entities.
 * The dialog also lists Quick Actions such as "Add New Client"; those create
 * records and are never selected.
 */
test.describe('Happy path - Platform', () => {
  test('TC-VEC-035 Verify Global Search', async ({ page }, testInfo) => {
    await annotateCase(
      'TC-VEC-035',
      'The dialog offers Quick Actions that create records; the test only selects entity results.',
    );

    const dialog = page.getByRole('dialog');
    const searchInput = dialog.getByRole('combobox');

    const openSearch = async () => {
      await page.getByRole('button', { name: /Search/ }).first().click();
      await expect(dialog).toBeVisible();
      await expect(searchInput).toBeVisible();
    };

    await proofStep(
      page,
      testInfo,
      {
        action: 'Sign in and open Global Search',
        expected: 'the search dialog opens with grouped suggestions',
      },
      async () => {
        await page.goto('/');
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing.');
        }
        await openSearch();
        await expect(dialog.getByRole('listbox')).toBeVisible();
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
        await searchInput.fill('Hudson');
        await expect(
          dialog.getByRole('option', { name: /Hudson Public Schools/i }).first(),
        ).toBeVisible();
        await expect(dialog.getByRole('group', { name: 'Clients' })).toBeVisible();
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
        await dialog
          .getByRole('group', { name: 'Clients' })
          .getByRole('option', { name: /^Hudson Public Schools/i })
          .first()
          .click();
        // The result opens the client as a record dialog on the Clients page.
        await expect(page.locator('html')).toHaveAttribute(
          'data-active-page-id',
          'stakeholders.clients',
        );
        await expect(page.locator('html')).toHaveAttribute(
          'data-active-dialog-id',
          /clients\.view/,
        );
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
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);

        await openSearch();
        await searchInput.fill('Aiden');
        await expect(dialog.getByRole('group', { name: 'Passengers' })).toBeVisible();

        await searchInput.fill('114684');
        await expect(dialog.getByRole('group', { name: 'Vehicles' })).toBeVisible();
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
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);
      },
    );
  });
});
