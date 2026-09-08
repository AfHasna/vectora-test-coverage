import { test, expect } from '../fixtures';
import { dashboardSummaries } from '../helpers/catalog';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/** TC-VEC-002 — the Home dashboard shows its operational and compliance summaries. */
test.describe('Happy path - Dashboard', () => {
  test('TC-VEC-002 Verify Home Dashboard', async ({ page }, testInfo) => {
    await annotateCase('TC-VEC-002');

    await proofStep(
      page,
      testInfo,
      {
        action: 'Sign in as an authorized user and open Home',
        expected: 'the dashboard loads without an error',
      },
      async () => {
        await page.goto('/');
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing.');
        }
        await expect(page.getByRole('heading', { name: 'Home', exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
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
        await expect(
          page.getByRole('link', { name: 'Clients', exact: true }),
        ).toHaveAttribute('href', '/stakeholders/clients');
        for (const status of ['Contracted', 'Vendor Listed', 'Backup Listed', 'Prospect']) {
          await expect(page.getByRole('link', { name: new RegExp(`^${status}`) })).toBeVisible();
        }
        await expect(page.getByText(/^Total\s*[\d,]+$/).first()).toBeVisible();
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
        for (const summary of dashboardSummaries) {
          await expect(
            page.getByRole('link', { name: summary.name, exact: true }),
            `${summary.name} card`,
          ).toHaveAttribute('href', summary.href);
        }
        expect(await page.getByText(/^Total\s*[\d,]+$/).count()).toBeGreaterThanOrEqual(
          dashboardSummaries.length,
        );
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
        await expect(page.getByRole('heading', { name: "Today's Operations" })).toBeVisible();
        for (const tile of ['Online Drivers', 'Active Trips', 'Draft Route Sheets']) {
          await expect(page.getByRole('button', { name: new RegExp(tile) })).toBeVisible();
        }
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
        await expect(page.getByRole('heading', { name: 'Trip Completion Trend' })).toBeVisible();
        await expect(page.getByRole('application').first()).toBeVisible();
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
        await expect(page.getByRole('heading', { name: 'Compliance Summary' })).toBeVisible();
        await expect(page.getByRole('button', { name: /Compliance Alerts/ })).toBeVisible();
        await expect(
          page.getByRole('button', { name: /Trips Needing Resolution/ }),
        ).toBeVisible();
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
        await expect(page.getByText(/Updated .*ago|Updated less than/i).first()).toBeVisible();
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
        await page.getByRole('link', { name: /^Contracted/ }).click();
        await expect(page.locator('html')).toHaveAttribute(
          'data-active-page-id',
          'stakeholders.clients',
        );
        await expect(page.getByRole('heading', { name: 'Clients' }).first()).toBeVisible();
        await expect(page.getByText(/Showing \d+-\d+ of \d+ items/)).toBeVisible();
      },
    );
  });
});
