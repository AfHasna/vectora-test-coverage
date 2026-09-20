# Archived suite inventory

Moved 2026-09-19 from live `tests/` into `drafts/archive-current-suite/`. These **VCTR-*** cases are **not** the new regression suite. Revive only if Ahmad asks.

**Kept live:** `tests/fixtures/` (login, env, setups, annotate, read-only guard, run-case).

**How to run on demand**

```bash
npm run test:archive
npx playwright test --config=playwright.archive.config.ts --project=admin
```

Do **not** use `npm test` / `npm run test:regression` for this tree. Those point at `tests/regression/`.

---

## Totals

| Portal (folder) | Specs | `test()` count | ID prefix |
|---|---:|---:|---|
| Admin (`admin/`) | 26 | 123 | `VCTR-ADM-*` |
| Client (`client-portal/`) | 11 | 42 | `VCTR-CP-*` |
| Service Provider (`service-provider/`) | 10 | 40 | `VCTR-SP-*` |
| Driver (`driver-app/`) | 2 | 7 | `DRV-TS-*` / `VCTR` rows in file |
| Parent / Guardian (`guardian-app/`) | 2 | 7 | `GRD-TS-*` |
| Journey (`journey/`) | 2 | 11 | connected + Wayland seed |
| **Total** | **53** | **230** | |
| Catalog JSON | 3 | — | `drafts/archive-current-suite/_catalog/` |

---

## Admin (26 specs / 123 tests)

| Spec | Tests |
|---|---:|
| `authentication/ADM-TS-01-authentication.spec.ts` | 9 |
| `dashboard/ADM-TS-02-dashboard.spec.ts` | 8 |
| `clients/ADM-TS-03-clients.spec.ts` | 8 |
| `client-monitors/ADM-TS-04-client-monitors.spec.ts` | 3 |
| `places/ADM-TS-05-places.spec.ts` | 3 |
| `guardians/ADM-TS-06-guardians.spec.ts` | 4 |
| `passengers/ADM-TS-07-passengers.spec.ts` | 5 |
| `drivers/ADM-TS-08-drivers.spec.ts` | 4 |
| `drivers-availability/ADM-TS-09-drivers-availability.spec.ts` | 3 |
| `vehicles/ADM-TS-10-vehicles.spec.ts` | 5 |
| `maintenance/ADM-TS-11-maintenance.spec.ts` | 3 |
| `assignment-history/ADM-TS-12-assignment-history.spec.ts` | 3 |
| `route-sheets/ADM-TS-13-route-sheets.spec.ts` | 7 |
| `routes-assignment/ADM-TS-14-routes-assignment.spec.ts` | 5 |
| `trips/ADM-TS-15-trips.spec.ts` | 6 |
| `incidents/ADM-TS-16-incidents.spec.ts` | 4 |
| `live-tracking/ADM-TS-17-live-tracking.spec.ts` | 2 |
| `compliance/ADM-TS-18-compliance.spec.ts` | 3 |
| `general/ADM-TS-19-general.spec.ts` | 8 |
| `reference-data/ADM-TS-20-reference-data.spec.ts` | 3 |
| `knowledge-base/ADM-TS-21-knowledge-base.spec.ts` | 5 |
| `users/ADM-TS-22-users.spec.ts` | 7 |
| `requests/ADM-TS-23-requests.spec.ts` | 2 |
| `notifications/ADM-TS-24-notifications.spec.ts` | 4 |
| `archive-delete-safety/ADM-TS-25-archive-delete-safety.spec.ts` | 5 |
| `navigation-search/ADM-TS-26-navigation-search.spec.ts` | 4 |

## Client portal (11 / 42)

| Spec | Tests |
|---|---:|
| `authentication/CP-TS-01-authentication.spec.ts` | 6 |
| `dashboard/CP-TS-02-dashboard.spec.ts` | 5 |
| `passengers/CP-TS-03-passengers.spec.ts` | 5 |
| `route-sheets/CP-TS-04-route-sheets.spec.ts` | 6 |
| `incidents/CP-TS-05-incidents.spec.ts` | 2 |
| `compliance/CP-TS-06-compliance.spec.ts` | 4 |
| `invoices/CP-TS-07-invoices.spec.ts` | 3 |
| `budget-economics/CP-TS-08-budget-economics.spec.ts` | 2 |
| `reports/CP-TS-09-reports.spec.ts` | 2 |
| `messaging/CP-TS-10-messaging.spec.ts` | 3 |
| `tenant-scoping/CP-TS-11-tenant-scoping.spec.ts` | 4 |

## Service Provider (10 / 40)

| Spec | Tests |
|---|---:|
| `authentication/SP-TS-01-authentication.spec.ts` | 6 |
| `dashboard/SP-TS-02-dashboard.spec.ts` | 5 |
| `drivers/SP-TS-03-drivers.spec.ts` | 5 |
| `monitors/SP-TS-04-monitors.spec.ts` | 2 |
| `compliance/SP-TS-05-compliance.spec.ts` | 4 |
| `trips/SP-TS-06-trips.spec.ts` | 4 |
| `accounting/SP-TS-07-accounting.spec.ts` | 6 |
| `reports/SP-TS-08-reports.spec.ts` | 2 |
| `messaging/SP-TS-09-messaging.spec.ts` | 3 |
| `tenant-scoping/SP-TS-10-tenant-scoping.spec.ts` | 3 |

## Driver, Parent, Journey

| Folder | Spec | Tests |
|---|---|---:|
| `driver-app/` | `authentication/DRV-TS-01-authentication.spec.ts` | 4 |
| `driver-app/` | `home/DRV-TS-02-home.spec.ts` | 3 |
| `guardian-app/` | `authentication/GRD-TS-01-authentication.spec.ts` | 4 |
| `guardian-app/` | `home/GRD-TS-02-home.spec.ts` | 3 |
| `journey/` | `connected-apps.spec.ts` | 4 |
| `journey/` | `wayland-seed.spec.ts` | 7 |

## Notes

- Imports in archived specs were rewritten to `tests/fixtures/` after the move.
- Catalog JSON described old VCTR rows only; it moved with the suite.
- New cases use `REG-*` IDs under `tests/regression/` (see `docs/NEW-REGRESSION-SUITE-STRUCTURE.md`).
