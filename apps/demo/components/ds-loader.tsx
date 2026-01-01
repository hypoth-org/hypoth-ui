"use client";

import { useEffect } from "react";

export function DsLoader() {
  useEffect(() => {
    // Dynamically import to avoid SSR issues
    import("@ds/wc");
  }, []);
  return null;
}
