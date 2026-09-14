import { test } from '../../fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-02 — Dashboard";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 8;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-010 — Status Summary Cards render", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-010",
      title: "Status Summary Cards render",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Logged in, `/`",
      actionSteps: "1) Observe Clients/Drivers/Vehicles/Passengers cards",
      expected: "Each card shows status breakdown (e.g. Clients: Contracted/Vendor Listed/Backup Listed/Prospect/Draft), color dots, totals",
    });
  });

  test("VCTR-ADM-011 — Card click navigates to filtered list", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-011",
      title: "Card click navigates to filtered list",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/`",
      actionSteps: "1) Click a status dot/title on a card (e.g. Drivers → Compliant)",
      expected: "Navigates to the corresponding module list, pre-filtered by that status",
    });
  });

  test("VCTR-ADM-012 — Compliance Summary 2×2 widget", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-012",
      title: "Compliance Summary 2×2 widget",
      sequence: 3,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "`/`",
      actionSteps: "1) Observe Driver/Vehicle/Monitor/Provider panels",
      expected: "Each shows Compliant/Expiring/Non-Compliant counts, % progress bar, \"View Details\" link to correct route",
    });
  });

  test("VCTR-ADM-013 — Today's Overview links work", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-013",
      title: "Today's Overview links work",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/`",
      actionSteps: "1) Click \"Active Trips\" row",
      expected: "Navigates to `/service-operations/active-trips`; count badge matches actual active trip count",
    });
  });

  test("VCTR-ADM-014 — Realtime \"Last updated\" refresh", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-014",
      title: "Realtime \"Last updated\" refresh",
      sequence: 5,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "`/`",
      actionSteps: "1) Note \"Last updated\" timestamp 2) Wait 60+ seconds",
      expected: "Timestamp advances (poll cycle); no full-page reload required",
    });
  });

  test("VCTR-ADM-015 — Dark/Light mode toggle", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-015",
      title: "Dark/Light mode toggle",
      sequence: 6,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "`/`",
      actionSteps: "1) Toggle header theme button",
      expected: "Theme switches instantly; sidebar remains navy in both modes; preference persists on reload",
    });
  });

  test("VCTR-ADM-016 — Global Search (⌘K)", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-016",
      title: "Global Search (⌘K)",
      sequence: 7,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Any page",
      actionSteps: "1) Press Ctrl+K / ⌘K 2) Type a known client/driver/vehicle name",
      expected: "Fuzzy-matched result appears with highlighted characters; selecting it navigates to that record",
    });
  });

  test("VCTR-ADM-017 — Sidebar collapse persists", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-017",
      title: "Sidebar collapse persists",
      sequence: 8,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "Any page",
      actionSteps: "1) Press Ctrl+B or click collapse toggle 2) Reload page",
      expected: "Sidebar remains collapsed after reload (state persistence)",
    });
  });
});
