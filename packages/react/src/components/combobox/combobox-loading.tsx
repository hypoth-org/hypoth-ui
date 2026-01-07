/**
 * Combobox Loading component - shown during async loading.
 */

import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { useComboboxContext } from "./combobox-context.js";

export interface ComboboxLoadingProps extends HTMLAttributes<HTMLDivElement> {
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
export const ComboboxLoading = forwardRef<HTMLDivElement, ComboboxLoadingProps>(
  ({ children, className, ...restProps }, ref) => {
    const { loading } = useComboboxContext("Combobox.Loading");

    // Only show if loading
    if (!loading) {
      return null;
    }

    return (
      <div ref={ref} role="status" aria-live="polite" className={className} {...restProps}>
        {children}
      </div>
    );
  }
);

ComboboxLoading.displayName = "Combobox.Loading";
