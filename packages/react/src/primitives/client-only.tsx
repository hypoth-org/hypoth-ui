"use client";

/**
 * ClientOnly React Component
 *
 * Prevents SSR for browser-only components. Renders fallback on server
 * and during hydration, then shows children after client-side mount.
 */

import { type ReactNode, useEffect, useState } from "react";

export interface ClientOnlyProps {
  /** Content to render only on the client */
  children: ReactNode;
  /** Fallback content to show during SSR and hydration */
  fallback?: ReactNode;
}

/**
 * ClientOnly component for browser-only rendering.
 *
 * Useful for components that:
 * - Access browser APIs (window, document, localStorage)
 * - Use third-party libraries that don't support SSR
 * - Need to avoid hydration mismatches
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ClientOnly>
 *   <BrowserOnlyChart data={data} />
 * </ClientOnly>
 *
 * // With fallback
 * <ClientOnly fallback={<Skeleton height={300} />}>
 *   <Chart data={data} />
 * </ClientOnly>
 *
 * // For localStorage access
 * <ClientOnly fallback={<span>Loading preferences...</span>}>
 *   <UserPreferences />
 * </ClientOnly>
 * ```
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps): ReactNode {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

ClientOnly.displayName = "ClientOnly";

/**
 * Hook for client-only rendering logic.
 *
 * @returns true when running on the client after hydration
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isClient = useIsClient();
 *
 *   if (!isClient) {
 *     return <Skeleton />;
 *   }
 *
 *   return <ClientSideContent />;
 * }
 * ```
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
