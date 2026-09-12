/**
 * Seeding and cleanup through the Supabase REST API, so a test can arrange its
 * own data instead of depending on what happens to be in the environment.
 *
 * Empty on purpose. Writing through the API is exactly what the production rule
 * forbids, so this is staging-only work.
 *
 * TODO once staging exists:
 *  - a request context bound to STAGING_BASE_URL and a service key from .env
 *  - seed helpers per entity, returning ids
 *  - cleanup by id, and a guard that refuses to run unless TEST_ENV=staging
 */

export {};
