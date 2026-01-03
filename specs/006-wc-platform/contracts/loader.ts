/**
 * Next.js Loader API Contract
 * Client-side component registration for Next.js App Router
 *
 * @package @ds/next
 * @path packages/next/src/loader/
 */

/**
 * DsLoader component props
 */
export interface DsLoaderProps {
  /**
   * Callback fired when all components are registered
   * Useful for showing loading states or triggering dependent logic
   */
  onLoad?: () => void;
}

/**
 * DsLoader - Client Component for Web Component Registration
 *
 * Add this component once in your root layout to register
 * all design system custom elements.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { DsLoader } from '@ds/next/loader';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <DsLoader />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @returns null - This component renders nothing
 */
export declare function DsLoader(props: DsLoaderProps): null;

/**
 * Register all design system elements
 *
 * Called internally by DsLoader. Can also be called directly
 * for non-React environments or manual registration.
 *
 * Safe to call multiple times - elements are only registered once.
 * No-op when called on the server (SSR-safe).
 *
 * @returns Promise that resolves when registration completes
 *
 * @example
 * ```typescript
 * // Manual registration (non-React)
 * import { registerAllElements } from '@ds/next/loader';
 *
 * await registerAllElements();
 * // All ds-* elements are now available
 * ```
 */
export declare function registerAllElements(): Promise<void>;

/**
 * Registration options for selective loading
 */
export interface RegisterOptions {
  /**
   * Specific components to register (by tag name)
   * If not provided, all components are registered
   */
  only?: string[];
  /**
   * Components to exclude from registration
   */
  exclude?: string[];
  /**
   * Log registration activity to console (default: false)
   */
  verbose?: boolean;
}

/**
 * Register specific elements with options
 *
 * @param options - Registration options
 * @returns Promise that resolves when registration completes
 *
 * @example
 * ```typescript
 * // Register only specific components
 * await registerElements({ only: ['ds-button', 'ds-input'] });
 *
 * // Register all except certain components
 * await registerElements({ exclude: ['ds-complex-table'] });
 * ```
 */
export declare function registerElements(options?: RegisterOptions): Promise<void>;
