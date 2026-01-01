import { describe, expect, it } from "vitest";
import type { ParsedContent } from "../src/content/frontmatter";
import { createDefaultEdition, createEnterpriseEdition } from "../src/filter/edition-filter";
import type { ComponentManifest } from "../src/manifest/loader";
import {
  findNavItemByHref,
  flattenNavigation,
  generateNavigation,
  getBreadcrumbs,
} from "../src/nav/navigation";

describe("Navigation", () => {
  const defaultEdition = createDefaultEdition();
  const enterpriseEdition = createEnterpriseEdition();

  const manifests: ComponentManifest[] = [
    {
      id: "button",
      name: "Button",
      description: "A button",
      category: "forms",
      status: "stable",
      availabilityTags: ["public"],
      props: [],
      slots: [],
      events: [],
      cssParts: [],
      cssProperties: [],
    },
    {
      id: "input",
      name: "Input",
      description: "An input",
      category: "forms",
      status: "stable",
      availabilityTags: ["public"],
      props: [],
      slots: [],
      events: [],
      cssParts: [],
      cssProperties: [],
    },
    {
      id: "card",
      name: "Card",
      description: "A card",
      category: "layout",
      status: "beta",
      availabilityTags: ["public"],
      props: [],
      slots: [],
      events: [],
      cssParts: [],
      cssProperties: [],
    },
    {
      id: "data-grid",
      name: "Data Grid",
      description: "Enterprise data grid",
      category: "data-viz",
      status: "stable",
      availabilityTags: ["enterprise"],
      props: [],
      slots: [],
      events: [],
      cssParts: [],
      cssProperties: [],
    },
  ];

  const contents: Array<{ path: string; parsed: ParsedContent }> = [
    {
      path: "guides/getting-started.mdx",
      parsed: {
        frontmatter: {
          title: "Getting Started",
          category: "getting-started",
          order: 1,
        },
        content: "# Getting Started",
      },
    },
    {
      path: "guides/theming.mdx",
      parsed: {
        frontmatter: {
          title: "Theming",
          category: "customization",
          order: 1,
        },
        content: "# Theming",
      },
    },
    {
      path: "guides/enterprise-features.mdx",
      parsed: {
        frontmatter: {
          title: "Enterprise Features",
          category: "enterprise",
          editions: ["enterprise"],
          order: 1,
        },
        content: "# Enterprise",
      },
    },
  ];

  describe("generateNavigation", () => {
    it("should generate navigation tree with components and guides", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      expect(nav.components).toBeDefined();
      expect(nav.guides).toBeDefined();
    });

    it("should group components by category", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const formsCategory = nav.components.find((c) => c.id === "forms");
      expect(formsCategory).toBeDefined();
      expect(formsCategory?.children).toHaveLength(2);
    });

    it("should filter components by edition", () => {
      const defaultNav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const enterpriseNav = generateNavigation({
        manifests,
        contents,
        edition: enterpriseEdition,
      });

      // Default should not have data-viz category
      const defaultDataViz = defaultNav.components.find((c) => c.id === "data-viz");
      expect(defaultDataViz).toBeUndefined();

      // Enterprise should have data-viz category
      const enterpriseDataViz = enterpriseNav.components.find((c) => c.id === "data-viz");
      expect(enterpriseDataViz).toBeDefined();
    });

    it("should filter guides by edition", () => {
      const defaultNav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const enterpriseNav = generateNavigation({
        manifests,
        contents,
        edition: enterpriseEdition,
      });

      // Default should not have enterprise category
      const defaultEnterprise = defaultNav.guides.find((g) => g.id === "enterprise");
      expect(defaultEnterprise).toBeUndefined();

      // Enterprise should have enterprise category
      const enterpriseGuides = enterpriseNav.guides.find((g) => g.id === "enterprise");
      expect(enterpriseGuides).toBeDefined();
    });

    it("should use custom base paths", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
        componentBasePath: "/docs/components",
        guideBasePath: "/docs/guides",
      });

      const formsCategory = nav.components.find((c) => c.id === "forms");
      const buttonItem = formsCategory?.children?.find((c) => c.id === "button");
      expect(buttonItem?.href).toBe("/docs/components/button");
    });

    it("should include component status", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const layoutCategory = nav.components.find((c) => c.id === "layout");
      const cardItem = layoutCategory?.children?.find((c) => c.id === "card");
      expect(cardItem?.status).toBe("beta");
    });

    it("should sort items alphabetically within categories", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const formsCategory = nav.components.find((c) => c.id === "forms");
      const children = formsCategory?.children ?? [];
      expect(children[0].id).toBe("button"); // B before I
      expect(children[1].id).toBe("input");
    });
  });

  describe("flattenNavigation", () => {
    it("should flatten tree to list", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const flattened = flattenNavigation(nav);
      expect(flattened.length).toBeGreaterThan(0);
    });

    it("should include all items including children", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const flattened = flattenNavigation(nav);
      const buttonItem = flattened.find((i) => i.id === "button");
      expect(buttonItem).toBeDefined();
    });
  });

  describe("findNavItemByHref", () => {
    it("should find item by href", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const item = findNavItemByHref(nav, "/components/button");
      expect(item).not.toBeNull();
      expect(item?.id).toBe("button");
    });

    it("should return null for non-existent href", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const item = findNavItemByHref(nav, "/components/non-existent");
      expect(item).toBeNull();
    });
  });

  describe("getBreadcrumbs", () => {
    it("should return breadcrumb path for nested item", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const breadcrumbs = getBreadcrumbs(nav, "/components/button");
      expect(breadcrumbs.length).toBeGreaterThanOrEqual(1);
      expect(breadcrumbs[breadcrumbs.length - 1].id).toBe("button");
    });

    it("should include parent category in breadcrumbs", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const breadcrumbs = getBreadcrumbs(nav, "/components/button");
      const categoryBreadcrumb = breadcrumbs.find((b) => b.id === "forms");
      expect(categoryBreadcrumb).toBeDefined();
    });

    it("should return empty array for non-existent href", () => {
      const nav = generateNavigation({
        manifests,
        contents,
        edition: defaultEdition,
      });

      const breadcrumbs = getBreadcrumbs(nav, "/non-existent");
      expect(breadcrumbs).toHaveLength(0);
    });
  });
});
