import { test, expect } from '../fixtures';
import { annotateCase } from '../helpers/reporting';
import { proofStep } from '../helpers/steps';

/**
 * TC-VEC-010 — the weekly driver-availability matrix.
 *
 * The live page navigates by date rather than by week: it offers a MM/DD/YYYY
 * field with 1 day and 7 days views, so "next week" and "This Week" are done
 * through the date field. The per-row "Change driver on ..." buttons are writes
 * and are never touched.
 */
test.describe('Happy path - Workforce Management', () => {
  test('TC-VEC-010 Verify Driver Availability', async ({ page }, testInfo) => {
    await annotateCase(
      'TC-VEC-010',
      'The page has no "This Week" button; it navigates by date with 1 day / 7 days views, so those are used instead.',
    );

    const dateField = page.getByRole('textbox', { name: 'MM/DD/YYYY' });
    // The summary tiles are filter buttons; their labels describe the filter,
    // and the counts live inside them as text.
    const allDrivers = page.getByRole('button', { name: 'Show all drivers (clear filters)' });
    const availableOnly = page.getByRole('button', { name: 'Filter to available drivers only' });
    const withTimeOff = page.getByRole('button', { name: 'Filter to drivers with time off' });
    let openingDate = '';

    await proofStep(
      page,
      testInfo,
      {
        action: 'Open Workforce Management → Driver Availability',
        expected: 'the availability matrix loads with its tab selected',
      },
      async () => {
        await page.goto('/workforce/drivers-availability');
        if (/sign-in/i.test(page.url())) {
          test.skip(true, 'Admin session missing.');
        }
        await expect(page.getByRole('heading', { name: 'Drivers Availability' })).toBeVisible();
        await expect(
          page.getByRole('tab', { name: 'Drivers Availability' }),
        ).toHaveAttribute('data-state', 'active');
        await expect(dateField).toBeVisible();
        openingDate = await dateField.inputValue();
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
        await page.getByRole('button', { name: '7 days' }).click();
        await expect(allDrivers).toContainText(/Total Drivers\s*\d+/);
        await expect(availableOnly).toContainText(/Available\s*\d+/);
        await expect(withTimeOff).toContainText(/Unavailable\s*\d+/);
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
        const nextWeek = new Date(openingDate);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const formatted = `${String(nextWeek.getMonth() + 1).padStart(2, '0')}/${String(
          nextWeek.getDate(),
        ).padStart(2, '0')}/${nextWeek.getFullYear()}`;

        await dateField.fill(formatted);
        await dateField.press('Enter');
        await expect(dateField).toHaveValue(formatted);
        await expect(allDrivers).toContainText(/Total Drivers\s*\d+/);
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
        await dateField.fill(openingDate);
        await dateField.press('Enter');
        await expect(dateField).toHaveValue(openingDate);
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
        await availableOnly.click();
        await expect(availableOnly).toContainText(/Available\s*\d+/);

        await allDrivers.click();
        await expect(allDrivers).toContainText(/Total Drivers\s*\d+/);
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
        const routeChip = page.getByRole('button', { name: /^RS[OR]-\d+$/ }).first();
        await expect(routeChip).toBeVisible();
      },
    );
  });
});
