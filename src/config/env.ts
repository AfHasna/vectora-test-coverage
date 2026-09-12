import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * One place that answers "which system are we testing, what may we do to it,
 * and as whom".
 *
 * Production is read-only by rule: the request guard blocks writes there. A
 * staging environment is where the data-changing cases will run, so writes are
 * permitted once STAGING_BASE_URL is set. Pick the target with TEST_ENV.
 */
export type EnvironmentName = 'prod' | 'staging';

/** The roles the suite signs in as. Each gets its own saved session. */
export type Role = 'super-admin' | 'operations-manager' | 'employee' | 'custom-role';

export const ROLES: readonly Role[] = [
  'super-admin',
  'operations-manager',
  'employee',
  'custom-role',
];

export interface EnvironmentConfig {
  name: EnvironmentName;
  baseURL: string;
  /** When true, the request guard aborts every mutating request. */
  readOnly: boolean;
  timeouts: {
    test: number;
    expect: number;
    action: number;
    navigation: number;
  };
}

export interface RoleCredentials {
  role: Role;
  email: string;
  password: string;
  otp?: string;
}

const ROOT = path.resolve(__dirname, '../..');

export const AUTH_DIR = path.join(ROOT, '.auth');

/** Env var prefix per role, e.g. SUPER_ADMIN_EMAIL. */
const ROLE_ENV_PREFIX: Record<Role, string> = {
  'super-admin': 'SUPER_ADMIN',
  'operations-manager': 'OPERATIONS_MANAGER',
  employee: 'EMPLOYEE',
  'custom-role': 'CUSTOM_ROLE',
};

const environments: Record<EnvironmentName, EnvironmentConfig> = {
  prod: {
    name: 'prod',
    // BASE_URL is the documented override; ADMIN_BASE_URL is kept for the
    // scripts and CI job that already set it.
    baseURL: process.env.BASE_URL ?? process.env.ADMIN_BASE_URL ?? 'https://admin.govectora.com',
    readOnly: true,
    timeouts: { test: 60_000, expect: 15_000, action: 15_000, navigation: 30_000 },
  },
  staging: {
    name: 'staging',
    // Deliberately not defaulted: a wrong guess here would point the
    // data-changing cases at production.
    baseURL: process.env.STAGING_BASE_URL ?? '',
    readOnly: false,
    timeouts: { test: 90_000, expect: 15_000, action: 15_000, navigation: 30_000 },
  },
};

export function environmentName(): EnvironmentName {
  const requested = (process.env.TEST_ENV ?? 'prod').toLowerCase();
  if (requested !== 'prod' && requested !== 'staging') {
    throw new Error(`TEST_ENV must be "prod" or "staging", got "${requested}".`);
  }
  return requested;
}

export function currentEnvironment(): EnvironmentConfig {
  const config = environments[environmentName()];
  if (!config.baseURL) {
    throw new Error(
      `No base URL for the "${config.name}" environment. Set STAGING_BASE_URL in .env.`,
    );
  }
  return config;
}

/** Where a role's reusable session lives, e.g. .auth/prod.super-admin.json */
export function storageStatePath(role: Role): string {
  return path.join(AUTH_DIR, `${environmentName()}.${role}.json`);
}

/**
 * Credentials for a role, or null when they are not configured.
 *
 * Super Admin falls back to the shared ADMIN_* pair, which is the account the
 * read-only cases have always used. The other roles stay unconfigured until
 * their accounts exist, and their projects skip rather than fail.
 */
export function roleCredentials(role: Role): RoleCredentials | null {
  const prefix = ROLE_ENV_PREFIX[role];
  const shared = role === 'super-admin';

  const email = process.env[`${prefix}_EMAIL`] ?? (shared ? process.env.ADMIN_EMAIL : undefined);
  const password =
    process.env[`${prefix}_PASSWORD`] ?? (shared ? process.env.ADMIN_PASSWORD : undefined);

  if (!email || !password) {
    return null;
  }

  return {
    role,
    email,
    password,
    otp: (process.env[`${prefix}_OTP`] ?? (shared ? process.env.ADMIN_OTP : undefined))?.trim(),
  };
}

/** The role the read-only cases run as unless a spec says otherwise. */
export const DEFAULT_ROLE: Role = 'super-admin';
