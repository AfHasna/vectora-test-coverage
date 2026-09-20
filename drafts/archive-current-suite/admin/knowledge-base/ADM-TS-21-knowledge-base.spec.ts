import { test } from '../../../../tests/fixtures/regression-test';

const PORTAL = "Admin Portal";
const SUITE = "ADM-TS-21 — Knowledge Base";
const TMS = "https://govectora.atlassian.net/wiki/x/cwDE";
const TOTAL = 5;

test.describe.configure({ mode: 'serial' });

test.describe(SUITE, () => {

  test("VCTR-ADM-097 — KB accessible regardless of Settings permission", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-097",
      title: "KB accessible regardless of Settings permission",
      sequence: 1,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "As any authenticated role",
      actionSteps: "1) Navigate to `/settings/knowledge-base`",
      expected: "Page loads and is readable even without `settings.view`",
    });
  });

  test("VCTR-ADM-098 — Section switcher covers all 8 sections", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-098",
      title: "Section switcher covers all 8 sections",
      sequence: 2,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "KB page",
      actionSteps: "1) Open section switcher",
      expected: "System Overview, User Roles & Permissions, Modules Guide, Workflows & Flows, Reference Data, Settings Guide (General Settings), Design System, Technical Reference all present",
    });
  });

  test("VCTR-ADM-099 — Search within KB", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-099",
      title: "Search within KB",
      sequence: 3,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "KB page",
      actionSteps: "1) Type a known term in \"Search documentation…\"",
      expected: "Relevant section/snippet surfaces",
    });
  });

  test("VCTR-ADM-100 — Download PDF", async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-100",
      title: "Download PDF",
      sequence: 4,
      total: TOTAL,
      priority: "P2",
      regression: false,
      preconditions: "KB page",
      actionSteps: "1) Click \"Download PDF\"",
      expected: "PDF generates (jsPDF/Helvetica) without error",
    });
  });

  test("VCTR-ADM-101 — KB content matches live product behavior (this exercise)", { tag: '@regression' }, async ({ runCase }) => {
    await runCase({
      portal: PORTAL,
      suite: SUITE,
      tms: TMS,
      id: "VCTR-ADM-101",
      title: "KB content matches live product behavior (this exercise)",
      sequence: 5,
      total: TOTAL,
      priority: "P1",
      regression: true,
      preconditions: "Cross-reference KB Workflows page vs. observed UI in ADM-TS-13/ADM-TS-14",
      actionSteps: "1) Compare route sheet lifecycle table in KB to actual status control options",
      expected: "No contradictions between documented and observed lifecycle/transition rules",
    });
  });
});
