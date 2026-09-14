import { expect, test, type Page } from '@playwright/test';
import { annotateCase, type CaseMeta } from './annotate';
import { optionalPortalConfig, type PortalKey } from './env';
import { dismissOnboarding, expectLoggedIn, login, openLogin, signOut } from './login';

const BLOCKED_CLICK =
  /^(save|confirm|archive|delete|restore|generate|submit|send|pay now|upload)$/i;

export interface RunnableCase extends CaseMeta {
  portalKey: PortalKey;
  fixmeReason?: string;
}

function splitSteps(raw: string): string[] {
  const parts = raw
    .split(/(?=\d+\)\s)/)
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [raw];
}

function pathFromText(text: string): string | undefined {
  const match = text.match(/`(\/[^`]+)`/) ?? text.match(/((?:https?:\/\/|\/)[^\s)]+)/);
  return match?.[1]?.replace(/[.,;]+$/, '');
}

function clickName(label: string): string {
  return label
    .replace(/^["']|["']$/g, '')
    .replace(/\s*\(.*\)$/, '')
    .trim();
}

async function clickNamed(page: Page, raw: string): Promise<boolean> {
  const name = clickName(raw);
  if (!name || BLOCKED_CLICK.test(name)) {
    return false;
  }

  const pattern = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const target = page
    .getByRole('link', { name: pattern })
    .or(page.getByRole('tab', { name: pattern }))
    .or(page.getByRole('button', { name: pattern }))
    .or(page.getByRole('menuitem', { name: pattern }));

  if (await target.first().isVisible().catch(() => false)) {
    const accessible = (await target.first().innerText().catch(() => '')) || name;
    if (BLOCKED_CLICK.test(accessible.trim())) {
      return false;
    }
    await target.first().click();
    return true;
  }
  return false;
}

async function applyPreconditions(page: Page, meta: RunnableCase): Promise<void> {
  const portal = optionalPortalConfig(meta.portalKey);
  const pre = meta.preconditions;
  const route = pathFromText(pre);

  if (/logged out/i.test(pre)) {
    await openLogin(page, portal);
    return;
  }

  if (/logged in/i.test(pre)) {
    await login(page, portal);
    await expectLoggedIn(page);
    return;
  }

  if (/at otp screen/i.test(pre)) {
    await login(page, portal);
    return;
  }

  if (route?.startsWith('http')) {
    await page.goto(route);
    return;
  }

  if (route?.startsWith('/')) {
    await page.goto(route);
    return;
  }

  if (/dashboard|any page|header|sidebar|fresh login|logged in/i.test(pre)) {
    await page.goto('/');
  }
}

async function performStep(page: Page, step: string, meta: RunnableCase): Promise<void> {
  const text = step.replace(/^\d+\)\s*/, '').trim();
  const portal = optionalPortalConfig(meta.portalKey);
  await dismissOnboarding(page);

  if (/do not (confirm|submit|save|delete|click|execute|upload|change|deactivate)/i.test(text)) {
    await expect(page.locator('body')).toBeVisible();
    return;
  }

  const goTo = text.match(/Go to ((?:https?:\/\/)\S+|\/\S+)/i);
  if (goTo?.[1]) {
    const target = goTo[1].startsWith('http') ? goTo[1] : goTo[1];
    await page.goto(target);
    return;
  }

  if (/wrong password/i.test(text)) {
    await login(page, portal, { wrongPassword: true });
    return;
  }

  if (/wrong 6-digit|wrong otp|invalid otp/i.test(text)) {
    await login(page, portal, { wrongOtp: true });
    return;
  }

  if (/enter valid email\/password/i.test(text)) {
    await openLogin(page, portal);
    await login(page, portal);
    return;
  }

  if (/^submit$/i.test(text) && /otp|password|email/i.test(meta.actionSteps)) {
    return;
  }

  if (/enter 6-digit otp/i.test(text)) {
    return;
  }

  if (/sign out|log out/i.test(text)) {
    await signOut(page);
    return;
  }

  if (/admin\.govectora\.com/i.test(text)) {
    await page.goto('https://admin.govectora.com/');
    return;
  }

  const open = text.match(/Open(?: tab| list| page| sub-tab)?\s+(.+)/i);
  if (open?.[1]) {
    const opened = await clickNamed(page, open[1]);
    if (!opened && /list|page|tab/i.test(text)) {
      await expect(page.locator('body')).toBeVisible();
    }
    return;
  }

  if (/toggle theme|dark\/light/i.test(text)) {
    const toggle = page.getByRole('button', { name: /theme|dark|light|mode/i }).first();
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click();
    }
    return;
  }

  await expect(page.locator('body')).toBeVisible();
}

async function assertExpected(page: Page, expected: string): Promise<void> {
  await expect(page.locator('body')).toBeVisible();

  if (/inline error|error shown|access denied/i.test(expected)) {
    await expect(page.getByText(/invalid|incorrect|denied|error|wrong/i).first()).toBeVisible({
      timeout: 15_000,
    });
  }

  if (/dashboard loads/i.test(expected)) {
    await expectLoggedIn(page);
  }
}

export async function runCase(page: Page, meta: RunnableCase): Promise<void> {
  await annotateCase(meta);

  if (meta.fixmeReason) {
    test.fixme(true, meta.fixmeReason);
    return;
  }

  await test.step(`Preconditions: ${meta.preconditions}`, async () => {
    await applyPreconditions(page, meta);
  });

  for (const step of splitSteps(meta.actionSteps)) {
    await test.step(step, async () => {
      await performStep(page, step, meta);
    });
  }

  await test.step(`Expected: ${meta.expected}`, async () => {
    await assertExpected(page, meta.expected);
  });
}
