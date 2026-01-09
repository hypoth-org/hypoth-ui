/**
 * Search API Route
 *
 * Provides search functionality for the documentation site.
 * Loads the pre-built search index and performs client-side filtering.
 */

import { type NextRequest, NextResponse } from "next/server";
import type { SearchEntry, SearchIndex } from "@ds/docs-core";

// Cache the search index in memory
let searchIndex: SearchIndex | null = null;
let indexLoadPromise: Promise<SearchIndex | null> | null = null;

/**
 * Load the search index from the file system or CDN
 */
async function loadSearchIndex(): Promise<SearchIndex | null> {
  if (searchIndex) {
    return searchIndex;
  }

  if (indexLoadPromise) {
    return indexLoadPromise;
  }

  indexLoadPromise = (async () => {
    try {
      // In production, this would load from a CDN or static file
      // For now, we'll use a bundled index or return mock data
      const indexPath = process.env.SEARCH_INDEX_PATH || "./dist/search-index.json";

      // Try to load from file system in development
      if (process.env.NODE_ENV === "development") {
        const fs = await import("node:fs/promises");
        const path = await import("node:path");
        const fullPath = path.join(process.cwd(), indexPath);

        try {
          const content = await fs.readFile(fullPath, "utf-8");
          searchIndex = JSON.parse(content) as SearchIndex;
          return searchIndex;
        } catch {
          // Index not found, return empty
          console.warn(`Search index not found at ${fullPath}`);
        }
      }

      // Return a minimal fallback index
      searchIndex = {
        version: "1.0.0",
        generatedAt: new Date().toISOString(),
        edition: "enterprise",
        entries: [],
        facets: {
          categories: [],
          types: [],
          tags: [],
        },
      };

      return searchIndex;
    } catch (error) {
      console.error("Failed to load search index:", error);
      return null;
    }
  })();

  return indexLoadPromise;
}

/**
 * Search entries by query
 */
function searchEntries(
  entries: SearchEntry[],
  query: string,
  options: {
    type?: "component" | "guide";
    category?: string;
    limit?: number;
  } = {}
): SearchEntry[] {
  const { type, category, limit = 20 } = options;
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [];
  }

  // Filter and score entries
  const scored = entries
    .filter((entry) => {
      // Apply type filter
      if (type && entry.type !== type) {
        return false;
      }

      // Apply category filter
      if (category && entry.category !== category) {
        return false;
      }

      return true;
    })
    .map((entry) => {
      let score = 0;

      // Title match (highest weight)
      const titleLower = entry.title.toLowerCase();
      if (titleLower === normalizedQuery) {
        score += 100;
      } else if (titleLower.startsWith(normalizedQuery)) {
        score += 50;
      } else if (titleLower.includes(normalizedQuery)) {
        score += 25;
      }

      // Description match
      const descLower = entry.description?.toLowerCase() || "";
      if (descLower.includes(normalizedQuery)) {
        score += 15;
      }

      // Excerpt match
      const excerptLower = entry.excerpt?.toLowerCase() || "";
      if (excerptLower.includes(normalizedQuery)) {
        score += 10;
      }

      // Tag match
      const tagMatch = entry.tags?.some(
        (tag) => tag.toLowerCase().includes(normalizedQuery) || normalizedQuery.includes(tag.toLowerCase())
      );
      if (tagMatch) {
        score += 20;
      }

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);

  return scored;
}

/**
 * GET /api/search
 *
 * Query parameters:
 * - q: Search query (required)
 * - type: Filter by type (component | guide)
 * - category: Filter by category
 * - limit: Maximum results (default: 20)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") as "component" | "guide" | null;
  const category = searchParams.get("category");
  const limit = Number.parseInt(searchParams.get("limit") || "20", 10);

  if (!query.trim()) {
    return NextResponse.json({
      results: [],
      query: "",
      total: 0,
    });
  }

  const index = await loadSearchIndex();

  if (!index) {
    return NextResponse.json(
      { error: "Search index not available" },
      { status: 503 }
    );
  }

  const results = searchEntries(index.entries, query, {
    type: type || undefined,
    category: category || undefined,
    limit,
  });

  return NextResponse.json({
    results,
    query,
    total: results.length,
    facets: index.facets,
  });
}

/**
 * POST /api/search
 *
 * Alternative endpoint for more complex queries
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query = "", type, category, limit = 20 } = body;

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        query: "",
        total: 0,
      });
    }

    const index = await loadSearchIndex();

    if (!index) {
      return NextResponse.json(
        { error: "Search index not available" },
        { status: 503 }
      );
    }

    const results = searchEntries(index.entries, query, {
      type,
      category,
      limit,
    });

    return NextResponse.json({
      results,
      query,
      total: results.length,
      facets: index.facets,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
