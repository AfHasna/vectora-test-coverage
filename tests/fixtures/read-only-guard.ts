import type { Page } from '@playwright/test';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function isAuthRequest(url: string): boolean {
  return (
    url.includes('/auth/v1/') ||
    url.includes('iam__auth-gateway') ||
    url.includes('iam__2fa-otp') ||
    /iam__[a-z0-9-]*auth/i.test(url) ||
    url.includes('/token?grant_type') ||
    /\/signup|\/signin|\/sign-in|\/oauth|\/login/i.test(url)
  );
}

const WRITE_RPC =
  /\/rest\/v1\/rpc\/(?:create|insert|add|update|upsert|set|delete|remove|archive|restore|generate|assign|unassign|approve|reject|send|mark|apply|sync|reset|import|export|dispatch|complete|cancel|start|stop|toggle)_/i;

function isReadOverPost(url: string): boolean {
  if (url.includes('/functions/v1/reports__') || url.includes('/storage/v1/object/sign/')) {
    return true;
  }
  return url.includes('/rest/v1/rpc/') && !WRITE_RPC.test(url);
}

/** Blocks mutating HTTP on production. Auth and read-over-POST RPCs stay allowed. */
export async function installReadOnlyGuard(page: Page): Promise<void> {
  if (process.env.TEST_ENV === 'staging') {
    return;
  }

  await page.route('**/*', async (route) => {
    const request = route.request();
    const method = request.method().toUpperCase();
    const url = request.url();

    if (!MUTATING.has(method) || isAuthRequest(url) || isReadOverPost(url)) {
      await route.continue();
      return;
    }

    console.error(`Read-only guard blocked ${method} ${url}.`);
    await route.abort('blockedbyclient');
  });
}
