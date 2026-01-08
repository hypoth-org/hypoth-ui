/**
 * Combobox Empty component - shown when no options match.
 */

import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { useComboboxContext } from "./combobox-context.js";

export interface ComboboxEmptyProps extends HTMLAttributes<HTMLOutputElement> {
  /** Empty state content */
  children?: ReactNode;
}

/**
 * Empty state shown when no options match the search.
 *
 * @example
 * ```tsx
 * <Combobox.Empty>No results found</Combobox.Empty>
 * ```
 */
export const ComboboxEmpty = forwardRef<HTMLOutputElement, ComboboxEmptyProps>(
  ({ children, className, ...restProps }, ref) => {
    const { filteredOptions, loading, inputValue } = useComboboxContext("Combobox.Empty");

    // Only show if no options and not loading and has input
    if (filteredOptions.length > 0 || loading || !inputValue) {
      return null;
    }

    return (
      <output ref={ref} aria-live="polite" className={className} {...restProps}>
        {children}
      </output>
    );
  }
);

ComboboxEmpty.displayName = "Combobox.Empty";
