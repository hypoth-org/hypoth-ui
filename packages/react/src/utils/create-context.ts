import { type Provider, createContext, useContext } from "react";

/**
 * Creates a compound component context with a built-in hook.
 * Throws a helpful error when used outside the provider.
 *
 * @param displayName - Name for React DevTools and error messages
 * @returns Tuple of [Provider, useContext hook]
 *
 * @example
 * ```tsx
 * const [DialogProvider, useDialogContext] = createCompoundContext<DialogContextValue>("Dialog");
 *
 * // In Root component:
 * <DialogProvider value={contextValue}>{children}</DialogProvider>
 *
 * // In child components:
 * const { open, setOpen } = useDialogContext("DialogTrigger");
 * ```
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
