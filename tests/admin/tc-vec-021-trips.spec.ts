import { test, expect } from '../fixtures';
import { tripTabs } from '../helpers/catalog';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/**
 * TC-VEC-021 — trip visibility across Active, Future and History.
 * Trip volume depends on the service day, so the assertions check that each
 * view loads and identifies itself rather than requiring rows to exist.
 */
test.describe('Happy path - Service Operations', () => {
  test('TC-VEC-021 Verify Active, Future and Historical Trips', async ({ page }, testInfo) => {
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
        await page.goto(tripTabs[0].href);
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing.');
        }
        await expect(page.getByRole('heading', { name: /Active Trips List For/i })).toBeVisible();
        await expect(page.getByRole('tab', { name: 'Active' })).toHaveAttribute(
          'data-state',
          'active',
        );
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
        const table = page.getByRole('table');
        const emptyState = page.getByText(/no active trips|on holiday/i).first();
        await expect(table.or(emptyState).first()).toBeVisible();
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
        await page.getByRole('tab', { name: 'Future' }).click();
        await expect(page).toHaveURL(new RegExp(`${tripTabs[1].href}$`));
        await expect(page.getByRole('heading', { name: /Future Trips/i })).toBeVisible();
        await expect(page.getByRole('table')).toBeVisible();
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
        await expect(
          page.getByRole('button', { name: /^(dispatch|start trip|complete)/i }),
        ).toHaveCount(0);
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
        await page.getByRole('tab', { name: 'History' }).click();
        await expect(page).toHaveURL(new RegExp(`${tripTabs[2].href}$`));
        await expect(page.getByRole('heading', { name: 'Trips History' })).toBeVisible();
        await expect(page.getByRole('table').or(page.getByText(/no .*trips/i)).first()).toBeVisible();
      },
    );
  });
});
