import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const distPath = join(__dirname, "../dist");
const cssPath = join(distPath, "index.css");

describe("CSS Layers", () => {
  it("should generate index.css file", () => {
    expect(existsSync(cssPath)).toBe(true);
  });

  describe("Layer Declaration", () => {
    it("should declare layers in correct order", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toMatch(/@layer\s+reset.*tokens.*base.*components.*utilities.*overrides/);
    });
  });

  describe("Reset Layer", () => {
    it("should contain box-sizing reset", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("box-sizing:border-box");
    });

    it("should contain margin reset", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("margin:0");
    });

    it("should contain prefers-reduced-motion styles", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("prefers-reduced-motion");
    });
  });

  describe("Base Layer", () => {
    it("should contain html styles with design tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--ds-color-background");
      expect(css).toContain("--ds-font-family");
    });

    it("should contain heading styles", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("h1{");
      expect(css).toContain("h2{");
      expect(css).toContain("--ds-font-size");
    });

    it("should contain focus-visible styles", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain(":focus-visible");
      expect(css).toContain("--ds-color-focus-ring");
    });
  });

  describe("Utilities Layer", () => {
    it("should contain screen reader utility", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain(".sr-only");
    });

    it("should contain text alignment utilities", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain(".text-left");
      expect(css).toContain(".text-center");
      expect(css).toContain(".text-right");
    });

    it("should contain flex utilities", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain(".flex{");
      expect(css).toContain(".flex-col");
      expect(css).toContain(".items-center");
      expect(css).toContain(".justify-center");
    });

    it("should contain gap utilities with design tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain(".gap-xs");
      expect(css).toContain(".gap-sm");
      expect(css).toContain(".gap-md");
      expect(css).toContain("--ds-spacing-component-gap");
    });

    it("should contain container utility", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain(".container");
      expect(css).toContain("--ds-spacing-layout-container");
    });

    it("should contain stack utilities", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain(".stack-sm");
      expect(css).toContain(".stack-md");
      expect(css).toContain(".stack-lg");
    });
  });
});

describe("Token Integration", () => {
  it("should use CSS custom properties from tokens", () => {
    const css = readFileSync(cssPath, "utf-8");

    // Should use token variables, not hardcoded values
    const tokenUsageCount = (css.match(/var\(--ds-/g) || []).length;
    expect(tokenUsageCount).toBeGreaterThan(20);
  });

  it("should not contain hardcoded color values in utilities", () => {
    const css = readFileSync(cssPath, "utf-8");

    // Extract utilities layer content
    const utilitiesMatch = css.match(/@layer utilities\{(.+?)\}/);
    if (utilitiesMatch) {
      const utilities = utilitiesMatch[1];
      // Should not have hardcoded hex colors
      expect(utilities).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    }
  });
});
