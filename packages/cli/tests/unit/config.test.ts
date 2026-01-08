/**
 * Unit tests for configuration management utilities
 */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { DSConfig } from "../../src/types/index.js";
import {
  addInstalledComponent,
  configExists,
  createConfig,
  getConfigPath,
  getInstalledComponent,
  isComponentInstalled,
  readConfig,
  validateConfig,
  writeConfig,
} from "../../src/utils/config.js";

describe("config utilities", () => {
  let testDir: string;

  beforeEach(() => {
    testDir = join(tmpdir(), `hypoth-ui-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  const validConfig: DSConfig = {
    $schema: "https://hypoth-ui.dev/schema/ds.config.json",
    style: "package",
    framework: "react",
    typescript: true,
    packageManager: "npm",
    paths: {
      components: "src/components/ui",
      utils: "src/lib",
    },
    aliases: {
      components: "@/components/ui",
      lib: "@/lib",
    },
    components: [],
  };

  describe("configExists", () => {
    it("should return false when no config exists", () => {
      expect(configExists(testDir)).toBe(false);
    });

    it("should return true when config exists", () => {
      writeFileSync(join(testDir, "ds.config.json"), "{}");
      expect(configExists(testDir)).toBe(true);
    });
  });

  describe("getConfigPath", () => {
    it("should return correct config path", () => {
      expect(getConfigPath(testDir)).toBe(join(testDir, "ds.config.json"));
    });
  });

  describe("readConfig", () => {
    it("should throw when config does not exist", () => {
      expect(() => readConfig(testDir)).toThrow(
        "Configuration file not found. Run 'hypoth-ui init' first."
      );
    });

    it("should throw on invalid JSON", () => {
      writeFileSync(join(testDir, "ds.config.json"), "not json");
      expect(() => readConfig(testDir)).toThrow("Invalid JSON");
    });

    it("should read and validate valid config", () => {
      writeFileSync(join(testDir, "ds.config.json"), JSON.stringify(validConfig));
      const config = readConfig(testDir);
      expect(config.style).toBe("package");
      expect(config.framework).toBe("react");
    });
  });

  describe("writeConfig", () => {
    it("should write config to file", () => {
      writeConfig(validConfig, testDir);
      expect(existsSync(join(testDir, "ds.config.json"))).toBe(true);

      const content = readFileSync(join(testDir, "ds.config.json"), "utf-8");
      const parsed = JSON.parse(content);
      expect(parsed.style).toBe("package");
    });

    it("should format config with proper indentation", () => {
      writeConfig(validConfig, testDir);
      const content = readFileSync(join(testDir, "ds.config.json"), "utf-8");
      expect(content).toContain("  "); // Should have indentation
      expect(content.endsWith("\n")).toBe(true); // Should have trailing newline
    });
  });

  describe("createConfig", () => {
    it("should create config with defaults", () => {
      const config = createConfig({});
      expect(config.$schema).toBe("https://hypoth-ui.dev/schema/ds.config.json");
      expect(config.style).toBe("package");
      expect(config.framework).toBe("react");
      expect(config.typescript).toBe(true);
      expect(config.packageManager).toBe("npm");
    });

    it("should override defaults with provided options", () => {
      const config = createConfig({
        style: "copy",
        framework: "next",
        typescript: false,
        packageManager: "pnpm",
      });
      expect(config.style).toBe("copy");
      expect(config.framework).toBe("next");
      expect(config.typescript).toBe(false);
      expect(config.packageManager).toBe("pnpm");
    });
  });

  describe("validateConfig", () => {
    it("should throw on null config", () => {
      expect(() => validateConfig(null)).toThrow("Invalid configuration: expected object");
    });

    it("should throw on invalid style", () => {
      expect(() => validateConfig({ ...validConfig, style: "invalid" })).toThrow(
        'style must be "copy" or "package"'
      );
    });

    it("should throw on invalid framework", () => {
      expect(() => validateConfig({ ...validConfig, framework: "invalid" })).toThrow(
        'framework must be "react", "next", "wc", or "vanilla"'
      );
    });

    it("should throw on invalid typescript value", () => {
      expect(() => validateConfig({ ...validConfig, typescript: "yes" })).toThrow(
        "typescript must be a boolean"
      );
    });

    it("should throw on invalid packageManager", () => {
      expect(() => validateConfig({ ...validConfig, packageManager: "invalid" })).toThrow(
        'packageManager must be "npm", "pnpm", "yarn", or "bun"'
      );
    });

    it("should throw on missing paths", () => {
      expect(() => validateConfig({ ...validConfig, paths: null })).toThrow(
        "paths must be an object"
      );
    });

    it("should throw on missing paths.components", () => {
      expect(() =>
        validateConfig({ ...validConfig, paths: { components: 123, utils: "src/lib" } })
      ).toThrow("paths.components and paths.utils must be strings");
    });

    it("should throw on missing aliases", () => {
      expect(() => validateConfig({ ...validConfig, aliases: null })).toThrow(
        "aliases must be an object"
      );
    });

    it("should throw on invalid aliases", () => {
      expect(() =>
        validateConfig({ ...validConfig, aliases: { components: 123, lib: "@/lib" } })
      ).toThrow("aliases.components and aliases.lib must be strings");
    });

    it("should throw on invalid components array", () => {
      expect(() => validateConfig({ ...validConfig, components: "not an array" })).toThrow(
        "components must be an array"
      );
    });

    it("should return valid config", () => {
      const result = validateConfig(validConfig);
      expect(result).toEqual(validConfig);
    });
  });

  describe("addInstalledComponent", () => {
    it("should add component to config", () => {
      const updated = addInstalledComponent(validConfig, {
        name: "button",
        version: "1.0.0",
        mode: "package",
      });

      expect(updated.components).toHaveLength(1);
      expect(updated.components[0].name).toBe("button");
      expect(updated.components[0].version).toBe("1.0.0");
      expect(updated.components[0].mode).toBe("package");
      expect(updated.components[0].installedAt).toBeDefined();
    });

    it("should replace existing component with same name", () => {
      const configWithComponent: DSConfig = {
        ...validConfig,
        components: [
          {
            name: "button",
            version: "0.9.0",
            installedAt: "2026-01-01T00:00:00Z",
            mode: "package",
          },
        ],
      };

      const updated = addInstalledComponent(configWithComponent, {
        name: "button",
        version: "1.0.0",
        mode: "copy",
      });

      expect(updated.components).toHaveLength(1);
      expect(updated.components[0].version).toBe("1.0.0");
      expect(updated.components[0].mode).toBe("copy");
    });

    it("should not mutate original config", () => {
      const original: DSConfig = { ...validConfig, components: [] };
      addInstalledComponent(original, {
        name: "button",
        version: "1.0.0",
        mode: "package",
      });

      expect(original.components).toHaveLength(0);
    });
  });

  describe("isComponentInstalled", () => {
    it("should return false when component not installed", () => {
      expect(isComponentInstalled(validConfig, "button")).toBe(false);
    });

    it("should return true when component is installed", () => {
      const configWithComponent: DSConfig = {
        ...validConfig,
        components: [
          {
            name: "button",
            version: "1.0.0",
            installedAt: "2026-01-01T00:00:00Z",
            mode: "package",
          },
        ],
      };

      expect(isComponentInstalled(configWithComponent, "button")).toBe(true);
    });
  });

  describe("getInstalledComponent", () => {
    it("should return undefined when component not found", () => {
      expect(getInstalledComponent(validConfig, "button")).toBeUndefined();
    });

    it("should return component when found", () => {
      const configWithComponent: DSConfig = {
        ...validConfig,
        components: [
          {
            name: "button",
            version: "1.0.0",
            installedAt: "2026-01-01T00:00:00Z",
            mode: "package",
          },
        ],
      };

      const component = getInstalledComponent(configWithComponent, "button");
      expect(component?.name).toBe("button");
      expect(component?.version).toBe("1.0.0");
    });
  });
});
