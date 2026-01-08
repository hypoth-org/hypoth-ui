/**
 * Combobox Loading component - shown during async loading.
 */

import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { useComboboxContext } from "./combobox-context.js";

export interface ComboboxLoadingProps extends HTMLAttributes<HTMLOutputElement> {
  /** Loading indicator content */
  children?: ReactNode;
}

/**
 * Loading state shown during async search.
 *
 * @example
 * ```tsx
 * <Combobox.Loading>Searching...</Combobox.Loading>
 * ```
 */
export const ComboboxLoading = forwardRef<HTMLOutputElement, ComboboxLoadingProps>(
  ({ children, className, ...restProps }, ref) => {
    const { loading } = useComboboxContext("Combobox.Loading");

    // Only show if loading
    if (!loading) {
      return null;
    }

    return (
      <output ref={ref} aria-live="polite" className={className} {...restProps}>
        {children}
      </output>
    );
  }
);

ComboboxLoading.displayName = "Combobox.Loading";
