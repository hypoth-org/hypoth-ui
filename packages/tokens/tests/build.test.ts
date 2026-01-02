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

    it("should contain @layer tokens declaration", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("@layer tokens");
    });

    it("should contain :root selector with CSS variables", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain(":root {");
      expect(css).toContain("--color-primary");
    });

    it("should contain color tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--color-primary");
      expect(css).toContain("--color-secondary");
      expect(css).toContain("--color-background-surface");
      expect(css).toContain("--color-text-primary");
      expect(css).toContain("--color-error");
      expect(css).toContain("--color-success");
    });

    it("should contain spacing tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--spacing-xs");
      expect(css).toContain("--spacing-sm");
      expect(css).toContain("--spacing-md");
      expect(css).toContain("--spacing-lg");
      expect(css).toContain("--spacing-xl");
    });

    it("should contain typography tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--typography-body");
      expect(css).toContain("--typography-heading-h1");
      expect(css).toContain("--typography-label");
    });

    it("should contain border tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--border-default");
      expect(css).toContain("--border-focus");
    });

    it("should contain shadow tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--shadow-sm");
      expect(css).toContain("--shadow-md");
      expect(css).toContain("--shadow-lg");
    });

    it("should contain motion tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--motion-duration-fast");
      expect(css).toContain("--motion-duration-normal");
      expect(css).toContain("--motion-easing-ease");
    });

    it("should contain radius tokens", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("--radius-sm");
      expect(css).toContain("--radius-md");
      expect(css).toContain("--radius-full");
    });
  });

  describe("Dark Mode Output", () => {
    const cssPath = join(distPath, "css/tokens.css");

    it("should contain dark mode selector in combined tokens.css", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain('[data-mode="dark"]');
    });

    it("should contain prefers-color-scheme media query", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("@media (prefers-color-scheme: dark)");
    });
  });

  describe("High Contrast Mode Output", () => {
    const cssPath = join(distPath, "css/tokens.css");

    it("should contain high-contrast mode selector", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain('[data-mode="high-contrast"]');
    });

    it("should contain prefers-contrast media query", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("@media (prefers-contrast: more)");
    });
  });

  describe("Reduced Motion Mode Output", () => {
    const cssPath = join(distPath, "css/tokens.css");

    it("should contain reduced-motion mode selector", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain('[data-mode="reduced-motion"]');
    });

    it("should contain prefers-reduced-motion media query", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    });
  });

  describe("Brand Output", () => {
    const cssPath = join(distPath, "css/tokens.css");

    it("should contain brand selectors", () => {
      const css = readFileSync(cssPath, "utf-8");
      expect(css).toContain('[data-brand="default"]');
      expect(css).toContain('[data-brand="acme"]');
    });
  });

  describe("TypeScript Output", () => {
    const tsPath = join(distPath, "ts/index.ts");

    it("should generate index.ts file", () => {
      expect(existsSync(tsPath)).toBe(true);
    });

    it("should export token path types", () => {
      const ts = readFileSync(tsPath, "utf-8");
      expect(ts).toContain("export type ColorTokenPath");
      expect(ts).toContain("export type SpacingTokenPath");
      expect(ts).toContain("export type TypographyTokenPath");
    });

    it("should export combined TokenPath type", () => {
      const ts = readFileSync(tsPath, "utf-8");
      expect(ts).toContain("export type TokenPath");
    });

    it("should export TokenCategory type", () => {
      const ts = readFileSync(tsPath, "utf-8");
      expect(ts).toContain("export type TokenCategory");
    });

    it("should export tokenVar helper function", () => {
      const ts = readFileSync(tsPath, "utf-8");
      expect(ts).toContain("export function tokenVar");
    });

    it("should export tokenVarWithFallback helper function", () => {
      const ts = readFileSync(tsPath, "utf-8");
      expect(ts).toContain("export function tokenVarWithFallback");
    });

    it("should contain token paths as union members", () => {
      const ts = readFileSync(tsPath, "utf-8");
      expect(ts).toContain("'color.primary'");
      expect(ts).toContain("'color.background.surface'");
      expect(ts).toContain("'spacing.md'");
      expect(ts).toContain("'typography.body'");
    });
  });

  describe("JSON Output", () => {
    const jsonPath = join(distPath, "json/tokens.json");

    it("should generate tokens.json file", () => {
      expect(existsSync(jsonPath)).toBe(true);
    });

    it("should contain valid JSON structure", () => {
      const json = readFileSync(jsonPath, "utf-8");
      const parsed = JSON.parse(json);
      expect(parsed).toHaveProperty("$schema");
      expect(parsed).toHaveProperty("version");
      expect(parsed).toHaveProperty("generatedAt");
      expect(parsed).toHaveProperty("categories");
    });

    it("should contain token categories", () => {
      const json = readFileSync(jsonPath, "utf-8");
      const parsed = JSON.parse(json);
      expect(parsed.categories).toHaveProperty("color");
      expect(parsed.categories).toHaveProperty("spacing");
      expect(parsed.categories).toHaveProperty("typography");
    });
  });

  describe("Runtime Output", () => {
    const runtimePath = join(distPath, "ts/runtime/index.ts");

    it("should generate runtime/index.ts file", () => {
      expect(existsSync(runtimePath)).toBe(true);
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

    // Spacing should use rem units
    expect(css).toMatch(/--spacing-\w+:\s*[\d.]+rem/);
  });

  it("should have valid radius values", () => {
    const cssPath = join(distPath, "css/tokens.css");
    const css = readFileSync(cssPath, "utf-8");

    // Radius tokens should have values
    expect(css).toMatch(/--radius-\w+:\s*[\d.]+/);
  });

  it("should have valid shadow values", () => {
    const cssPath = join(distPath, "css/tokens.css");
    const css = readFileSync(cssPath, "utf-8");

    // Shadow tokens should have rgba or offset values
    expect(css).toMatch(/--shadow-\w+:\s*0/);
  });

  it("should have valid motion duration values", () => {
    const cssPath = join(distPath, "css/tokens.css");
    const css = readFileSync(cssPath, "utf-8");

    // Motion durations should use ms units
    expect(css).toMatch(/--motion-duration-\w+:\s*\d+ms/);
  });
});
