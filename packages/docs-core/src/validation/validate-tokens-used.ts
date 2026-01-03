/**
 * Tokens Used Validator
 * Validates tokensUsed fields in component manifests
 */

import { TOKEN_CATEGORIES, type TokenCategory } from "./token-categories.js";

/** Validation result */
export interface TokensUsedValidationResult {
  valid: boolean;
  errors: TokensUsedError[];
  warnings: TokensUsedWarning[];
}

/** Validation error */
export interface TokensUsedError {
  componentId: string;
  tokenPath: string;
  type: "invalid-category" | "undefined-token" | "invalid-format";
  message: string;
}

/** Validation warning */
export interface TokensUsedWarning {
  componentId: string;
  tokenPath: string;
  type: "orphaned-token" | "deprecated-token";
  message: string;
}

/** Token path pattern: category.path.to.token */
const TOKEN_PATH_PATTERN = /^[a-z][a-z0-9-]*(\.[a-zA-Z][a-zA-Z0-9._-]*)+$/;

/**
 * Validate a single tokensUsed array
 */
export function validateTokensUsed(
  componentId: string,
  tokensUsed: string[],
  availableTokens?: Set<string>
): TokensUsedValidationResult {
  const errors: TokensUsedError[] = [];
  const warnings: TokensUsedWarning[] = [];

  for (const tokenPath of tokensUsed) {
    // Check format
    if (!TOKEN_PATH_PATTERN.test(tokenPath)) {
      errors.push({
        componentId,
        tokenPath,
        type: "invalid-format",
        message: `Invalid token path format: "${tokenPath}". Must be category.path.to.token`,
      });
      continue;
    }

    // Check category
    const parts = tokenPath.split(".");
    const category = parts[0];
    if (!category || !isValidCategory(category)) {
      errors.push({
        componentId,
        tokenPath,
        type: "invalid-category",
        message: `Invalid token category: "${category}". Valid categories: ${TOKEN_CATEGORIES.join(", ")}`,
      });
      continue;
    }

    // Check if token exists (if available tokens provided)
    if (availableTokens && !availableTokens.has(tokenPath)) {
      errors.push({
        componentId,
        tokenPath,
        type: "undefined-token",
        message: `Token not found in token set: "${tokenPath}"`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate tokensUsed across all manifests
 */
export function validateAllTokensUsed(
  manifests: Array<{ id: string; tokensUsed?: string[] }>,
  availableTokens?: Set<string>
): TokensUsedValidationResult {
  const allErrors: TokensUsedError[] = [];
  const allWarnings: TokensUsedWarning[] = [];

  for (const manifest of manifests) {
    if (!manifest.tokensUsed || manifest.tokensUsed.length === 0) {
      continue;
    }

    const result = validateTokensUsed(manifest.id, manifest.tokensUsed, availableTokens);

    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Find orphaned tokens (tokens defined but not used by any component)
 */
export function findOrphanedTokens(
  availableTokens: Set<string>,
  manifests: Array<{ id: string; tokensUsed?: string[] }>
): string[] {
  const usedTokens = new Set<string>();

  for (const manifest of manifests) {
    if (manifest.tokensUsed) {
      for (const token of manifest.tokensUsed) {
        usedTokens.add(token);
      }
    }
  }

  const orphaned: string[] = [];
  for (const token of availableTokens) {
    if (!usedTokens.has(token)) {
      orphaned.push(token);
    }
  }

  return orphaned.sort();
}

/**
 * Build reverse lookup: which components use each token
 */
export function buildTokenUsageMap(
  manifests: Array<{ id: string; tokensUsed?: string[] }>
): Map<string, string[]> {
  const usageMap = new Map<string, string[]>();

  for (const manifest of manifests) {
    if (!manifest.tokensUsed) continue;

    for (const token of manifest.tokensUsed) {
      const components = usageMap.get(token) || [];
      components.push(manifest.id);
      usageMap.set(token, components);
    }
  }

  return usageMap;
}

/**
 * Check if a string is a valid token category
 */
function isValidCategory(category: string): category is TokenCategory {
  return TOKEN_CATEGORIES.includes(category as TokenCategory);
}
