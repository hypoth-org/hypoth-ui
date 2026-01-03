import { describe, expect, it } from "vitest";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { checkFile, scanForAutoDefine } from "../scripts/check-auto-define.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const fixturesDir = resolve(__dirname, "fixtures/auto-define");

describe("check-auto-define", () => {
  describe("checkFile", () => {
    it("should find no violations in compliant file", () => {
      const filePath = resolve(fixturesDir, "compliant.ts");
      const violations = checkFile(filePath);

      expect(violations).toHaveLength(0);
    });

    it("should find violations in non-compliant file", () => {
      const filePath = resolve(fixturesDir, "non-compliant.ts");
      const violations = checkFile(filePath);

      // Should find 3 violations:
      // 1. customElements.define("non-compliant-button", NonCompliantButton)
      // 2. window.customElements.define("another-non-compliant", AnotherNonCompliantElement)
      // 3. customElements.define("guarded-element", GuardedButStillBad) inside if block
      expect(violations.length).toBeGreaterThanOrEqual(3);
    });

    it("should include file path in violation", () => {
      const filePath = resolve(fixturesDir, "non-compliant.ts");
      const violations = checkFile(filePath);

      expect(violations[0]?.file).toBe(filePath);
    });

    it("should include line number in violation", () => {
      const filePath = resolve(fixturesDir, "non-compliant.ts");
      const violations = checkFile(filePath);

      expect(violations[0]?.line).toBeGreaterThan(0);
    });

    it("should include message in violation", () => {
      const filePath = resolve(fixturesDir, "non-compliant.ts");
      const violations = checkFile(filePath);

      expect(violations[0]?.message).toContain("customElements.define");
    });

    it("should include code snippet in violation", () => {
      const filePath = resolve(fixturesDir, "non-compliant.ts");
      const violations = checkFile(filePath);

      expect(violations[0]?.code).toContain("customElements.define");
    });
  });

  describe("scanForAutoDefine", () => {
    it("should scan multiple files", () => {
      const result = scanForAutoDefine(
        [`${fixturesDir}/*.ts`],
        []
      );

      expect(result.filesScanned).toBe(2);
    });

    it("should find violations across files", () => {
      const result = scanForAutoDefine(
        [`${fixturesDir}/*.ts`],
        []
      );

      // Only non-compliant.ts has violations
      expect(result.violations.length).toBeGreaterThanOrEqual(3);
    });

    it("should exclude files matching exclude patterns", () => {
      const result = scanForAutoDefine(
        [`${fixturesDir}/*.ts`],
        [`${fixturesDir}/non-compliant.ts`]
      );

      // Should only scan compliant.ts, which has no violations
      expect(result.violations).toHaveLength(0);
      expect(result.filesScanned).toBe(1);
    });

    it("should handle empty patterns gracefully", () => {
      const result = scanForAutoDefine(
        [`${fixturesDir}/non-existent-pattern-*.ts`],
        []
      );

      expect(result.filesScanned).toBe(0);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe("compliance detection", () => {
    it("should not flag define() inside a function", () => {
      const filePath = resolve(fixturesDir, "compliant.ts");
      const violations = checkFile(filePath);

      // The compliant file has define() inside functions
      // These should NOT be flagged
      expect(violations).toHaveLength(0);
    });

    it("should not flag define() inside a class method", () => {
      const filePath = resolve(fixturesDir, "compliant.ts");
      const violations = checkFile(filePath);

      // The ComponentRegistry.register method has define()
      // This should NOT be flagged
      expect(violations).toHaveLength(0);
    });

    it("should not flag define() in arrow functions", () => {
      const filePath = resolve(fixturesDir, "compliant.ts");
      const violations = checkFile(filePath);

      // The lazyDefine arrow function has define()
      // This should NOT be flagged
      expect(violations).toHaveLength(0);
    });

    it("should flag top-level define() even with guard", () => {
      const filePath = resolve(fixturesDir, "non-compliant.ts");
      const violations = checkFile(filePath);

      // The guarded-element define is still top-level
      const guardedViolation = violations.find((v) =>
        v.code.includes("guarded-element")
      );

      expect(guardedViolation).toBeDefined();
    });
  });
});
