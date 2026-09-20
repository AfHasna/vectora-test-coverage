# Client portal case repository (Stage 4)

**Portal:** Client (`http://localhost:5174`) against staging Supabase.  
**Session:** `seed.qe.loop.client@vectora-portal-seed.test` (SEED_QE Loop School) — not the Westborough Stage 0 `CLIENT_EMAIL`.  
**Connected to:** Admin REG-ADM Loop graph (client, LoopChild, RSO/RSR-0904, LoopDriver, today OD).  
**OTP cases:** none (whitelist `000000` used only in setup).

| ID | Title | Tags | Expected source |
|---|---|---|---|
| REG-CP-001 | Dashboard loads for the Loop School portal user | @basic @regression | known |
| REG-CP-002 | Account menu is scoped to SEED_QE Loop School | @basic @regression | known |
| REG-CP-003 | Passengers list shows SEED LoopChild | @basic @regression | kb |
| REG-CP-004 | LoopChild profile opens with Loop School on the record | @regression | known |
| REG-CP-005 | Route sheets list the Loop RSO/RSR-0904 sheet | @basic @regression | kb |
| REG-CP-006 | Active trips show the Loop run for today (or No trips today when no Sunday run) | @basic @regression | known |
| REG-CP-007 | On Demand list includes LoopChild for today | @regression | known |
| REG-CP-008 | Future trips page loads for Loop School | @regression | common |
| REG-CP-009 | Trip history page loads scoped to Loop School | @regression | common |
| REG-CP-010 | Incidents page loads for Loop School | @regression | common |
| REG-CP-011 | Driver compliance lists LoopDriver for this client | @regression | known |
| REG-CP-012 | Messages page loads for Loop School | @regression | common |
| REG-CP-013 | Help page is available to the Loop School user | @basic @regression | common |
| REG-CP-014 | Invoices page is tenant-scoped (empty allowed) | @regression | common |

Specs: `tests/regression/client/**/*.spec.ts`. Run: `npx playwright test --project=client`.

**Last run:** 20 Sep 2026 — 14/14 passed. Allure `allure-report/runs/2026-09-20_00-42-41-017Z-d0da1c1`. Confluence drafts: parent `18153493`, cases child `18219014`.
