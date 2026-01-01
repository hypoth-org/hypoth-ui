"use client";

import { useEffect, useState } from "react";
import { registerAllElements } from "./register.js";

export interface DsLoaderProps {
  /** Callback when elements are registered */
  onLoad?: () => void;
}

/**
 * Client-side loader for design system Web Components.
 * Should be added once in the root layout.
 */
export function DsLoader({ onLoad }: DsLoaderProps): null {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    registerAllElements().then(() => {
      setIsLoaded(true);
      onLoad?.();
    });
  }, [isLoaded, onLoad]);

  return null;
}
