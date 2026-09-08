import type { Page, TestInfo } from '@playwright/test';
import { test } from '../fixtures';

/** A step written the way a manual test case reads. */
export type StepSpec = { action: string; expected: string } | string;

/** Step numbers are tracked per test so specs never hard-code them. */
const stepCounters = new WeakMap<TestInfo, number>();

/**
 * Run one test-case step and attach a screenshot as proof.
 *
 * The step title carries both the action and the expected result, so the Allure
 * and HTML reports read like the written test case, with the screenshot below
 * each step as evidence. Steps are navigate/read/assert only — nothing here
 * writes to the application.
 */
export async function proofStep(
  page: Page,
  testInfo: TestInfo,
  step: StepSpec,
  body: () => Promise<void>,
): Promise<void> {
  const index = (stepCounters.get(testInfo) ?? 0) + 1;
  stepCounters.set(testInfo, index);

  const title =
    typeof step === 'string'
      ? step
      : `Step ${index}: ${step.action}  |  Expected: ${step.expected}`;

  await test.step(title, async () => {
    try {
      await body();
    } finally {
      await attachScreenshot(page, testInfo, `Proof - step ${index}`);
    }
  });
}

export async function attachScreenshot(
  page: Page,
  testInfo: TestInfo,
  title: string,
): Promise<void> {
  const screenshot = await page.screenshot({ fullPage: false, animations: 'disabled' });
  await testInfo.attach(title, { body: screenshot, contentType: 'image/png' });
}
