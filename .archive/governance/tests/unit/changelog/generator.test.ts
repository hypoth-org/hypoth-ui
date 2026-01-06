import { describe, expect, it } from "vitest";
import type { ChangesetEntry } from "../../../src/types/index.js";

// Tests for changelog generation
describe("Changelog Generator", () => {
  describe("generateChangelogEntry", () => {
    it("should format a feature entry correctly", async () => {
      // Import dynamically to ensure module exists
      const { generateChangelogEntry } = await import(
        "../../../src/changelog/generator.js"
      );

      const entry: ChangesetEntry = {
        id: "happy-dog-123",
        packages: ["@ds/wc"],
        type: "minor",
        editions: ["core", "pro", "enterprise"],
        summary: "Added new DatePicker component",
      };

      const result = generateChangelogEntry(entry);

      expect(result).toContain("Added new DatePicker component");
      expect(result).toContain("@ds/wc");
    });

    it("should mark security changes prominently", async () => {
      const { generateChangelogEntry } = await import(
        "../../../src/changelog/generator.js"
      );

      const entry: ChangesetEntry = {
        id: "urgent-fix-456",
        packages: ["@ds/wc"],
        type: "patch",
        editions: ["core", "pro", "enterprise"],
        security: true,
        summary: "Fixed XSS vulnerability in tooltip",
      };

      const result = generateChangelogEntry(entry);

      expect(result).toContain("SECURITY");
      expect(result).toContain("Fixed XSS vulnerability");
    });

    it("should include breaking change marker for major changes", async () => {
      const { generateChangelogEntry } = await import(
        "../../../src/changelog/generator.js"
      );

      const entry: ChangesetEntry = {
        id: "breaking-789",
        packages: ["@ds/wc", "@ds/react"],
        type: "major",
        editions: ["core", "pro", "enterprise"],
        breaking_type: "api-change",
        summary: "Changed Button API to use slots",
      };

      const result = generateChangelogEntry(entry);

      expect(result).toContain("BREAKING");
    });
  });

  describe("groupChangesByType", () => {
    it("should group entries by change type", async () => {
      const { groupChangesByType } = await import(
        "../../../src/changelog/generator.js"
      );

      const entries: ChangesetEntry[] = [
        {
          id: "1",
          packages: ["@ds/wc"],
          type: "major",
          editions: ["core"],
          summary: "Breaking change",
        },
        {
          id: "2",
          packages: ["@ds/wc"],
          type: "minor",
          editions: ["core"],
          summary: "New feature",
        },
        {
          id: "3",
          packages: ["@ds/wc"],
          type: "patch",
          editions: ["core"],
          summary: "Bug fix",
        },
      ];

      const grouped = groupChangesByType(entries);

      expect(grouped.breaking).toHaveLength(1);
      expect(grouped.features).toHaveLength(1);
      expect(grouped.fixes).toHaveLength(1);
    });

    it("should separate security changes into their own group", async () => {
      const { groupChangesByType } = await import(
        "../../../src/changelog/generator.js"
      );

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

      const grouped = groupChangesByType(entries);

      expect(grouped.security).toHaveLength(1);
      expect(grouped.fixes).toHaveLength(1);
    });
  });

  describe("generateChangelog", () => {
    it("should generate a valid changelog markdown", async () => {
      const { generateChangelog } = await import(
        "../../../src/changelog/generator.js"
      );

      const entries: ChangesetEntry[] = [
        {
          id: "1",
          packages: ["@ds/wc"],
          type: "minor",
          editions: ["core", "pro"],
          summary: "Added Button component",
        },
      ];

      const result = generateChangelog("1.1.0", entries);

      expect(result).toContain("## [1.1.0]");
      expect(result).toContain("### Added");
      expect(result).toContain("Added Button component");
    });
  });
});
