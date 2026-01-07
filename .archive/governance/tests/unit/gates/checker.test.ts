import { describe, expect, it } from "vitest";
import type { GateContext } from "../../../src/gates/types.js";
import type { GatesConfig } from "../../../src/types/index.js";

describe("Gates Checker", () => {
  const mockConfig: GatesConfig = {
    gates: [
      {
        id: "typecheck",
        name: "TypeScript",
        description: "Type checking",
        type: "automated",
        required: true,
      },
      {
        id: "lint",
        name: "Lint",
        description: "Linting",
        type: "automated",
        required: true,
      },
      {
        id: "design-review",
        name: "Design Review",
        description: "Manual design review",
        type: "manual",
        required: false,
      },
    ],
  };

  const mockContext: GateContext = {
    repoRoot: "/test/repo",
    files: ["packages/wc/src/components/button/button.ts"],
    branch: "feature/new-button",
  };

  describe("runGates", () => {
    it("should run all gates and return report", async () => {
      const { runGates } = await import("../../../src/gates/checker.js");

      const report = await runGates(mockConfig, mockContext);

      // Gates without runners or commands are skipped, so we just check the report exists
      expect(report.total).toBeGreaterThanOrEqual(1);
      expect(report.results.length).toBeGreaterThanOrEqual(1);
      expect(report.timestamp).toBeDefined();
    });

    it("should mark manual gates as skipped", async () => {
      const { runGates } = await import("../../../src/gates/checker.js");

      // Run only the manual gate
      const report = await runGates(mockConfig, mockContext, {
        gates: ["design-review"],
      });

      const manualResult = report.results.find((r) => r.gate === "design-review");
      expect(manualResult?.skipped).toBe(true);
      expect(manualResult?.skipReason).toContain("Manual");
    });

    it("should filter gates when specified", async () => {
      const { runGates } = await import("../../../src/gates/checker.js");

      const report = await runGates(mockConfig, mockContext, {
        gates: ["design-review"],
      });

      expect(report.results).toHaveLength(1);
      expect(report.results[0]?.gate).toBe("design-review");
    });
  });

  describe("formatGatesReport", () => {
    it("should format report as readable text", async () => {
      const { runGates, formatGatesReport } = await import("../../../src/gates/checker.js");

      const report = await runGates(mockConfig, mockContext, {
        gates: ["design-review"],
      });
      const formatted = formatGatesReport(report);

      expect(formatted).toContain("Contribution Gates Report");
      expect(formatted).toContain("design-review");
      expect(formatted).toContain("Duration:");
    });
  });

  describe("getRequiredFailures", () => {
    it("should return only required gates that failed", async () => {
      const { getRequiredFailures } = await import("../../../src/gates/checker.js");

      const report = {
        passed: false,
        total: 3,
        passedCount: 1,
        failedCount: 2,
        skippedCount: 0,
        results: [
          { gate: "typecheck", type: "automated" as const, passed: false, error: "Failed" },
          { gate: "lint", type: "automated" as const, passed: true },
          { gate: "design-review", type: "manual" as const, passed: false, error: "Failed" },
        ],
        durationMs: 100,
        timestamp: new Date().toISOString(),
      };

      const failures = getRequiredFailures(report, mockConfig);

      // typecheck is required and failed
      expect(failures).toHaveLength(1);
      expect(failures[0]?.gate).toBe("typecheck");
    });
  });
});
