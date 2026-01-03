/**
 * DTCG Token Parser
 * Parses DTCG-format JSON files and extracts tokens
 */

import type { Token, TokenGroup, TokenSet, TokenType, TokenValue } from "../types/dtcg.js";

/** Parsed token with path information */
export interface ParsedToken {
  path: string;
  value: TokenValue;
  type: TokenType | undefined;
  description: string | undefined;
  extensions: Record<string, unknown> | undefined;
}

/** Parser result */
export interface ParseResult {
  tokens: ParsedToken[];
  errors: ParseError[];
}

/** Parser error */
export interface ParseError {
  path: string;
  message: string;
}

/**
 * Check if an object is a DTCG token (has $value property)
 */
function isToken(obj: unknown): obj is Token {
  return typeof obj === "object" && obj !== null && "$value" in obj;
}

/**
 * Check if a key is a DTCG property (starts with $)
 */
function isDTCGProperty(key: string): boolean {
  return key.startsWith("$");
}

/**
 * Parse a DTCG token set and extract all tokens with their paths
 */
export function parseTokenSet(tokenSet: TokenSet, basePath = ""): ParseResult {
  const tokens: ParsedToken[] = [];
  const errors: ParseError[] = [];

  function traverse(
    obj: TokenSet | TokenGroup,
    currentPath: string,
    inheritedType?: TokenType
  ): void {
    // Get inherited type from group if present
    const groupType = (obj.$type as TokenType) ?? inheritedType;

    for (const [key, value] of Object.entries(obj)) {
      // Skip DTCG properties
      if (isDTCGProperty(key)) continue;

      const path = currentPath ? `${currentPath}.${key}` : key;

      if (isToken(value)) {
        // This is a token
        const token: ParsedToken = {
          path,
          value: value.$value,
          type: value.$type ?? groupType,
          description: value.$description,
          extensions: value.$extensions,
        };
        tokens.push(token);
      } else if (typeof value === "object" && value !== null) {
        // This is a group, recurse
        traverse(value as TokenGroup, path, groupType);
      }
    }
  }

  traverse(tokenSet, basePath);
  return { tokens, errors };
}

/**
 * Parse a JSON string as a DTCG token set
 */
export function parseTokenJSON(json: string, basePath = ""): ParseResult {
  try {
    const tokenSet = JSON.parse(json) as TokenSet;
    return parseTokenSet(tokenSet, basePath);
  } catch (error) {
    return {
      tokens: [],
      errors: [
        {
          path: basePath || "root",
          message: `Invalid JSON: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

/**
 * Merge multiple parse results
 */
export function mergeParseResults(results: ParseResult[]): ParseResult {
  return {
    tokens: results.flatMap((r) => r.tokens),
    errors: results.flatMap((r) => r.errors),
  };
}

/**
 * Get a token by path from parsed tokens
 */
export function getTokenByPath(tokens: ParsedToken[], path: string): ParsedToken | undefined {
  return tokens.find((t) => t.path === path);
}

/**
 * Group tokens by their top-level category
 */
export function groupTokensByCategory(tokens: ParsedToken[]): Map<string, ParsedToken[]> {
  const groups = new Map<string, ParsedToken[]>();

  for (const token of tokens) {
    const parts = token.path.split(".");
    const category = parts[0];
    if (!category) continue;
    const existing = groups.get(category) ?? [];
    existing.push(token);
    groups.set(category, existing);
  }

  return groups;
}
