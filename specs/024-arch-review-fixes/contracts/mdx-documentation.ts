/**
 * MDX Documentation Contract
 *
 * Defines the schema for component MDX documentation files.
 * Used by the docs site to render component documentation.
 */

/**
 * Component status in the release lifecycle.
 */
export type ComponentStatus = "alpha" | "beta" | "stable";

/**
 * Category for organizing components in documentation navigation.
 */
export type ComponentCategory =
  | "actions"
  | "forms"
  | "feedback"
  | "layout"
  | "navigation"
  | "overlays"
  | "data-display"
  | "utilities";

/**
 * MDX frontmatter schema.
 * Parsed by gray-matter from the YAML block at the start of .mdx files.
 */
export interface MDXFrontmatter {
  /**
   * Display title for the component.
   * Used in page title, navigation, and search.
   */
  title: string;

  /**
   * One-line description for meta tags and listings.
   * Should be under 160 characters for SEO.
   */
  description: string;

  /**
   * Component identifier matching the CLI registry name.
   * Used to link documentation to component metadata.
   */
  component: string;

  /**
   * Release status of the component.
   * Affects badges and warnings shown in documentation.
   */
  status: ComponentStatus;

  /**
   * Category for navigation grouping.
   */
  category: ComponentCategory;

  /**
   * Sort order within the category.
   * Lower numbers appear first.
   */
  order: number;
}

/**
 * Required sections in component MDX documentation.
 */
export interface MDXSections {
  /**
   * Main heading (H1) - Must match frontmatter title.
   */
  title: string;

  /**
   * Introduction paragraph describing the component purpose.
   */
  introduction: string;

  /**
   * Usage section with code examples.
   * MUST include both WC and React examples.
   */
  usage: {
    wc: string; // HTML example
    react: string; // TSX example
  };

  /**
   * Props/Attributes table.
   * Column format: Prop | Type | Default | Description
   */
  props: Array<{
    name: string;
    type: string;
    default: string;
    description: string;
  }>;

  /**
   * Accessibility section.
   * MUST document keyboard interactions and ARIA patterns.
   */
  accessibility: {
    keyboard: string[];
    aria: string[];
    screenReader?: string;
  };

  /**
   * Best practices with Do/Don't guidance.
   */
  bestPractices: {
    do: string[];
    dont: string[];
  };
}

/**
 * Contract: Every component MUST have MDX documentation.
 *
 * Requirements:
 * 1. Every component in CLI registry MUST have corresponding .mdx file
 * 2. MDX file MUST have valid frontmatter matching schema
 * 3. MDX file MUST include all required sections
 * 4. Props table MUST document all public props/attributes
 * 5. Accessibility section MUST pull from WC manifest when available
 */
export const MDX_DOCUMENTATION_CONTRACT = {
  location: "packages/docs-content/components/",
  filePattern: "[component-name].mdx",
  frontmatterRequired: ["title", "description", "component", "status", "category", "order"],
  sectionsRequired: ["Usage", "Props", "Accessibility", "Best Practices"],
} as const;
