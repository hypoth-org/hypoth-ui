/**
 * Search Index Generator
 *
 * Generates a search index from content packs at build time.
 * The index can be used by client-side search or backend search APIs.
 */

import { readFile } from "node:fs/promises";
import { parseFrontmatter } from "../content/frontmatter.js";
import { resolveAllContent } from "../content/overlay.js";
import { isContentAvailableForEditionTier } from "../filter/edition-filter.js";
import type {
  ContentPack,
  ContractManifest,
  Edition,
  SearchEntry,
  SearchIndex,
} from "../types/manifest.js";

/**
 * Options for generating search index
 */
export interface GenerateSearchIndexOptions {
  /** Content packs to index */
  packs: ContentPack[];
  /** Current edition for filtering (only index available content) */
  edition?: Edition;
  /** Base URL for search result links */
  baseUrl?: string;
  /** Whether to include component docs */
  includeComponents?: boolean;
  /** Whether to include guides */
  includeGuides?: boolean;
  /** Component manifests for enriching entries */
  manifests?: ContractManifest[];
}

/**
 * Extract text content from MDX, removing frontmatter and code blocks
 */
function extractTextFromMdx(content: string): string {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n*/m, "");

  // Remove code blocks
  const withoutCodeBlocks = withoutFrontmatter.replace(/```[\s\S]*?```/g, "");

  // Remove inline code
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]+`/g, "");

  // Remove HTML comments
  const withoutComments = withoutInlineCode.replace(/<!--[\s\S]*?-->/g, "");

  // Remove markdown links, keep text
  const withoutLinks = withoutComments.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove headers' # symbols
  const withoutHeaderSymbols = withoutLinks.replace(/^#+\s+/gm, "");

  // Remove extra whitespace
  return withoutHeaderSymbols.replace(/\s+/g, " ").trim();
}

/**
 * Generate a excerpt from text content
 */
function generateExcerpt(text: string, maxLength = 200): string {
  if (text.length <= maxLength) {
    return text;
  }
  // Find a natural break point
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > maxLength * 0.7) {
    return `${truncated.slice(0, lastSpace)}...`;
  }
  return `${truncated}...`;
}

/**
 * Extract keywords from text
 */
function extractKeywords(text: string): string[] {
  // Simple keyword extraction: split by whitespace, filter short/common words
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "to",
    "of",
    "in",
    "for",
    "on",
    "with",
    "at",
    "by",
    "from",
    "as",
    "this",
    "that",
    "these",
    "those",
    "it",
    "its",
    "you",
    "your",
    "we",
    "our",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  // Count word frequency and return top keywords
  const frequency = new Map<string, number>();
  for (const word of words) {
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  }

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Generate search index from content packs
 */
export async function generateSearchIndex(
  options: GenerateSearchIndexOptions
): Promise<SearchIndex> {
  const {
    packs,
    edition = "enterprise",
    baseUrl = "",
    includeComponents = true,
    includeGuides = true,
    manifests = [],
  } = options;

  const entries: SearchEntry[] = [];
  const manifestMap = new Map(manifests.map((m) => [m.id, m]));

  // Index component docs
  if (includeComponents) {
    const componentContent = await resolveAllContent("components", /\.mdx?$/, {
      packs,
    });

    for (const resolved of componentContent) {
      try {
        const content = await readFile(resolved.resolvedPath, "utf-8");
        const parsed = parseFrontmatter(content);
        const frontmatter = parsed.frontmatter;

        // Check edition filtering
        if (frontmatter.editions) {
          const editions = frontmatter.editions as Edition[];
          if (!isContentAvailableForEditionTier(editions, edition)) {
            continue;
          }
        }

        const id = resolved.requestedPath.replace(/^components\//, "").replace(/\.mdx?$/, "");

        const textContent = extractTextFromMdx(content);
        const manifest = manifestMap.get(id);

        entries.push({
          id: `component-${id}`,
          type: "component",
          title: (frontmatter.title as string) ?? manifest?.name ?? id,
          description: (frontmatter.description as string) ?? manifest?.description ?? "",
          excerpt: generateExcerpt(textContent),
          url: `${baseUrl}/components/${id}`,
          tags: extractKeywords(textContent),
          category: (frontmatter.category as string) ?? "components",
          status: manifest?.status,
        });
      } catch {
        // Skip files that can't be processed
      }
    }
  }

  // Index guides
  if (includeGuides) {
    const guideContent = await resolveAllContent("guides", /\.mdx?$/, { packs });

    for (const resolved of guideContent) {
      try {
        const content = await readFile(resolved.resolvedPath, "utf-8");
        const parsed = parseFrontmatter(content);
        const frontmatter = parsed.frontmatter;

        // Check edition filtering
        if (frontmatter.editions) {
          const editions = frontmatter.editions as Edition[];
          if (!isContentAvailableForEditionTier(editions, edition)) {
            continue;
          }
        }

        const id = resolved.requestedPath.replace(/^guides\//, "").replace(/\.mdx?$/, "");

        const textContent = extractTextFromMdx(content);

        entries.push({
          id: `guide-${id}`,
          type: "guide",
          title: (frontmatter.title as string) ?? id,
          description: (frontmatter.description as string) ?? "",
          excerpt: generateExcerpt(textContent),
          url: `${baseUrl}/guides/${id}`,
          tags: extractKeywords(textContent),
          category: (frontmatter.category as string) ?? "guides",
        });
      } catch {
        // Skip files that can't be processed
      }
    }
  }

  // Extract facets from entries
  const categories = [...new Set(entries.map((e) => e.category).filter(Boolean))];
  const types = [...new Set(entries.map((e) => e.type))] as Array<"component" | "guide">;
  const tags = [...new Set(entries.flatMap((e) => e.tags))];

  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    edition,
    entries,
    facets: {
      categories,
      types,
      tags,
    },
  };
}

/**
 * Serialize search index to JSON
 */
export function serializeSearchIndex(index: SearchIndex): string {
  return JSON.stringify(index, null, 2);
}

/**
 * Create a minimal search index (without full excerpt, for smaller bundle)
 */
export function createMinimalSearchIndex(index: SearchIndex): SearchIndex {
  return {
    ...index,
    entries: index.entries.map((entry) => ({
      ...entry,
      excerpt: "", // Remove excerpt for smaller size
    })),
  };
}
