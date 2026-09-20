import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export type PortalKey = 'admin' | 'client' | 'provider' | 'driver' | 'guardian';

export interface PortalCredentials {
  email: string;
  password: string;
  otp: string;
}

export interface PortalConfig {
  key: PortalKey;
  name: string;
  baseURL: string;
  credentials: PortalCredentials;
}

const ROOT = path.resolve(__dirname, '../..');
export const AUTH_DIR = path.join(ROOT, '.auth');

function otp(name: string): string {
  return process.env[name]?.trim() || '000000';
}

function envUrl(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value || fallback;
}

function pair(emailVar: string, passwordVar: string): { email: string; password: string } | null {
  const email = process.env[emailVar]?.trim();
  const password = process.env[passwordVar]?.trim();
  if (!email || !password) {
    return null;
  }
  return { email, password };
}

export function portalConfig(key: PortalKey): PortalConfig {
  const config = optionalPortalConfig(key);
  if (!config.credentials.email || !config.credentials.password) {
    throw new Error(
      `Missing credentials for ${config.name}. Set them in .env — never hardcode them in tests.`,
    );
  }
  return config;
}

export function optionalPortalConfig(key: PortalKey): PortalConfig {
  if (key === 'admin') {
    const creds = pair('ADMIN_EMAIL', 'ADMIN_PASSWORD');
    return {
      key,
      name: 'Admin Portal',
      baseURL: envUrl('ADMIN_BASE_URL', envUrl('BASE_URL', 'https://admin.govectora.com')),
      credentials: {
        email: creds?.email ?? '',
        password: creds?.password ?? '',
        otp: otp('ADMIN_OTP'),
      },
    };
  }

  if (key === 'client') {
    const creds = pair('CLIENT_EMAIL', 'CLIENT_PASSWORD');
    return {
      key,
      name: 'Client Portal',
      baseURL: envUrl('CLIENT_BASE_URL', 'https://portal.govectora.com'),
      credentials: {
        email: creds?.email ?? '',
        password: creds?.password ?? '',
        otp: otp('CLIENT_OTP'),
      },
    };
  }

  if (key === 'provider') {
    const creds = pair('SP_EMAIL', 'SP_PASSWORD');
    return {
      key,
      name: 'Service Provider Portal',
      baseURL: envUrl('PROVIDER_BASE_URL', 'https://provider.govectora.com'),
      credentials: {
        email: creds?.email ?? '',
        password: creds?.password ?? '',
        otp: otp('SP_OTP'),
      },
    };
  }

  if (key === 'driver') {
    const creds = pair('DRIVER_EMAIL', 'DRIVER_PASSWORD');
    return {
      key,
      name: 'Driver App',
      baseURL: envUrl('DRIVER_BASE_URL', 'http://localhost:8082'),
      credentials: {
        email: creds?.email ?? '',
        password: creds?.password ?? '',
        otp: otp('DRIVER_OTP'),
      },
    };
  }

  const creds = pair('GUARDIAN_EMAIL', 'GUARDIAN_PASSWORD');
  return {
    key,
    name: 'Guardian App',
    baseURL: envUrl('GUARDIAN_BASE_URL', 'http://localhost:8081'),
    credentials: {
      email: creds?.email ?? '',
      password: creds?.password ?? '',
      otp: otp('GUARDIAN_OTP'),
    },
  };
}

export function storageStatePath(key: PortalKey): string {
  return path.join(AUTH_DIR, `regression.${key}.json`);
}

export const PORTAL_FROM_PROJECT: Record<string, PortalKey> = {
  admin: 'admin',
  'admin-auth': 'admin',
  'admin-setup': 'admin',
  client: 'client',
  'client-auth': 'client',
  'client-setup': 'client',
  provider: 'provider',
  'provider-auth': 'provider',
  'provider-setup': 'provider',
  driver: 'driver',
  'driver-auth': 'driver',
  'driver-setup': 'driver',
  guardian: 'guardian',
  'guardian-auth': 'guardian',
  'guardian-setup': 'guardian',
  journey: 'admin',
  'journey-admin': 'admin',
};
