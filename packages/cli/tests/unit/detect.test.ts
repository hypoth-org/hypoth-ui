/**
 * Unit tests for framework and environment detection utilities
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  detectFramework,
  detectPackageManager,
  detectProject,
  detectSrcDir,
  detectTypeScript,
  getInstallCommand,
  isValidProject,
} from "../../src/utils/detect.js";

describe("detect utilities", () => {
  let testDir: string;

  beforeEach(() => {
    // Create a unique temp directory for each test
    testDir = join(tmpdir(), `hypoth-ui-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    // Clean up test directory
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe("detectPackageManager", () => {
    it("should detect pnpm from pnpm-lock.yaml", () => {
      writeFileSync(join(testDir, "pnpm-lock.yaml"), "");
      const signals: string[] = [];
      const result = detectPackageManager(testDir, signals);
      expect(result).toBe("pnpm");
      expect(signals).toContain("pnpm-lock.yaml found");
    });

    it("should detect yarn from yarn.lock", () => {
      writeFileSync(join(testDir, "yarn.lock"), "");
      const signals: string[] = [];
      const result = detectPackageManager(testDir, signals);
      expect(result).toBe("yarn");
      expect(signals).toContain("yarn.lock found");
    });

    it("should detect bun from bun.lockb", () => {
      writeFileSync(join(testDir, "bun.lockb"), "");
      const signals: string[] = [];
      const result = detectPackageManager(testDir, signals);
      expect(result).toBe("bun");
      expect(signals).toContain("bun.lockb found");
    });

    it("should detect npm from package-lock.json", () => {
      writeFileSync(join(testDir, "package-lock.json"), "{}");
      const signals: string[] = [];
      const result = detectPackageManager(testDir, signals);
      expect(result).toBe("npm");
      expect(signals).toContain("package-lock.json found");
    });

    it("should default to npm when no lock file found", () => {
      const signals: string[] = [];
      const result = detectPackageManager(testDir, signals);
      expect(result).toBe("npm");
      expect(signals).toContain("No lock file found, defaulting to npm");
    });

    it("should prioritize pnpm over other lock files", () => {
      writeFileSync(join(testDir, "pnpm-lock.yaml"), "");
      writeFileSync(join(testDir, "yarn.lock"), "");
      writeFileSync(join(testDir, "package-lock.json"), "{}");
      const signals: string[] = [];
      const result = detectPackageManager(testDir, signals);
      expect(result).toBe("pnpm");
    });
  });

  describe("detectTypeScript", () => {
    it("should detect TypeScript from tsconfig.json", () => {
      writeFileSync(join(testDir, "tsconfig.json"), "{}");
      const signals: string[] = [];
      const result = detectTypeScript(testDir, signals);
      expect(result.typescript).toBe(true);
      expect(result.tsconfigPath).toBe(join(testDir, "tsconfig.json"));
    });

    it("should detect TypeScript from tsconfig.base.json", () => {
      writeFileSync(join(testDir, "tsconfig.base.json"), "{}");
      const signals: string[] = [];
      const result = detectTypeScript(testDir, signals);
      expect(result.typescript).toBe(true);
      expect(result.tsconfigPath).toBe(join(testDir, "tsconfig.base.json"));
    });

    it("should detect JavaScript from jsconfig.json", () => {
      writeFileSync(join(testDir, "jsconfig.json"), "{}");
      const signals: string[] = [];
      const result = detectTypeScript(testDir, signals);
      expect(result.typescript).toBe(false);
      expect(result.tsconfigPath).toBeUndefined();
    });

    it("should default to JavaScript when no config found", () => {
      const signals: string[] = [];
      const result = detectTypeScript(testDir, signals);
      expect(result.typescript).toBe(false);
      expect(result.tsconfigPath).toBeUndefined();
      expect(signals).toContain("No tsconfig.json found, assuming JavaScript");
    });
  });

  describe("detectFramework", () => {
    it("should detect Next.js from dependencies", () => {
      writeFileSync(
        join(testDir, "package.json"),
        JSON.stringify({ dependencies: { next: "14.0.0", react: "18.0.0" } })
      );
      const signals: string[] = [];
      const result = detectFramework(testDir, signals);
      expect(result).toBe("next");
    });

    it("should detect React from dependencies", () => {
      writeFileSync(
        join(testDir, "package.json"),
        JSON.stringify({ dependencies: { react: "18.0.0" } })
      );
      const signals: string[] = [];
      const result = detectFramework(testDir, signals);
      expect(result).toBe("react");
    });

    it("should detect Lit (WC) from dependencies", () => {
      writeFileSync(
        join(testDir, "package.json"),
        JSON.stringify({ dependencies: { lit: "3.0.0" } })
      );
      const signals: string[] = [];
      const result = detectFramework(testDir, signals);
      expect(result).toBe("wc");
    });

    it("should detect @lit packages as WC", () => {
      writeFileSync(
        join(testDir, "package.json"),
        JSON.stringify({ dependencies: { "@lit/reactive-element": "2.0.0" } })
      );
      const signals: string[] = [];
      const result = detectFramework(testDir, signals);
      expect(result).toBe("wc");
    });

    it("should default to vanilla when no framework detected", () => {
      writeFileSync(
        join(testDir, "package.json"),
        JSON.stringify({ dependencies: { lodash: "4.0.0" } })
      );
      const signals: string[] = [];
      const result = detectFramework(testDir, signals);
      expect(result).toBe("vanilla");
    });

    it("should return unknown when no package.json exists", () => {
      const signals: string[] = [];
      const result = detectFramework(testDir, signals);
      expect(result).toBe("unknown");
      expect(signals).toContain("No package.json found");
    });

    it("should check devDependencies as well", () => {
      writeFileSync(
        join(testDir, "package.json"),
        JSON.stringify({ devDependencies: { react: "18.0.0" } })
      );
      const signals: string[] = [];
      const result = detectFramework(testDir, signals);
      expect(result).toBe("react");
    });
  });

  describe("detectSrcDir", () => {
    it("should detect src directory", () => {
      mkdirSync(join(testDir, "src"), { recursive: true });
      const signals: string[] = [];
      const result = detectSrcDir(testDir, signals);
      expect(result).toBe("src");
      expect(signals).toContain("src/ directory found");
    });

    it("should detect app directory", () => {
      mkdirSync(join(testDir, "app"), { recursive: true });
      const signals: string[] = [];
      const result = detectSrcDir(testDir, signals);
      expect(result).toBe("app");
      expect(signals).toContain("app/ directory found");
    });

    it("should prioritize src over app", () => {
      mkdirSync(join(testDir, "src"), { recursive: true });
      mkdirSync(join(testDir, "app"), { recursive: true });
      const signals: string[] = [];
      const result = detectSrcDir(testDir, signals);
      expect(result).toBe("src");
    });

    it("should default to src when no common directory found", () => {
      const signals: string[] = [];
      const result = detectSrcDir(testDir, signals);
      expect(result).toBe("src");
      expect(signals).toContain("No common source directory found, defaulting to src");
    });
  });

  describe("detectProject", () => {
    it("should return complete detection result", () => {
      writeFileSync(join(testDir, "pnpm-lock.yaml"), "");
      writeFileSync(join(testDir, "tsconfig.json"), "{}");
      writeFileSync(
        join(testDir, "package.json"),
        JSON.stringify({ dependencies: { next: "14.0.0", react: "18.0.0" } })
      );
      mkdirSync(join(testDir, "src"), { recursive: true });

      const result = detectProject(testDir);

      expect(result.packageManager).toBe("pnpm");
      expect(result.typescript).toBe(true);
      expect(result.framework).toBe("next");
      expect(result.srcDir).toBe("src");
      expect(result.confidence).toBe("high");
      expect(result.signals.length).toBeGreaterThan(0);
    });

    it("should have low confidence with minimal signals", () => {
      const result = detectProject(testDir);
      expect(result.confidence).toBe("low");
    });
  });

  describe("isValidProject", () => {
    it("should return true when package.json exists", () => {
      writeFileSync(join(testDir, "package.json"), "{}");
      expect(isValidProject(testDir)).toBe(true);
    });

    it("should return false when package.json does not exist", () => {
      expect(isValidProject(testDir)).toBe(false);
    });
  });

  describe("getInstallCommand", () => {
    it("should return correct command for each package manager", () => {
      expect(getInstallCommand("npm")).toBe("npm install");
      expect(getInstallCommand("pnpm")).toBe("pnpm add");
      expect(getInstallCommand("yarn")).toBe("yarn add");
      expect(getInstallCommand("bun")).toBe("bun add");
    });
  });
});
