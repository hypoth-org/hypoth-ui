import { type Provider, createContext, useContext } from "react";

/**
 * Creates a compound component context with a built-in hook.
 * Throws a helpful error when used outside the provider.
 */
export function createCompoundContext<T>(
  displayName: string
): [Provider<T>, (consumerName: string) => T] {
  const Context = createContext<T | null>(null);
  Context.displayName = displayName;

  function useCompoundContext(consumerName: string): T {
    const context = useContext(Context);
    if (context === null) {
      throw new Error(`<${consumerName}> must be used within <${displayName}.Root>`);
    }
    return context;
  }

  return [Context.Provider as Provider<T>, useCompoundContext];
}
