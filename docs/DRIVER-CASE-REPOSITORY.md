# Driver app case repository (Stage 6)

**Portal:** Driver Expo web (`http://localhost:8082`) against staging Supabase.  
**Session:** `seed.qe.driver@vectora-portal-seed.test` (**Ahmad Abu Hasna** / 3B Trans).  
**Connected to:** Admin Loop graph. Loop sheets were assigned to **Internal LoopDriver**, so Ahmad must **not** see LoopChild.  
**OTP cases:** none. Do not Accept / Start trips in these cases.

| ID | Title | Tags | Expected source |
|---|---|---|---|
| REG-DRV-001 | Home greets Ahmad, not LoopDriver | @basic @regression | known |
| REG-DRV-002 | Today’s board does not show LoopChild (Internal assignment) | @basic @regression | kb |
| REG-DRV-003 | Home tab is available | @regression | common |
| REG-DRV-004 | My Trips scheduled list is Ahmad-scoped | @basic @regression | kb |
| REG-DRV-005 | Trip history tab loads | @regression | common |
| REG-DRV-006 | Messages tab loads | @regression | common |
| REG-DRV-007 | Notifications tab loads | @regression | common |
| REG-DRV-008 | More tab shows Ahmad Abu Hasna, not LoopDriver | @basic @regression | known |
| REG-DRV-009 | More lists account, compliance, vehicles, equipment | @regression | common |
| REG-DRV-010 | Log Out is present (do not tap) | @regression | common |
| REG-DRV-011 | Account Information opens (last navigation) | @regression | common |
| REG-DRV-012 | LoopChild still not on this driver session | @regression | kb |

Specs: `tests/regression/driver-app/REG-DRV-loop.spec.ts`. Run: `npx playwright test --project=driver`.

**Last run:** 20 Sep 2026 — 12/12 passed. Allure `allure-report/runs/2026-09-20_01-33-39-674Z-d0da1c1`. Confluence drafts: parent `18153507`, cases child `18186244`.
