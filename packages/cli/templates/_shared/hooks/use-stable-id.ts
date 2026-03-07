/**
 * SSR-Safe ID Generation Hooks
 *
 * Provides React 18 useId()-based hooks for stable ID generation
 * that works correctly with SSR and hydration.
 */

import { useId, useMemo } from "react";

export interface UseStableIdOptions {
  /** Custom ID to use instead of auto-generated one. */
  id?: string;
  /** Prefix for the generated ID. @default "ds" */
  prefix?: string;
}

export interface UseStableIdsOptions<T extends string> extends UseStableIdOptions {
  /** Parts to generate related IDs for. */
  parts: readonly T[];
}

export type StableIds<T extends string> = {
  /** The base ID */
  baseId: string;
} & Record<T, string>;

/**
 * Generate a stable, SSR-safe ID for a component.
 * Uses React 18's useId() under the hood.
 */
export function useStableId(options: UseStableIdOptions = {}): string {
  const { id: customId, prefix = "ds" } = options;

  const reactId = useId();

  const stableId = useMemo(() => {
    if (customId) {
      return customId;
    }
    const cleanId = reactId.replace(/:/g, "");
    return `${prefix}-${cleanId}`;
  }, [customId, prefix, reactId]);

  return stableId;
}

/**
 * Generate multiple related stable IDs for a component with multiple ARIA relationships.
 */
export function useStableIds<T extends string>(
  options: UseStableIdsOptions<T>
): StableIds<T> {
  const { id: customId, prefix = "ds", parts } = options;

  const baseId = useStableId({ id: customId, prefix });

  const ids = useMemo(() => {
    const result: Record<string, string> = { baseId };
    for (const part of parts) {
      result[part] = `${baseId}-${part}`;
    }
    return result as StableIds<T>;
  }, [baseId, parts]);

  return ids;
}

/**
 * Create a scoped ID generator function from a base ID.
 */
export function useScopedIdGenerator(baseId: string): (suffix: string) => string {
  return useMemo(() => {
    return (suffix: string) => `${baseId}-${suffix}`;
  }, [baseId]);
}

/**
 * Hook to conditionally include an ID attribute.
 */
export function useConditionalId(id: string | undefined): string | undefined {
  return useMemo(() => {
    if (!id || id.trim() === "") {
      return undefined;
    }
    return id;
  }, [id]);
}
