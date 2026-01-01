import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const distPath = join(__dirname, "../dist");

describe("Token Build", () => {
  describe("CSS Output", () => {
    const cssPath = join(distPath, "css/tokens.css");

    it("should generate tokens.css file", () => {
      expect(existsSync(cssPath)).toBe(true);
    });

    it("should contain :root selector with CSS variables", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain(":root {");
      expect(css).toContain("--ds-");
    });

    it("should contain primitive color tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--ds-color-primitives-gray-500");
      expect(css).toContain("--ds-color-primitives-blue-500");
      expect(css).toContain("--ds-color-primitives-red-500");
      expect(css).toContain("--ds-color-primitives-green-500");
    });

    it("should contain spacing tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--ds-spacing-primitives-1");
      expect(css).toContain("--ds-spacing-primitives-2");
      expect(css).toContain("--ds-spacing-primitives-4");
      expect(css).toContain("--ds-spacing-primitives-8");
      expect(css).toContain("--ds-spacing-primitives-16");
    });

    it("should contain typography tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--ds-font-family");
      expect(css).toContain("--ds-font-size");
      expect(css).toContain("--ds-font-weight");
      expect(css).toContain("--ds-font-lineHeight");
    });

    it("should contain semantic color tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--ds-color-background");
      expect(css).toContain("--ds-color-foreground");
      expect(css).toContain("--ds-color-primary");
      expect(css).toContain("--ds-color-border");
    });
  });

  describe("Dark Mode Output", () => {
    const darkCssPath = join(distPath, "css/dark.css");

    it("should generate dark.css file", () => {
      expect(existsSync(darkCssPath)).toBe(true);
    });

    it("should contain prefers-color-scheme media query", () => {
      const css = readFileSync(darkCssPath, "utf-8");
      expect(css).toContain("@media (prefers-color-scheme: dark)");
    });

    it("should contain data-theme attribute selector", () => {
      const css = readFileSync(darkCssPath, "utf-8");
      expect(css).toContain('[data-theme="dark"]');
    });
  });

  describe("High Contrast Mode Output", () => {
    const highContrastPath = join(distPath, "css/high-contrast.css");

    it("should generate high-contrast.css file", () => {
      expect(existsSync(highContrastPath)).toBe(true);
    });

    it("should contain prefers-contrast media query", () => {
      const css = readFileSync(highContrastPath, "utf-8");
      expect(css).toContain("@media (prefers-contrast: more)");
    });

    it("should contain data-theme attribute selector", () => {
      const css = readFileSync(highContrastPath, "utf-8");
      expect(css).toContain('[data-theme="high-contrast"]');
    });
  });

  describe("TypeScript Output", () => {
    const tsPath = join(distPath, "ts/tokens.ts");

    it("should generate tokens.ts file", () => {
      expect(existsSync(tsPath)).toBe(true);
    });

    it("should export tokens constant", () => {
      const ts = readFileSync(tsPath, "utf-8");
      expect(ts).toContain("export const tokens =");
      expect(ts).toContain("as const");
    });

    it("should export Tokens type", () => {
      const ts = readFileSync(tsPath, "utf-8");
      expect(ts).toContain("export type Tokens = typeof tokens");
    });

    it("should contain token structure", () => {
      const ts = readFileSync(tsPath, "utf-8");
      expect(ts).toContain('"color"');
      expect(ts).toContain('"spacing"');
      expect(ts).toContain('"font"');
    });
  });
});

describe("Token Values", () => {
  it("should have valid hex color values in CSS", () => {
    const cssPath = join(distPath, "css/tokens.css");
    const css = readFileSync(cssPath, "utf-8");

    // Check for valid hex color format
    const hexColorRegex = /#[0-9a-fA-F]{6}\b/g;
    const colors = css.match(hexColorRegex);
    expect(colors).not.toBeNull();
    expect(colors?.length).toBeGreaterThan(0);
  });

  it("should have valid spacing values with units", () => {
    const cssPath = join(distPath, "css/tokens.css");
    const css = readFileSync(cssPath, "utf-8");

    // Spacing should use rem units (primitives use numeric scale)
    expect(css).toMatch(/--ds-spacing-primitives-\d+:\s*[\d.]+rem/);
  });

  it("should have valid font-size values with units", () => {
    const cssPath = join(distPath, "css/tokens.css");
    const css = readFileSync(cssPath, "utf-8");

    // Font sizes should use rem units
    expect(css).toMatch(/--ds-font-size-\w+:\s*[\d.]+rem/);
  });
});
