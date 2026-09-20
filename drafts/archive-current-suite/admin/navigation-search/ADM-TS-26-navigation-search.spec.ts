import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-26 — Navigation & Search";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 4;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-120 — Breadcrumbs are context-aware", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-120",
      title: "Breadcrumbs are context-aware",
      sequence: 1,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Various pages",
      actionSteps: "1) Navigate to Add/Edit screens across modules",
      expected: "Breadcrumb shows correct contextual label (e.g. \"Add Client\", \"Edit Driver\"); record UUIDs hidden from path",
    });
  });

  test("VCTR-ADM-121 — Hover flyout sub-menus", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-121",
      title: "Hover flyout sub-menus",
      sequence: 2,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "Sidebar, collapsed and expanded states",
      actionSteps: "1) Hover each top-level sidebar item",
      expected: "Flyout lists correct sub-tabs; nested flyout for Settings → Reference Data",
    });
  });

  test("VCTR-ADM-122 — Global Search entity coverage", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-122",
      title: "Global Search entity coverage",
      sequence: 3,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "⌘K palette",
      actionSteps: "1) Search a known Client, Passenger, Driver, Vehicle name each",
      expected: "Each entity type returns a match per documented \"Entity Categories Searched\"",
    });
  });

  test("VCTR-ADM-123 — Search relevance & highlight", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-123",
      title: "Search relevance & highlight",
      sequence: 4,
      total: TOTAL,
      priority: "P3",
      regression: false,
      preconditions: "⌘K palette",
      actionSteps: "1) Type a partial/fuzzy query",
      expected: "Matching characters highlighted (teal); browse mode shows 10/category, search mode up to 200 relevance-sorted",
    });
  });
});
