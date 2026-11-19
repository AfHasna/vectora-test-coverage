/**
 * Password login + bypass OTP verify (no 2FA send). Writes Playwright storage.
 * Use when the Admin UI is stuck on "Too many attempts" for OTP send.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(root, '.env') });

const adminEnv = path.join(
  process.env.USERPROFILE || '',
  'OneDrive',
  'سطح المكتب',
  'Vectora workspace',
  'admin',
  '.env',
);
if (fs.existsSync(adminEnv)) {
  dotenv.config({ path: adminEnv, override: false });
}

const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const anonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const email = process.env.ADMIN_EMAIL || '';
const password = process.env.ADMIN_PASSWORD || '';
const otp = process.env.ADMIN_OTP || '000000';
const origin = process.env.ADMIN_BASE_URL || 'http://localhost:5173';

if (!supabaseUrl || !anonKey || !email || !password) {
  console.error('Missing VITE_SUPABASE_URL / publishable key / ADMIN_EMAIL / ADMIN_PASSWORD');
  process.exit(1);
}

const projectRef = new URL(supabaseUrl).hostname.split('.')[0];
const storageKey = `sb-${projectRef}-auth-token`;

const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
  method: 'POST',
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});

if (!authRes.ok) {
  console.error('password login failed', authRes.status);
  process.exit(1);
}

const session = await authRes.json();
if (!session?.access_token) {
  console.error('password login returned no access_token');
  process.exit(1);
}

const verifyRes = await fetch(`${supabaseUrl}/functions/v1/iam__2fa-otp`, {
  method: 'POST',
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ action: 'verify', code: otp }),
});

if (!verifyRes.ok) {
  const body = await verifyRes.text();
  console.error('bypass verify failed', verifyRes.status, body.slice(0, 300));
  process.exit(1);
}

const outDir = path.join(root, '.auth');
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'regression.admin.json');
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      cookies: [],
      origins: [
        {
          origin: origin.replace(/\/$/, ''),
          localStorage: [{ name: storageKey, value: JSON.stringify(session) }],
        },
      ],
    },
    null,
    2,
  ),
);
console.log('wrote admin storage (session + bypass verify, no OTP send)');
