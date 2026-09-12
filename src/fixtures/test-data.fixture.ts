/**
 * Factory functions for the entities the data-changing cases create: client,
 * driver, vehicle, place, guardian, passenger, route sheet, invoice.
 *
 * Empty on purpose. These belong to the staging suite, and building them
 * against production would be a rule violation, so they wait for
 * STAGING_BASE_URL.
 *
 * TODO once staging exists:
 *  - a unique run id per test so records never collide
 *  - one factory per entity returning the payload plus a display name
 *  - cleanup registered with the test, deleting only what the test created
 */

export {};
