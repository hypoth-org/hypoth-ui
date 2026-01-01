import type { ParsedContent } from "../content/frontmatter.js";
import type { EditionConfig } from "../filter/edition-filter.js";
import {
  isComponentVisibleForEdition,
  isContentVisibleForEdition,
} from "../filter/edition-filter.js";
import type { ComponentManifest } from "../manifest/loader.js";

/**
 * Navigation item in the tree
 */
export interface NavItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** URL path */
  href: string;
  /** Item type */
  type: "component" | "guide" | "category";
  /** Sort order */
  order: number;
  /** Component status (for component items) */
  status?: "alpha" | "beta" | "stable" | "deprecated";
  /** Child items (for categories) */
  children?: NavItem[];
}

/**
 * Navigation tree structure
 */
export interface NavigationTree {
  /** Component navigation items grouped by category */
  components: NavItem[];
  /** Guide navigation items grouped by category */
  guides: NavItem[];
}

/**
 * Options for generating navigation
 */
export interface GenerateNavigationOptions {
  /** Component manifests */
  manifests: ComponentManifest[];
  /** Parsed content with frontmatter */
  contents: Array<{ path: string; parsed: ParsedContent }>;
  /** Edition config for filtering */
  edition: EditionConfig;
  /** Base path for component URLs */
  componentBasePath?: string;
  /** Base path for guide URLs */
  guideBasePath?: string;
}

/**
 * Format category ID as display label
 */
function formatCategoryLabel(categoryId: string): string {
  return categoryId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Generate navigation tree from manifests and content
 */
export function generateNavigation(options: GenerateNavigationOptions): NavigationTree {
  const {
    manifests,
    contents,
    edition,
    componentBasePath = "/components",
    guideBasePath = "/guides",
  } = options;

  // Filter and map components
  const componentItems: NavItem[] = [];
  const categoryOrder = new Map<string, number>();
  let categoryIndex = 0;

  for (const manifest of manifests) {
    if (!isComponentVisibleForEdition(manifest, edition)) {
      continue;
    }

    // Track category order
    if (!categoryOrder.has(manifest.category)) {
      categoryOrder.set(manifest.category, categoryIndex++);
    }

    componentItems.push({
      id: manifest.id,
      label: manifest.name,
      href: `${componentBasePath}/${manifest.id}`,
      type: "component",
      order: 0,
      status: manifest.status,
    });
  }

  // Group components by category
  const componentsByCategory = new Map<string, NavItem[]>();
  for (const manifest of manifests) {
    if (!isComponentVisibleForEdition(manifest, edition)) {
      continue;
    }

    const category = manifest.category;
    const existing = componentsByCategory.get(category) ?? [];
    existing.push({
      id: manifest.id,
      label: manifest.name,
      href: `${componentBasePath}/${manifest.id}`,
      type: "component",
      order: 0,
      status: manifest.status,
    });
    componentsByCategory.set(category, existing);
  }

  // Build component navigation
  const components: NavItem[] = [];
  for (const [category, items] of componentsByCategory) {
    components.push({
      id: category,
      label: formatCategoryLabel(category),
      href: "",
      type: "category",
      order: categoryOrder.get(category) ?? 999,
      children: items.sort((a, b) => a.label.localeCompare(b.label)),
    });
  }

  // Filter and map guides
  const guidesByCategory = new Map<string, NavItem[]>();

  for (const { path, parsed } of contents) {
    const { frontmatter } = parsed;

    // Skip if not visible for edition
    if (!isContentVisibleForEdition(frontmatter, edition)) {
      continue;
    }

    // Skip component pages (they're in the components section)
    if (frontmatter.componentId) {
      continue;
    }

    const category = frontmatter.category ?? "general";
    const id =
      path
        .replace(/\.mdx?$/, "")
        .split("/")
        .pop() ?? path;

    const item: NavItem = {
      id,
      label: frontmatter.title,
      href: `${guideBasePath}/${id}`,
      type: "guide",
      order: frontmatter.order ?? 999,
    };

    const existing = guidesByCategory.get(category) ?? [];
    existing.push(item);
    guidesByCategory.set(category, existing);
  }

  // Build guide navigation
  const guides: NavItem[] = [];
  let guideIndex = 0;
  for (const [category, items] of guidesByCategory) {
    guides.push({
      id: category,
      label: formatCategoryLabel(category),
      href: "",
      type: "category",
      order: guideIndex++,
      children: items.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label)),
    });
  }

  return {
    components: components.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label)),
    guides: guides.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label)),
  };
}

/**
 * Flatten navigation tree to a list of items
 */
export function flattenNavigation(tree: NavigationTree): NavItem[] {
  const items: NavItem[] = [];

  function flatten(navItems: NavItem[]) {
    for (const item of navItems) {
      items.push(item);
      if (item.children) {
        flatten(item.children);
      }
    }
  }

  flatten(tree.components);
  flatten(tree.guides);

  return items;
}

/**
 * Find a navigation item by href
 */
export function findNavItemByHref(tree: NavigationTree, href: string): NavItem | null {
  const items = flattenNavigation(tree);
  return items.find((item) => item.href === href) ?? null;
}

/**
 * Get breadcrumb path for a navigation item
 */
export function getBreadcrumbs(tree: NavigationTree, href: string): NavItem[] {
  const breadcrumbs: NavItem[] = [];

  function findPath(items: NavItem[], parent?: NavItem): boolean {
    for (const item of items) {
      if (item.href === href) {
        if (parent) {
          breadcrumbs.push(parent);
        }
        breadcrumbs.push(item);
        return true;
      }
      if (item.children) {
        if (findPath(item.children, item)) {
          if (parent) {
            breadcrumbs.unshift(parent);
          }
          return true;
        }
      }
    }
    return false;
  }

  findPath([...tree.components, ...tree.guides]);
  return breadcrumbs;
}
