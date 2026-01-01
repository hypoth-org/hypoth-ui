import { describe, expect, it } from "vitest";
import type { ContentFrontmatter } from "../src/content/frontmatter";
import {
  type EditionConfig,
  createDefaultEdition,
  createEnterpriseEdition,
  filterComponentsForEdition,
  getEffectiveContentPath,
  isComponentVisibleForEdition,
  isContentVisibleForEdition,
  mergeEditionConfigs,
} from "../src/filter/edition-filter";
import type { ComponentManifest } from "../src/manifest/loader";

describe("Edition Filter", () => {
  const defaultEdition = createDefaultEdition();
  const enterpriseEdition = createEnterpriseEdition();

  const publicComponent: ComponentManifest = {
    id: "button",
    name: "Button",
    description: "A button component",
    category: "forms",
    status: "stable",
    availabilityTags: ["public"],
    props: [],
    slots: [],
    events: [],
    cssParts: [],
    cssProperties: [],
  };

  const enterpriseComponent: ComponentManifest = {
    id: "advanced-chart",
    name: "Advanced Chart",
    description: "An enterprise chart component",
    category: "data-viz",
    status: "stable",
    availabilityTags: ["enterprise"],
    props: [],
    slots: [],
    events: [],
    cssParts: [],
    cssProperties: [],
  };

  const internalComponent: ComponentManifest = {
    id: "debug-panel",
    name: "Debug Panel",
    description: "Internal debugging component",
    category: "dev-tools",
    status: "alpha",
    availabilityTags: ["internal-only"],
    props: [],
    slots: [],
    events: [],
    cssParts: [],
    cssProperties: [],
  };

  describe("isComponentVisibleForEdition", () => {
    it("should show public components in default edition", () => {
      expect(isComponentVisibleForEdition(publicComponent, defaultEdition)).toBe(true);
    });

    it("should hide enterprise components in default edition", () => {
      expect(isComponentVisibleForEdition(enterpriseComponent, defaultEdition)).toBe(false);
    });

    it("should show enterprise components in enterprise edition", () => {
      expect(isComponentVisibleForEdition(enterpriseComponent, enterpriseEdition)).toBe(true);
    });

    it("should show public components in enterprise edition", () => {
      expect(isComponentVisibleForEdition(publicComponent, enterpriseEdition)).toBe(true);
    });

    it("should hide internal components in all standard editions", () => {
      expect(isComponentVisibleForEdition(internalComponent, defaultEdition)).toBe(false);
      expect(isComponentVisibleForEdition(internalComponent, enterpriseEdition)).toBe(false);
    });

    it("should hide explicitly excluded components", () => {
      const editionWithExclusions: EditionConfig = {
        ...defaultEdition,
        excludeComponents: ["button"],
      };
      expect(isComponentVisibleForEdition(publicComponent, editionWithExclusions)).toBe(false);
    });
  });

  describe("filterComponentsForEdition", () => {
    const allComponents = [publicComponent, enterpriseComponent, internalComponent];

    it("should filter to only public components for default edition", () => {
      const filtered = filterComponentsForEdition(allComponents, defaultEdition);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe("button");
    });

    it("should filter to public and enterprise components for enterprise edition", () => {
      const filtered = filterComponentsForEdition(allComponents, enterpriseEdition);
      expect(filtered).toHaveLength(2);
      expect(filtered.map((c) => c.id)).toContain("button");
      expect(filtered.map((c) => c.id)).toContain("advanced-chart");
    });

    it("should return empty array when no components match", () => {
      const internalOnlyEdition: EditionConfig = {
        ...defaultEdition,
        availabilityFilter: [],
      };
      const filtered = filterComponentsForEdition(allComponents, internalOnlyEdition);
      expect(filtered).toHaveLength(0);
    });
  });

  describe("isContentVisibleForEdition", () => {
    it("should show content without restrictions", () => {
      const frontmatter: ContentFrontmatter = {
        title: "Getting Started",
      };
      expect(isContentVisibleForEdition(frontmatter, defaultEdition)).toBe(true);
    });

    it("should hide content marked as hidden", () => {
      const frontmatter: ContentFrontmatter = {
        title: "Hidden Page",
        hidden: true,
      };
      expect(isContentVisibleForEdition(frontmatter, defaultEdition)).toBe(false);
    });

    it("should show content when edition is in editions list", () => {
      const frontmatter: ContentFrontmatter = {
        title: "Enterprise Guide",
        editions: ["enterprise"],
      };
      expect(isContentVisibleForEdition(frontmatter, enterpriseEdition)).toBe(true);
    });

    it("should hide content when edition is not in editions list", () => {
      const frontmatter: ContentFrontmatter = {
        title: "Enterprise Guide",
        editions: ["enterprise"],
      };
      expect(isContentVisibleForEdition(frontmatter, defaultEdition)).toBe(false);
    });
  });

  describe("getEffectiveContentPath", () => {
    it("should return original path when no overlay exists", () => {
      const path = getEffectiveContentPath("/guides/getting-started.mdx", defaultEdition);
      expect(path).toBe("/guides/getting-started.mdx");
    });

    it("should return overlay path when configured", () => {
      const editionWithOverlay: EditionConfig = {
        ...defaultEdition,
        contentOverlays: {
          "/guides/getting-started.mdx": "/guides/enterprise-getting-started.mdx",
        },
      };
      const path = getEffectiveContentPath("/guides/getting-started.mdx", editionWithOverlay);
      expect(path).toBe("/guides/enterprise-getting-started.mdx");
    });
  });

  describe("createDefaultEdition", () => {
    it("should create edition with default values", () => {
      const edition = createDefaultEdition();
      expect(edition.id).toBe("default");
      expect(edition.name).toBe("Default");
      expect(edition.availabilityFilter).toContain("public");
      expect(edition.excludeComponents).toEqual([]);
    });

    it("should allow overrides", () => {
      const edition = createDefaultEdition({ name: "Custom Default" });
      expect(edition.id).toBe("default");
      expect(edition.name).toBe("Custom Default");
    });
  });

  describe("createEnterpriseEdition", () => {
    it("should create edition with enterprise values", () => {
      const edition = createEnterpriseEdition();
      expect(edition.id).toBe("enterprise");
      expect(edition.availabilityFilter).toContain("public");
      expect(edition.availabilityFilter).toContain("enterprise");
    });
  });

  describe("mergeEditionConfigs", () => {
    it("should merge configs with overrides taking precedence", () => {
      const merged = mergeEditionConfigs(defaultEdition, { name: "Custom Name" });
      expect(merged.id).toBe("default");
      expect(merged.name).toBe("Custom Name");
    });

    it("should deep merge branding", () => {
      const merged = mergeEditionConfigs(defaultEdition, {
        branding: { primaryColor: "#ff0000" },
      });
      expect(merged.branding.logoUrl).toBe("/logo.svg"); // preserved
      expect(merged.branding.primaryColor).toBe("#ff0000"); // overridden
    });

    it("should deep merge features", () => {
      const merged = mergeEditionConfigs(defaultEdition, {
        features: { showSourceLinks: false },
      });
      expect(merged.features?.enableSearch).toBe(true); // preserved
      expect(merged.features?.showSourceLinks).toBe(false); // overridden
    });
  });
});
