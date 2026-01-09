/**
 * ID Generation Utilities
 *
 * Provides SSR-safe ID generation for ARIA relationships.
 * React adapters should use React 18's useId() hook instead.
 *
 * @packageDocumentation
 */

// =============================================================================
// Types
// =============================================================================

/**
 * ID generator function type
 */
export type IdGenerator = (prefix?: string) => string;

/**
 * Options for creating an ID generator
 */
export interface IdGeneratorOptions {
  /** Prefix for all generated IDs @default "ds" */
  prefix?: string;
  /** Separator between prefix and ID @default "-" */
  separator?: string;
}

// =============================================================================
// Default ID Generator
// =============================================================================

/**
 * Default ID generator using crypto.randomUUID().
 * Safe for client-only rendering.
 *
 * @example
 * ```ts
 * const generateId = createDefaultIdGenerator();
 * const id = generateId(); // "ds-a1b2c3d4"
 * const customId = generateId("dialog"); // "dialog-a1b2c3d4"
 * ```
 */
export function createDefaultIdGenerator(
  options: IdGeneratorOptions = {}
): IdGenerator {
  const { prefix: defaultPrefix = "ds", separator = "-" } = options;

  return (prefix?: string) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).slice(2, 10);
    const finalPrefix = prefix ?? defaultPrefix;
    return `${finalPrefix}${separator}${id}`;
  };
}

// =============================================================================
// Counter-based ID Generator
// =============================================================================

/**
 * Counter-based ID generator for deterministic IDs.
 * Use when you need predictable IDs (e.g., testing).
 *
 * @param seed - Starting counter value @default 0
 *
 * @example
 * ```ts
 * const generateId = createCounterIdGenerator();
 * generateId(); // "ds-0"
 * generateId(); // "ds-1"
 * generateId("dialog"); // "dialog-2"
 * ```
 */
export function createCounterIdGenerator(
  seed = 0,
  options: IdGeneratorOptions = {}
): IdGenerator {
  const { prefix: defaultPrefix = "ds", separator = "-" } = options;
  let counter = seed;

  return (prefix?: string) => {
    const finalPrefix = prefix ?? defaultPrefix;
    return `${finalPrefix}${separator}${counter++}`;
  };
}

// =============================================================================
// Scoped ID Generator
// =============================================================================

/**
 * Creates a scoped ID generator that prefixes all IDs with a scope.
 * Useful for ensuring unique IDs within a component tree.
 *
 * @param scope - Unique scope identifier
 * @param baseGenerator - Optional base generator to use
 *
 * @example
 * ```ts
 * const generateId = createScopedIdGenerator("dialog-123");
 * generateId("title"); // "dialog-123-title"
 * generateId("description"); // "dialog-123-description"
 * ```
 */
export function createScopedIdGenerator(
  scope: string,
  baseGenerator?: IdGenerator
): IdGenerator {
  const base = baseGenerator ?? createDefaultIdGenerator();

  return (part?: string) => {
    if (part) {
      return `${scope}-${part}`;
    }
    return base(scope);
  };
}

// =============================================================================
// Multiple Related IDs
// =============================================================================

/**
 * Generate multiple related IDs from a base ID.
 * Useful for components with multiple ARIA relationships.
 *
 * @example
 * ```ts
 * const ids = createRelatedIds("dialog-123", ["title", "description", "content"]);
 * // {
 * //   title: "dialog-123-title",
 * //   description: "dialog-123-description",
 * //   content: "dialog-123-content"
 * // }
 * ```
 */
export function createRelatedIds<T extends string>(
  baseId: string,
  parts: readonly T[]
): Record<T, string> {
  const ids = {} as Record<T, string>;
  for (const part of parts) {
    ids[part] = `${baseId}-${part}`;
  }
  return ids;
}

// =============================================================================
// Singleton Default Generator
// =============================================================================

let defaultGenerator: IdGenerator | null = null;

/**
 * Get the shared default ID generator instance.
 * Creates one if it doesn't exist.
 */
export function getDefaultIdGenerator(): IdGenerator {
  if (!defaultGenerator) {
    defaultGenerator = createDefaultIdGenerator();
  }
  return defaultGenerator;
}

/**
 * Reset the default ID generator.
 * Useful for testing or SSR where you need to reset state.
 */
export function resetDefaultIdGenerator(): void {
  defaultGenerator = null;
}

/**
 * Set a custom default ID generator.
 * Useful for SSR where you want to inject a deterministic generator.
 *
 * @example
 * ```ts
 * // In SSR setup
 * setDefaultIdGenerator(createCounterIdGenerator(0));
 *
 * // After render, reset for next request
 * resetDefaultIdGenerator();
 * ```
 */
export function setDefaultIdGenerator(generator: IdGenerator): void {
  defaultGenerator = generator;
}
