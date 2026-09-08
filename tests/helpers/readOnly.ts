import type { Page } from '@playwright/test';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function isAuthRequest(url: string): boolean {
  return (
    url.includes('/auth/v1/') ||
    url.includes('iam__auth-gateway') ||
    // Sign-in is gated by an SMS one-time code; blocking it breaks the login.
    url.includes('iam__2fa-otp') ||
    url.includes('/token?grant_type') ||
    /\/signup|\/signin|\/sign-in|\/oauth/i.test(url)
  );
}

/**
 * Supabase serves plenty of reads over POST, so the HTTP method alone cannot
 * tell a read from a write:
 *  - database functions at /rest/v1/rpc/<name>
 *  - report endpoints at /functions/v1/reports__<name>
 *  - signed download URLs at /storage/v1/object/sign/<bucket>/<file>
 *
 * Blocking those leaves pages blank or shows "Couldn't load this report",
 * which looks like a product bug when it is only the guard. So RPC calls are
 * judged by name and only the writing verbs are blocked; reporting endpoints
 * are allowed outright. Writes to tables (/rest/v1/<table>) are never allowed.
 */
const WRITE_RPC =
  /\/rest\/v1\/rpc\/(?:create|insert|add|update|upsert|set|delete|remove|archive|restore|generate|assign|unassign|approve|reject|send|mark|apply|sync|reset|import|export|dispatch|complete|cancel|start|stop|toggle)_/i;

function isReadOverPost(url: string): boolean {
  if (url.includes('/functions/v1/reports__')) {
    return true;
  }
  // Signing an existing object only hands back a temporary read URL; without
  // it document previews stay blank in the proof screenshots.
  if (url.includes('/storage/v1/object/sign/')) {
    return true;
  }
  return url.includes('/rest/v1/rpc/') && !WRITE_RPC.test(url);
}

export async function installReadOnlyGuard(page: Page): Promise<void> {
  await page.route('**/*', async (route) => {
    const request = route.request();
    const method = request.method().toUpperCase();
    const url = request.url();

    if (!MUTATING.has(method) || isAuthRequest(url) || isReadOverPost(url)) {
      await route.continue();
      return;
    }

    const error = `Read-only guard blocked ${method} ${url}. Vectora e2e tests must not add or delete data.`;
    console.error(error);
    await route.abort('blockedbyclient');
  });
}
