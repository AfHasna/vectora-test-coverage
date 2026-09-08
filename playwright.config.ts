import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const adminOrigin = process.env.ADMIN_BASE_URL ?? 'https://admin.govectora.com';
const authFile = path.resolve(__dirname, '.auth/admin.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        // Report only the named test-case steps, not every Playwright API call.
        detail: false,
        environmentInfo: {
          Portal: 'Vectora Admin',
          'Base URL': adminOrigin,
          Mode: 'Read-only — writes blocked by request guard',
          Browser: 'Chromium (headed)',
        },
      },
    ],
  ],
  use: {
    baseURL: adminOrigin,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    // SLOWMO=400 makes a headed run easy to follow on screen.
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      // Traces, videos and failure snapshots of the login page would capture the
      // credentials. The thrown error carries the server's reason instead.
      use: { trace: 'off', screenshot: 'off', video: 'off' },
    },
    // TC-VEC-001 signs in itself, so it starts without a session. Artifacts are
    // off here because a trace or failure snapshot would capture the password.
    {
      name: 'admin-login',
      testMatch: /login\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
    // Approved cases, automated against the production admin, read-only.
    {
      name: 'admin',
      testMatch: /admin\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
    },
    // TC-VEC-001..036 awaiting approval. These only report; they never run.
    {
      name: 'suite-pending',
      testMatch: /suite\/.*\.spec\.ts/,
    },
  ],
});
