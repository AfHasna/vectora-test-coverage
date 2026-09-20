# Service Provider case repository (Stage 5)

**Portal:** Service Provider (`http://localhost:5175`) against staging Supabase.  
**Session:** `seed.qe.sp@vectora-portal-seed.test` (3B Trans LLC) — Stage 0 SEED provider.  
**Connected to:** Admin Loop graph. LoopDriver is **Internal**, so this portal must **not** show LoopChild / LoopDriver.  
**OTP cases:** none.

| ID | Title | Tags | Expected source |
|---|---|---|---|
| REG-SP-001 | Dashboard welcomes 3B Trans LLC | @basic @regression | known |
| REG-SP-002 | Profile menu is 3B Trans LLC, not Loop School | @basic @regression | known |
| REG-SP-003 | Drivers roster is this SP, not Internal LoopDriver | @basic @regression | kb |
| REG-SP-004 | Drivers list still loads this provider’s own roster | @regression | known |
| REG-SP-005 | Monitors page loads for this provider | @regression | common |
| REG-SP-006 | Compliance page loads for this provider | @regression | common |
| REG-SP-007 | My Requests page loads | @regression | common |
| REG-SP-008 | Active trips do not leak LoopChild Internal assignment | @basic @regression | kb |
| REG-SP-009 | Future trips page loads for this provider | @regression | common |
| REG-SP-010 | Trip history page loads for this provider | @regression | common |
| REG-SP-011 | Messaging page loads | @regression | common |
| REG-SP-012 | Help page loads | @basic @regression | common |
| REG-SP-013 | Reports page loads (read-only) | @regression | common |
| REG-SP-014 | Payouts page heading only (no accounting writes) | @regression | common |

Specs: `tests/regression/service-provider/**/*.spec.ts`. Run: `npx playwright test --project=provider`.

**Last run:** 20 Sep 2026 — 14/14 passed. Allure `allure-report/runs/2026-09-20_00-50-40-389Z-d0da1c1`. Confluence drafts: parent `18219026`, cases child `18219037`.
