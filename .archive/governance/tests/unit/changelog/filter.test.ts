import { describe, expect, it } from "vitest";
import type { ChangesetEntry, Edition } from "../../../src/types/index.js";

// Tests for edition-based changelog filtering
describe("Changelog Filter", () => {
  describe("filterByEdition", () => {
    it("should return only changes for the specified edition", async () => {
      const { filterByEdition } = await import("../../../src/changelog/filter.js");

      const entries: ChangesetEntry[] = [
        {
          id: "1",
          packages: ["@ds/wc"],
          type: "minor",
          editions: ["core", "pro", "enterprise"],
          summary: "Available to all",
        },
        {
          id: "2",
          packages: ["@ds/wc"],
          type: "minor",
          editions: ["pro", "enterprise"],
          summary: "Pro and Enterprise only",
        },
        {
          id: "3",
          packages: ["@ds/wc"],
          type: "minor",
          editions: ["enterprise"],
          summary: "Enterprise only",
        },
      ];

      const coreFiltered = filterByEdition(entries, "core");
      expect(coreFiltered).toHaveLength(1);
      expect(coreFiltered[0]?.summary).toBe("Available to all");

      const proFiltered = filterByEdition(entries, "pro");
      expect(proFiltered).toHaveLength(2);

      const enterpriseFiltered = filterByEdition(entries, "enterprise");
      expect(enterpriseFiltered).toHaveLength(3);
    });

    it("should preserve security flag when filtering", async () => {
      const { filterByEdition } = await import("../../../src/changelog/filter.js");

      const entries: ChangesetEntry[] = [
        {
          id: "1",
          packages: ["@ds/wc"],
          type: "patch",
          editions: ["core", "pro"],
          security: true,
          summary: "Security fix",
        },
      ];

      const filtered = filterByEdition(entries, "core");
      expect(filtered[0]?.security).toBe(true);
    });
  });

  describe("filterSecurityUpdates", () => {
    it("should return only security-related changes", async () => {
      const { filterSecurityUpdates } = await import("../../../src/changelog/filter.js");

      const entries: ChangesetEntry[] = [
        {
          id: "1",
          packages: ["@ds/wc"],
          type: "patch",
          editions: ["core"],
          security: true,
          summary: "Security fix",
        },
        {
          id: "2",
          packages: ["@ds/wc"],
          type: "patch",
          editions: ["core"],
          summary: "Regular fix",
        },
      ];

      const securityOnly = filterSecurityUpdates(entries);
      expect(securityOnly).toHaveLength(1);
      expect(securityOnly[0]?.security).toBe(true);
    });
  });

  describe("filterBreakingChanges", () => {
    it("should return only breaking changes", async () => {
      const { filterBreakingChanges } = await import("../../../src/changelog/filter.js");

      const entries: ChangesetEntry[] = [
        {
          id: "1",
          packages: ["@ds/wc"],
          type: "major",
          editions: ["core"],
          breaking_type: "api-change",
          summary: "Breaking change",
        },
        {
          id: "2",
          packages: ["@ds/wc"],
          type: "minor",
          editions: ["core"],
          summary: "Feature",
        },
      ];

      const breakingOnly = filterBreakingChanges(entries);
      expect(breakingOnly).toHaveLength(1);
      expect(breakingOnly[0]?.type).toBe("major");
    });
  });

  describe("aggregateChangesForTenant", () => {
    it("should aggregate changes across versions for a tenant", async () => {
      const { aggregateChangesForTenant } = await import("../../../src/changelog/filter.js");

      const releases = [
        {
          version: "1.1.0",
          entries: [
            {
              id: "1",
              packages: ["@ds/wc"],
              type: "minor" as const,
              editions: ["core" as Edition],
              summary: "Feature in 1.1.0",
            },
          ],
        },
        {
          version: "1.2.0",
          entries: [
            {
              id: "2",
              packages: ["@ds/wc"],
              type: "minor" as const,
              editions: ["core" as Edition, "pro" as Edition],
              summary: "Feature in 1.2.0",
            },
          ],
        },
      ];

      const aggregated = aggregateChangesForTenant(releases, "core", "1.0.0", "1.2.0");

      expect(aggregated.changes).toHaveLength(2);
      expect(aggregated.from_version).toBe("1.0.0");
      expect(aggregated.to_version).toBe("1.2.0");
    });
  });
});
