// Registration helper - dynamically imports and registers all components
export async function registerAllElements(): Promise<void> {
  // Only run on client
  if (typeof window === "undefined") return;

  // Dynamically import Web Components to avoid SSR issues
  await import("@ds/wc");
}
