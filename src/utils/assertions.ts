import { expect, type Locator, type Page } from '@playwright/test';

/**
 * The admin app is a single-page app that keeps its state on <html>:
 *   data-active-page-id     which screen is showing
 *   data-active-dialog-id   which record dialog is on top, if any
 *
 * Several screens open records in a dialog without changing the URL, so these
 * attributes are more reliable than asserting on the address bar.
 */
export async function expectActivePage(page: Page, pageId: string | RegExp): Promise<void> {
  await expect(page.locator('html')).toHaveAttribute('data-active-page-id', pageId);
}

export async function expectActiveDialog(page: Page, dialogId: string | RegExp): Promise<void> {
  await expect(page.locator('html')).toHaveAttribute('data-active-dialog-id', dialogId);
  await expect(page.getByRole('dialog')).toBeVisible();
}

export async function expectNoDialog(page: Page): Promise<void> {
  await expect(page.getByRole('dialog')).toHaveCount(0);
}

/** Reads the "Showing 1-10 of 42 items" summary, which lists use as their record count. */
export async function readRecordTotal(summary: Locator): Promise<string> {
  await expect(summary).toBeVisible();
  return (await summary.innerText()).trim();
}

/**
 * Proof that a read-only visit added nothing: the record total is unchanged.
 * The pagination summary is used rather than a row count, because row counts
 * are read while the table is still rendering.
 */
export async function expectRecordTotalUnchanged(summary: Locator, before: string): Promise<void> {
  await expect(summary, 'no record may be added or removed').toHaveText(before);
}
