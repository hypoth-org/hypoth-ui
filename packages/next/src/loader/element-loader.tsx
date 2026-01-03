"use client";

import { useEffect, useState } from "react";
import { registerAllElements, type RegisterOptions } from "./register.js";

export interface DsLoaderProps extends RegisterOptions {
  /** Callback when elements are registered */
  onLoad?: () => void;
}

/**
 * Client-side loader for design system Web Components.
 * Should be added once in the root layout.
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * import { DsLoader } from "@ds/next";
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
 * @example
 * ```tsx
 * // Selective loading with debug
 * <DsLoader include={["ds-button", "ds-input"]} debug />
 * ```
 */
export function DsLoader({ onLoad, include, exclude, debug }: DsLoaderProps): null {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    registerAllElements({ include, exclude, debug })
      .then(() => {
        setIsLoaded(true);
        onLoad?.();
      })
      .catch((error) => {
        console.error("[DsLoader] Failed to register components:", error);
      });
  }, [isLoaded, onLoad, include, exclude, debug]);

  return null;
}
