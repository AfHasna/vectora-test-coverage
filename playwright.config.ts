import { defineConfig, devices } from '@playwright/test';
import { currentEnvironment, DEFAULT_ROLE, storageStatePath } from './src/config/env';

const environment = currentEnvironment();
const isCI = !!process.env.CI;

/**
 * Browsers are separate projects so a run can be limited to one:
 *   npx playwright test --project=chromium
 *
 * Chromium is what CI uses; firefox and webkit exist for cross-browser passes
 * and are not part of the default CI run.
 */
const browsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
] as const;

export default defineConfig({
  testDir: './src',
  globalSetup: './src/setup/global-setup.ts',
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 1,
  timeout: environment.timeouts.test,
  expect: { timeout: environment.timeouts.expect },
  outputDir: 'reports/traces',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/html' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['json', { outputFile: 'reports/results.json' }],
    [
      'allure-playwright',
      {
        resultsDir: 'reports/allure-results',
        // Report only the named test-case steps, not every Playwright API call.
        detail: false,
        environmentInfo: {
          Portal: 'Vectora Admin',
          Environment: environment.name,
          'Base URL': environment.baseURL,
          Mode: environment.readOnly
            ? 'Read-only — writes blocked by request guard'
            : 'Read-write — data-changing cases enabled',
        },
      },
    ],
  ],
  use: {
    baseURL: environment.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: environment.timeouts.action,
    navigationTimeout: environment.timeouts.navigation,
    // SLOWMO=400 makes a headed run easy to follow on screen.
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  projects: [
    // Signs in once per role and saves the sessions the other projects reuse.
    // Artifacts are off: a trace or failure snapshot would capture the
    // credentials. The thrown error carries the server's own reason instead.
    {
      name: 'setup',
      testMatch: /setup\/auth\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], trace: 'off', screenshot: 'off', video: 'off' },
    },

    // TC-VEC-001 signs in itself, so it starts without a session. Same reason
    // for switching the artifacts off.
    {
      name: 'auth',
      testMatch: /tests\/auth\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },

    // The suite proper, one project per browser.
    ...browsers.map(({ name, device }) => ({
      name,
      testMatch: /tests\/.*\.spec\.ts/,
      testIgnore: [/tests\/auth\//, /tests\/backlog\//],
      dependencies: ['setup'],
      use: { ...device, storageState: storageStatePath(DEFAULT_ROLE) },
    })),

    // Cases awaiting approval. These only report; they never run.
    {
      name: 'backlog',
      testMatch: /tests\/backlog\/.*\.spec\.ts/,
    },
  ],
});
