/**
 * Loading State Types
 *
 * Standardized loading state props for async components.
 *
 * @packageDocumentation
 */

/**
 * Loading state props for components that support async data.
 *
 * Components implementing this interface:
 * - Select (loading options)
 * - Combobox (loading search results)
 * - Table (loading rows)
 * - Tree (loading children)
 *
 * @example
 * ```tsx
 * // Basic loading state
 * <Select loading>
 *   <SelectTrigger>Loading...</SelectTrigger>
 * </Select>
 *
 * // With loading text
 * <Select loading loadingText="Fetching options...">
 *   <SelectTrigger>Select an option</SelectTrigger>
 * </Select>
 *
 * // Table with skeleton rows
 * <Table loading skeletonRows={5}>
 *   <TableHeader>...</TableHeader>
 * </Table>
 * ```
 */
export interface LoadingProps {
  /**
   * Whether the component is in a loading state.
   * When true:
   * - Sets aria-busy="true" for screen readers
   * - Disables keyboard navigation
   * - Shows loading indicator (component-specific)
   */
  loading?: boolean;

  /**
   * Text to display/announce during loading.
   * Used for both visual loading indicator and screen reader announcement.
   * @default "Loading..."
   */
  loadingText?: string;
}

/**
 * Extended loading props for table-like components.
 */
export interface TableLoadingProps extends LoadingProps {
  /**
   * Number of skeleton rows to show during loading.
   * Only applies when `loading` is true.
   * @default 3
   */
  skeletonRows?: number;
}

/**
 * Extended loading props for tree-like components.
 */
export interface TreeLoadingProps extends LoadingProps {
  /**
   * Node IDs that are currently loading children.
   * Allows for node-level loading indicators.
   */
  loadingNodes?: Set<string> | string[];
}

/**
 * Loading state detail for async operations.
 */
export interface LoadingState {
  /** Whether currently loading */
  isLoading: boolean;
  /** Error that occurred during loading, if any */
  error?: Error | null;
  /** Progress percentage (0-100) for determinate loading */
  progress?: number;
}

/**
 * Callback for when loading state changes.
 */
export type OnLoadingChange = (state: LoadingState) => void;
