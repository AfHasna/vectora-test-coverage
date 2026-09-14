import { defineConfig, devices } from '@playwright/test';
import { optionalPortalConfig, storageStatePath } from './tests/fixtures/env';

const isCI = !!process.env.CI;
const admin = optionalPortalConfig('admin');
const client = optionalPortalConfig('client');
const provider = optionalPortalConfig('provider');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  outputDir: 'reports/traces',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/html' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['json', { outputFile: 'reports/results.json' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: false,
        environmentInfo: {
          Suite: 'Vectora regression (Admin / Client / Service Provider)',
          'Admin URL': admin.baseURL,
          'Client URL': client.baseURL,
          'Provider URL': provider.baseURL,
        },
      },
    ],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },
  projects: [
    {
      name: 'admin-setup',
      testMatch: /fixtures\/admin\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: admin.baseURL, trace: 'off', screenshot: 'off', video: 'off' },
    },
    {
      name: 'client-setup',
      testMatch: /fixtures\/client\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: client.baseURL, trace: 'off', screenshot: 'off', video: 'off' },
    },
    {
      name: 'provider-setup',
      testMatch: /fixtures\/provider\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: provider.baseURL, trace: 'off', screenshot: 'off', video: 'off' },
    },
    {
      name: 'admin-auth',
      testMatch: /admin\/authentication\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: admin.baseURL,
        storageState: { cookies: [], origins: [] },
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
    {
      name: 'client-auth',
      testMatch: /client-portal\/authentication\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: client.baseURL,
        storageState: { cookies: [], origins: [] },
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
    {
      name: 'provider-auth',
      testMatch: /service-provider\/authentication\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: provider.baseURL,
        storageState: { cookies: [], origins: [] },
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
    {
      name: 'admin',
      testMatch: /admin\/.*\.spec\.ts/,
      testIgnore: [/admin\/authentication\//],
      dependencies: ['admin-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: admin.baseURL,
        storageState: storageStatePath('admin'),
      },
    },
    {
      name: 'client',
      testMatch: /client-portal\/.*\.spec\.ts/,
      testIgnore: [/client-portal\/authentication\//],
      dependencies: ['client-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: client.baseURL,
        storageState: storageStatePath('client'),
      },
    },
    {
      name: 'provider',
      testMatch: /service-provider\/.*\.spec\.ts/,
      testIgnore: [/service-provider\/authentication\//],
      dependencies: ['provider-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: provider.baseURL,
        storageState: storageStatePath('provider'),
      },
    },
  ],
});
