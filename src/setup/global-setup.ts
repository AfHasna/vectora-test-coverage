import fs from 'fs';
import { request } from '@playwright/test';
import { AUTH_DIR, currentEnvironment, DEFAULT_ROLE, roleCredentials } from '@config/env';

/**
 * Runs once before anything else, so a misconfigured run fails in seconds with
 * a clear reason instead of failing every spec on a timeout.
 *
 * Checks that the target is reachable and that the default role has credentials.
 */
export default async function globalSetup(): Promise<void> {
  const environment = currentEnvironment();
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const credentials = roleCredentials(DEFAULT_ROLE);
  if (!credentials) {
    throw new Error(
      `No credentials for the ${DEFAULT_ROLE} role. Set ADMIN_EMAIL and ADMIN_PASSWORD ` +
        '(or SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD) in .env.',
    );
  }

  const context = await request.newContext({ baseURL: environment.baseURL });
  try {
    const response = await context.get('/sign-in', { timeout: 30_000 });
    if (!response.ok()) {
      throw new Error(
        `${environment.baseURL} answered HTTP ${response.status()} on /sign-in. ` +
          'Check BASE_URL and that the environment is up.',
      );
    }
  } catch (error) {
    throw new Error(`Could not reach ${environment.baseURL}: ${(error as Error).message}`);
  } finally {
    await context.dispose();
  }

  console.log(
    `Target: ${environment.baseURL} (${environment.name}, ` +
      `${environment.readOnly ? 'read-only' : 'writes allowed'})`,
  );
}
