import { describe, expect, it } from "vitest";
import type { Edition } from "../../../src/types/index.js";
import type { ReleaseWithEntries } from "../../../src/changelog/types.js";

describe("Tenant Diff", () => {
  const mockReleases: ReleaseWithEntries[] = [
    {
      version: "1.1.0",
      entries: [
        {
          id: "1",
          packages: ["@ds/wc"],
          type: "minor",
          editions: ["core", "pro", "enterprise"],
          summary: "New button variant",
        },
      ],
    },
    {
      version: "1.2.0",
      entries: [
        {
          id: "2",
          packages: ["@ds/wc"],
          type: "patch",
          editions: ["core", "pro", "enterprise"],
          security: true,
          summary: "Security fix",
        },
      ],
    },
    {
      version: "2.0.0",
      entries: [
        {
          id: "3",
          packages: ["@ds/wc"],
          type: "major",
          editions: ["pro", "enterprise"],
          breaking_type: "api-change",
          summary: "Breaking change",
        },
      ],
    },
  ];

  describe("calculateVersionDiff", () => {
    it("should calculate versions behind", async () => {
      const { calculateVersionDiff } = await import(
        "../../../src/tenant/diff.js"
      );

      const diff = calculateVersionDiff("1.0.0", "2.0.0", mockReleases, "core");

      expect(diff.versionsBehind).toBe(3);
      expect(diff.hasMajorUpgrade).toBe(true);
    });

    it("should detect security updates", async () => {
      const { calculateVersionDiff } = await import(
        "../../../src/tenant/diff.js"
      );

      const diff = calculateVersionDiff("1.1.0", "1.2.0", mockReleases, "core");

      expect(diff.hasSecurityUpdates).toBe(true);
      expect(diff.hasBreakingChanges).toBe(false);
    });

    it("should filter by edition", async () => {
      const { calculateVersionDiff } = await import(
        "../../../src/tenant/diff.js"
      );

      // Core edition should not see the breaking change (pro/enterprise only)
      const coreDiff = calculateVersionDiff("1.0.0", "2.0.0", mockReleases, "core");
      expect(coreDiff.hasBreakingChanges).toBe(false);

      // Pro edition should see the breaking change
      const proDiff = calculateVersionDiff("1.0.0", "2.0.0", mockReleases, "pro");
      expect(proDiff.hasBreakingChanges).toBe(true);
    });
  });

  describe("summarizeChanges", () => {
    it("should count changes by type", async () => {
      const { summarizeChanges } = await import(
        "../../../src/tenant/diff.js"
      );

      const entries = mockReleases.flatMap((r) => r.entries);
      const summary = summarizeChanges(entries);

      expect(summary.totalChanges).toBe(3);
      expect(summary.securityUpdates).toBe(1);
      expect(summary.breakingChanges).toBe(1);
      expect(summary.features).toBe(1);
    });
  });

  describe("generateTenantUpdateReport", () => {
    it("should generate full report", async () => {
      const { generateTenantUpdateReport } = await import(
        "../../../src/tenant/diff.js"
      );

      const tenant = {
        id: "acme",
        name: "Acme Corp",
        edition: "pro" as Edition,
        currentVersion: "1.0.0",
      };

      const report = generateTenantUpdateReport(tenant, mockReleases, "2.0.0");

      expect(report.tenant.name).toBe("Acme Corp");
      expect(report.diff.versionsBehind).toBe(3);
      expect(report.securityUpdates).toHaveLength(1);
      expect(report.breakingChanges).toHaveLength(1);
      expect(report.generatedAt).toBeDefined();
    });
  });

  describe("determineUpdateUrgency", () => {
    it("should return critical for security updates", async () => {
      const { generateTenantUpdateReport, determineUpdateUrgency } = await import(
        "../../../src/tenant/diff.js"
      );

      const tenant = {
        id: "acme",
        name: "Acme Corp",
        edition: "core" as Edition,
        currentVersion: "1.1.0",
      };

      const report = generateTenantUpdateReport(tenant, mockReleases, "1.2.0");
      const urgency = determineUpdateUrgency(report);

      expect(urgency).toBe("critical");
    });

    it("should return none when up to date", async () => {
      const { generateTenantUpdateReport, determineUpdateUrgency } = await import(
        "../../../src/tenant/diff.js"
      );

      const tenant = {
        id: "acme",
        name: "Acme Corp",
        edition: "core" as Edition,
        currentVersion: "2.0.0",
      };

      const report = generateTenantUpdateReport(tenant, mockReleases, "2.0.0");
      const urgency = determineUpdateUrgency(report);

      expect(urgency).toBe("none");
    });
  });

  describe("generateUpdateRecommendation", () => {
    it("should provide actionable recommendations", async () => {
      const { generateTenantUpdateReport, generateUpdateRecommendation } = await import(
        "../../../src/tenant/diff.js"
      );

      const tenant = {
        id: "acme",
        name: "Acme Corp",
        edition: "pro" as Edition,
        currentVersion: "1.0.0",
      };

      const report = generateTenantUpdateReport(tenant, mockReleases, "2.0.0");
      const recommendation = generateUpdateRecommendation(report);

      expect(recommendation.urgency).toBe("critical");
      expect(recommendation.reasons.length).toBeGreaterThan(0);
      expect(recommendation.nextSteps.length).toBeGreaterThan(0);
    });
  });
});
