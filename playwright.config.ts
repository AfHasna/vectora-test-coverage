import { defineConfig, devices } from '@playwright/test';
import { optionalPortalConfig, storageStatePath } from './tests/fixtures/env';

const isCI = !!process.env.CI;
const admin = optionalPortalConfig('admin');
const client = optionalPortalConfig('client');
const provider = optionalPortalConfig('provider');
const driver = optionalPortalConfig('driver');
const guardian = optionalPortalConfig('guardian');

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
          Suite: 'Vectora regression (Admin / Client / SP / Driver / Guardian)',
          'Admin URL': admin.baseURL,
          'Client URL': client.baseURL,
          'Provider URL': provider.baseURL,
          'Driver URL': driver.baseURL,
          'Guardian URL': guardian.baseURL,
          TEST_ENV: process.env.TEST_ENV ?? 'unset',
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
      timeout: 180_000,
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
      name: 'driver-setup',
      testMatch: /fixtures\/driver\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, baseURL: driver.baseURL, trace: 'off', screenshot: 'off', video: 'off' },
    },
    {
      name: 'guardian-setup',
      testMatch: /fixtures\/guardian\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, baseURL: guardian.baseURL, trace: 'off', screenshot: 'off', video: 'off' },
    },
    {
      name: 'admin-auth',
      testMatch: /regression\/admin\/authentication\/.*\.spec\.ts/,
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
      testMatch: /regression\/client\/authentication\/.*\.spec\.ts/,
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
      testMatch: /regression\/service-provider\/authentication\/.*\.spec\.ts/,
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
      name: 'driver-auth',
      testMatch: /regression\/driver-app\/authentication\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        baseURL: driver.baseURL,
        storageState: { cookies: [], origins: [] },
      },
    },
    {
      name: 'guardian-auth',
      testMatch: /regression\/guardian-app\/authentication\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        baseURL: guardian.baseURL,
        storageState: { cookies: [], origins: [] },
      },
    },
    {
      name: 'admin',
      testMatch: /regression\/admin\/.*\.spec\.ts/,
      testIgnore: [/regression\/admin\/authentication\//],
      dependencies: ['admin-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: admin.baseURL,
        storageState: storageStatePath('admin'),
      },
    },
    {
      name: 'client',
      testMatch: /regression\/client\/.*\.spec\.ts/,
      testIgnore: [/regression\/client\/authentication\//],
      dependencies: ['client-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: client.baseURL,
        storageState: storageStatePath('client'),
      },
    },
    {
      name: 'provider',
      testMatch: /regression\/service-provider\/.*\.spec\.ts/,
      testIgnore: [/regression\/service-provider\/authentication\//],
      dependencies: ['provider-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: provider.baseURL,
        storageState: storageStatePath('provider'),
      },
    },
    {
      name: 'driver',
      testMatch: /regression\/driver-app\/.*\.spec\.ts/,
      testIgnore: [/regression\/driver-app\/authentication\//],
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        baseURL: driver.baseURL,
      },
    },
    {
      name: 'guardian',
      testMatch: /regression\/guardian-app\/.*\.spec\.ts/,
      testIgnore: [/regression\/guardian-app\/authentication\//],
      fullyParallel: false,
      workers: 1,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        baseURL: guardian.baseURL,
      },
    },
    {
      name: 'journey-admin',
      testMatch: /regression\/connected-flow\/REG-CONN-loop-journey\.spec\.ts/,
      dependencies: ['admin-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: admin.baseURL,
        storageState: storageStatePath('admin'),
      },
    },
    {
      name: 'journey',
      testMatch: /regression\/connected-flow\/REG-CONN-apps\.spec\.ts/,
      fullyParallel: false,
      workers: 1,
      timeout: 180_000,
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
