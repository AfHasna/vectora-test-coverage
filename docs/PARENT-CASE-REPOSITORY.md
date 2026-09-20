# Parent (Guardian) case repository (Stage 7)

**Portal:** Parent Expo web (`http://localhost:8081`) against staging Supabase.  
**Session:** `seed.qe.loop.parent@vectora-portal-seed.test` (**SEED LoopParent**). Not Stage 0 `GUARDIAN_EMAIL` (Kelly).  
**Connected to:** Admin Loop graph. LoopParent must see **LoopChild**.  
**OTP cases:** none. Do not tap Log Out. Do not Back from Account Information (Expo web session).

| ID | Title | Tags | Expected source |
|---|---|---|---|
| REG-PAR-001 | Home greets the Loop parent | @basic @regression | known |
| REG-PAR-002 | Home is LoopChild-scoped, not Kelly/Aiden | @basic @regression | kb |
| REG-PAR-003 | Home tab is available | @regression | common |
| REG-PAR-004 | Trips scheduled list is LoopParent-scoped | @basic @regression | kb |
| REG-PAR-005 | Trip history tab loads | @regression | common |
| REG-PAR-006 | Messages tab loads | @regression | common |
| REG-PAR-007 | Notifications tab loads | @regression | common |
| REG-PAR-008 | More shows SEED LoopParent, not Kelly | @basic @regression | known |
| REG-PAR-009 | Passengers list includes LoopChild | @basic @regression | kb |
| REG-PAR-010 | Log Out is present (do not tap) | @regression | common |
| REG-PAR-011 | Account Information opens (last navigation) | @regression | common |
| REG-PAR-012 | Account is LoopParent, still not Kelly | @regression | known |

**Last run:** 20 Sep 2026 — 12/12 passed. Allure `allure-report/runs/2026-09-20_02-27-09-277Z-d0da1c1`. Confluence drafts: parent `18219048`, cases child `18153519`.
