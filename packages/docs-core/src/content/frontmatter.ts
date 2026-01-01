import { readFile } from "node:fs/promises";
import matter from "gray-matter";

/**
 * Frontmatter data extracted from MDX files
 */
export interface ContentFrontmatter {
  /** Page title */
  title: string;
  /** Brief description for SEO and previews */
  description?: string;
  /** Navigation category */
  category?: string;
  /** Sort order within category */
  order?: number;
  /** Component ID (for component pages) */
  componentId?: string;
  /** Hide from navigation */
  hidden?: boolean;
  /** Edition-specific visibility (empty = all editions) */
  editions?: string[];
}

/**
 * Result of parsing an MDX file
 */
export interface ParsedContent {
  /** Extracted frontmatter */
  frontmatter: ContentFrontmatter;
  /** MDX content without frontmatter */
  content: string;
  /** Raw file content */
  raw: string;
}

/**
 * Parse MDX frontmatter from a string
 */
export function parseFrontmatter(source: string): ParsedContent {
  const { data, content } = matter(source);

  const frontmatter: ContentFrontmatter = {
    title: typeof data.title === "string" ? data.title : "Untitled",
    description: typeof data.description === "string" ? data.description : undefined,
    category: typeof data.category === "string" ? data.category : undefined,
    order: typeof data.order === "number" ? data.order : undefined,
    componentId: typeof data.componentId === "string" ? data.componentId : undefined,
    hidden: typeof data.hidden === "boolean" ? data.hidden : false,
    editions: Array.isArray(data.editions)
      ? data.editions.filter((e): e is string => typeof e === "string")
      : undefined,
  };

  return {
    frontmatter,
    content: content.trim(),
    raw: source,
  };
}

/**
 * Parse MDX frontmatter from a file
 */
export async function parseFrontmatterFromFile(filePath: string): Promise<ParsedContent> {
  const source = await readFile(filePath, "utf-8");
  return parseFrontmatter(source);
}

/**
 * Check if content should be visible for a given edition
 */
export function isVisibleForEdition(frontmatter: ContentFrontmatter, editionId: string): boolean {
  // If no editions specified, visible to all
  if (!frontmatter.editions || frontmatter.editions.length === 0) {
    return true;
  }
  // Otherwise, check if edition is in the list
  return frontmatter.editions.includes(editionId);
}

/**
 * Extract all unique categories from parsed content
 */
export function extractCategories(contents: ParsedContent[]): string[] {
  const categories = new Set<string>();
  for (const { frontmatter } of contents) {
    if (frontmatter.category) {
      categories.add(frontmatter.category);
    }
  }
  return Array.from(categories).sort();
}
