# Connected apps case repository (Stage 8)

**Chain:** Admin Loop graph → Client Loop School sees LoopChild → SP 3B Trans does **not** see Internal LoopDriver/LoopChild → Driver Ahmad does **not** see LoopChild → Parent LoopParent **does** see LoopChild.  
**OTP cases:** none. Fresh browser context per portal (no Admin storageState on Expo).

| ID | Title | Tags | Expected source |
|---|---|---|---|
| REG-CONN-001 | Client portal shows LoopChild | @basic @regression | kb |
| REG-CONN-002 | SP portal does not show Internal LoopDriver or LoopChild | @basic @regression | kb |
| REG-CONN-003 | Driver app is Ahmad-scoped, not LoopChild | @basic @regression | kb |
| REG-CONN-004 | Parent app shows LoopChild | @basic @regression | kb |

**Last run:** 20 Sep 2026 — 4/4 passed. Allure `allure-report/runs/2026-09-20_02-35-58-569Z-d0da1c1`. Confluence drafts: parent `18120713`, cases child `18186255`.
