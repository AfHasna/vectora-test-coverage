import { defineConfig, devices } from '@playwright/test';
import { optionalPortalConfig, storageStatePath } from './tests/fixtures/env';

const isCI = !!process.env.CI;
const admin = optionalPortalConfig('admin');
const client = optionalPortalConfig('client');
const provider = optionalPortalConfig('provider');
const driver = optionalPortalConfig('driver');
const guardian = optionalPortalConfig('guardian');

const A = String.raw`drafts[/\\]archive-current-suite[/\\]`;

export default defineConfig({
  testDir: '.',
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
          Suite: 'Archived VCTR suite (on demand)',
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
      testMatch: /tests\/fixtures\/admin\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: admin.baseURL, trace: 'off', screenshot: 'off', video: 'off' },
    },
    {
      name: 'client-setup',
      testMatch: /tests\/fixtures\/client\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: client.baseURL, trace: 'off', screenshot: 'off', video: 'off' },
    },
    {
      name: 'provider-setup',
      testMatch: /tests\/fixtures\/provider\.setup\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: provider.baseURL, trace: 'off', screenshot: 'off', video: 'off' },
    },
    {
      name: 'driver-setup',
      testMatch: /tests\/fixtures\/driver\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        baseURL: driver.baseURL,
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
    {
      name: 'guardian-setup',
      testMatch: /tests\/fixtures\/guardian\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        baseURL: guardian.baseURL,
        trace: 'off',
        screenshot: 'off',
        video: 'off',
      },
    },
    {
      name: 'admin-auth',
      testMatch: new RegExp(`${A}admin[/\\\\]authentication[/\\\\].*\\.spec\\.ts`),
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
      testMatch: new RegExp(`${A}client-portal[/\\\\]authentication[/\\\\].*\\.spec\\.ts`),
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
      testMatch: new RegExp(`${A}service-provider[/\\\\]authentication[/\\\\].*\\.spec\\.ts`),
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
      testMatch: new RegExp(`${A}driver-app[/\\\\]authentication[/\\\\].*\\.spec\\.ts`),
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        baseURL: driver.baseURL,
        storageState: { cookies: [], origins: [] },
      },
    },
    {
      name: 'guardian-auth',
      testMatch: new RegExp(`${A}guardian-app[/\\\\]authentication[/\\\\].*\\.spec\\.ts`),
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        baseURL: guardian.baseURL,
        storageState: { cookies: [], origins: [] },
      },
    },
    {
      name: 'admin',
      testMatch: new RegExp(`${A}admin[/\\\\].*\\.spec\\.ts`),
      testIgnore: [new RegExp(`${A}admin[/\\\\]authentication[/\\\\]`)],
      dependencies: ['admin-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: admin.baseURL,
        storageState: storageStatePath('admin'),
      },
    },
    {
      name: 'client',
      testMatch: new RegExp(`${A}client-portal[/\\\\].*\\.spec\\.ts`),
      testIgnore: [new RegExp(`${A}client-portal[/\\\\]authentication[/\\\\]`)],
      dependencies: ['client-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: client.baseURL,
        storageState: storageStatePath('client'),
      },
    },
    {
      name: 'provider',
      testMatch: new RegExp(`${A}service-provider[/\\\\].*\\.spec\\.ts`),
      testIgnore: [new RegExp(`${A}service-provider[/\\\\]authentication[/\\\\]`)],
      dependencies: ['provider-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: provider.baseURL,
        storageState: storageStatePath('provider'),
      },
    },
    {
      name: 'driver',
      testMatch: new RegExp(`${A}driver-app[/\\\\].*\\.spec\\.ts`),
      testIgnore: [new RegExp(`${A}driver-app[/\\\\]authentication[/\\\\]`)],
      dependencies: ['driver-setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        baseURL: driver.baseURL,
        storageState: storageStatePath('driver'),
      },
    },
    {
      name: 'guardian',
      testMatch: new RegExp(`${A}guardian-app[/\\\\].*\\.spec\\.ts`),
      testIgnore: [new RegExp(`${A}guardian-app[/\\\\]authentication[/\\\\]`)],
      dependencies: ['guardian-setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 390, height: 844 },
        baseURL: guardian.baseURL,
        storageState: storageStatePath('guardian'),
      },
    },
    {
      name: 'journey',
      testMatch: new RegExp(`${A}journey[/\\\\].*\\.spec\\.ts`),
      dependencies: ['admin-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: admin.baseURL,
        storageState: storageStatePath('admin'),
      },
    },
  ],
});
