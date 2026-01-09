/**
 * SSR-Safe ID Generation Hooks
 *
 * Provides React 18 useId()-based hooks for stable ID generation
 * that works correctly with SSR and hydration.
 *
 * @packageDocumentation
 */

import { useId, useMemo } from "react";

// =============================================================================
// Types
// =============================================================================

/**
 * Options for useStableId hook
 */
export interface UseStableIdOptions {
  /**
   * Custom ID to use instead of auto-generated one.
   * Useful when consumer wants to control the ID.
   */
  id?: string;
  /**
   * Prefix for the generated ID.
   * @default "ds"
   */
  prefix?: string;
}

/**
 * Options for useStableIds hook
 */
export interface UseStableIdsOptions<T extends string> extends UseStableIdOptions {
  /**
   * Parts to generate related IDs for.
   * Each part will get an ID derived from the base ID.
   */
  parts: readonly T[];
}

/**
 * Return type for useStableIds hook
 */
export type StableIds<T extends string> = {
  /** The base ID */
  baseId: string;
} & Record<T, string>;

// =============================================================================
// useStableId Hook
// =============================================================================

/**
 * Generate a stable, SSR-safe ID for a component.
 *
 * Uses React 18's useId() under the hood, which:
 * - Generates deterministic IDs that match between server and client
 * - Avoids hydration mismatches
 * - Is unique within the React tree
 *
 * @example Basic usage
 * ```tsx
 * function Dialog() {
 *   const titleId = useStableId({ prefix: "dialog-title" });
 *   return (
 *     <div role="dialog" aria-labelledby={titleId}>
 *       <h2 id={titleId}>Dialog Title</h2>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example With custom ID override
 * ```tsx
 * function Dialog({ id }: { id?: string }) {
 *   // Uses provided id if available, otherwise generates one
 *   const titleId = useStableId({ id, prefix: "dialog-title" });
 *   // ...
 * }
 * ```
 */
export function useStableId(options: UseStableIdOptions = {}): string {
  const { id: customId, prefix = "ds" } = options;

  // React 18's useId() generates a stable ID that matches between server and client
  const reactId = useId();

  // If custom ID provided, use it; otherwise generate from React ID
  const stableId = useMemo(() => {
    if (customId) {
      return customId;
    }
    // React's useId returns something like ":r0:" - clean it up
    const cleanId = reactId.replace(/:/g, "");
    return `${prefix}-${cleanId}`;
  }, [customId, prefix, reactId]);

  return stableId;
}

// =============================================================================
// useStableIds Hook
// =============================================================================

/**
 * Generate multiple related stable IDs for a component with multiple ARIA relationships.
 *
 * Useful for components like Dialog that need IDs for title, description, and content.
 *
 * @example Dialog with multiple ARIA relationships
 * ```tsx
 * function Dialog() {
 *   const ids = useStableIds({
 *     prefix: "dialog",
 *     parts: ["title", "description", "content"] as const,
 *   });
 *
 *   return (
 *     <div
 *       role="dialog"
 *       aria-labelledby={ids.title}
 *       aria-describedby={ids.description}
 *     >
 *       <h2 id={ids.title}>Title</h2>
 *       <p id={ids.description}>Description</p>
 *       <div id={ids.content}>Content</div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example Select with listbox and options
 * ```tsx
 * function Select() {
 *   const ids = useStableIds({
 *     prefix: "select",
 *     parts: ["trigger", "listbox", "label"] as const,
 *   });
 *
 *   return (
 *     <>
 *       <label id={ids.label}>Choose option</label>
 *       <button
 *         id={ids.trigger}
 *         aria-labelledby={ids.label}
 *         aria-controls={ids.listbox}
 *       >
 *         Select...
 *       </button>
 *       <ul id={ids.listbox} role="listbox">
 *         ...
 *       </ul>
 *     </>
 *   );
 * }
 * ```
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

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Create a scoped ID generator function from a base ID.
 * Useful when you need to generate IDs dynamically within a component.
 *
 * @example Dynamic list items
 * ```tsx
 * function TreeView({ items }) {
 *   const baseId = useStableId({ prefix: "tree" });
 *   const scopedId = useScopedIdGenerator(baseId);
 *
 *   return (
 *     <ul role="tree" id={baseId}>
 *       {items.map((item, index) => (
 *         <li key={item.id} id={scopedId(`item-${index}`)}>
 *           {item.label}
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useScopedIdGenerator(baseId: string): (suffix: string) => string {
  return useMemo(() => {
    return (suffix: string) => `${baseId}-${suffix}`;
  }, [baseId]);
}

/**
 * Hook to conditionally include an ID attribute.
 * Returns undefined if the ID would be empty or invalid.
 *
 * @example Conditional aria-describedby
 * ```tsx
 * function Input({ description }: { description?: string }) {
 *   const descriptionId = useStableId({ prefix: "input-desc" });
 *   const ariaDescribedBy = useConditionalId(description ? descriptionId : undefined);
 *
 *   return (
 *     <>
 *       <input aria-describedby={ariaDescribedBy} />
 *       {description && <p id={descriptionId}>{description}</p>}
 *     </>
 *   );
 * }
 * ```
 */
export function useConditionalId(id: string | undefined): string | undefined {
  return useMemo(() => {
    if (!id || id.trim() === "") {
      return undefined;
    }
    return id;
  }, [id]);
}
