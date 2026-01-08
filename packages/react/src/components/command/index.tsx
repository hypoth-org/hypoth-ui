/**
 * Command palette compound component exports.
 *
 * @example
 * ```tsx
 * import { Command } from "@ds/react";
 *
 * <Command.Root onSelect={(value) => console.log(value)}>
 *   <Command.Input placeholder="Type a command..." />
 *   <Command.List>
 *     <Command.Empty>No results found.</Command.Empty>
 *     <Command.Group heading="Actions">
 *       <Command.Item value="copy">Copy</Command.Item>
 *       <Command.Item value="paste">Paste</Command.Item>
 *     </Command.Group>
 *   </Command.List>
 * </Command.Root>
 * ```
 */

import {
  type HTMLAttributes,
  type ReactNode,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// ============================================================================
// Types
// ============================================================================

export interface CommandRootProps
  extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  children?: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  loading?: boolean;
  filter?: boolean;
  label?: string;
}

export interface CommandInputProps extends HTMLAttributes<HTMLElement> {
  placeholder?: string;
  disabled?: boolean;
  value?: string;
}

export interface CommandListProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface CommandItemProps
  extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  children?: ReactNode;
  value?: string;
  keywords?: string;
  disabled?: boolean;
  onSelect?: (value: string) => void;
}

export interface CommandGroupProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  heading?: string;
}

export interface CommandSeparatorProps extends HTMLAttributes<HTMLElement> {}

export interface CommandEmptyProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface CommandLoadingProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

// ============================================================================
// Components
// ============================================================================

const CommandRoot = forwardRef<HTMLElement, CommandRootProps>(
  function CommandRoot(
    {
      children,
      className,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      onSelect,
      loading,
      filter = true,
      label,
      ...props
    },
    ref
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
    const elementRef = useRef<HTMLElement>(null);

    const combinedRef = (node: HTMLElement | null) => {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    };

    const handleValueChange = useCallback(
      (event: Event) => {
        const e = event as CustomEvent<{ value: string }>;
        if (!isControlled) setInternalValue(e.detail.value);
        onValueChange?.(e.detail.value);
      },
      [isControlled, onValueChange]
    );

    const handleSelect = useCallback(
      (event: Event) => {
        const e = event as CustomEvent<{ value: string }>;
        onSelect?.(e.detail.value);
      },
      [onSelect]
    );

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;
      element.addEventListener("ds:value-change", handleValueChange);
      element.addEventListener("ds:select", handleSelect);
      return () => {
        element.removeEventListener("ds:value-change", handleValueChange);
        element.removeEventListener("ds:select", handleSelect);
      };
    }, [handleValueChange, handleSelect]);

    return createElement(
      "ds-command",
      {
        ref: combinedRef,
        class: className,
        value,
        loading: loading || undefined,
        filter: filter || undefined,
        label,
        ...props,
      },
      children
    );
  }
);
CommandRoot.displayName = "Command.Root";

const CommandInput = forwardRef<HTMLElement, CommandInputProps>(
  function CommandInput(
    { className, placeholder, disabled, value, ...props },
    ref
  ) {
    return createElement("ds-command-input", {
      ref,
      class: className,
      placeholder,
      disabled: disabled || undefined,
      value,
      ...props,
    });
  }
);
CommandInput.displayName = "Command.Input";

const CommandList = forwardRef<HTMLElement, CommandListProps>(
  function CommandList({ children, className, ...props }, ref) {
    return createElement(
      "ds-command-list",
      { ref, class: className, ...props },
      children
    );
  }
);
CommandList.displayName = "Command.List";

const CommandItem = forwardRef<HTMLElement, CommandItemProps>(
  function CommandItem(
    { children, className, value, keywords, disabled, onSelect, ...props },
    ref
  ) {
    const elementRef = useRef<HTMLElement>(null);

    const combinedRef = (node: HTMLElement | null) => {
      (elementRef as React.MutableRefObject<HTMLElement | null>).current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    };

    const handleSelect = useCallback(
      (event: Event) => {
        const e = event as CustomEvent<{ value: string }>;
        onSelect?.(e.detail.value);
      },
      [onSelect]
    );

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;
      element.addEventListener("ds:command-select", handleSelect);
      return () =>
        element.removeEventListener("ds:command-select", handleSelect);
    }, [handleSelect]);

    return createElement(
      "ds-command-item",
      {
        ref: combinedRef,
        class: className,
        value,
        keywords,
        disabled: disabled || undefined,
        ...props,
      },
      children
    );
  }
);
CommandItem.displayName = "Command.Item";

const CommandGroup = forwardRef<HTMLElement, CommandGroupProps>(
  function CommandGroup({ children, className, heading, ...props }, ref) {
    return createElement(
      "ds-command-group",
      { ref, class: className, heading, ...props },
      children
    );
  }
);
CommandGroup.displayName = "Command.Group";

const CommandSeparator = forwardRef<HTMLElement, CommandSeparatorProps>(
  function CommandSeparator({ className, ...props }, ref) {
    return createElement("ds-command-separator", {
      ref,
      class: className,
      ...props,
    });
  }
);
CommandSeparator.displayName = "Command.Separator";

const CommandEmpty = forwardRef<HTMLElement, CommandEmptyProps>(
  function CommandEmpty({ children, className, ...props }, ref) {
    return createElement(
      "ds-command-empty",
      { ref, class: className, ...props },
      children
    );
  }
);
CommandEmpty.displayName = "Command.Empty";

const CommandLoading = forwardRef<HTMLElement, CommandLoadingProps>(
  function CommandLoading({ children, className, ...props }, ref) {
    return createElement(
      "ds-command-loading",
      { ref, class: className, ...props },
      children
    );
  }
);
CommandLoading.displayName = "Command.Loading";

// ============================================================================
// Compound Component
// ============================================================================

export const Command = {
  Root: CommandRoot,
  Input: CommandInput,
  List: CommandList,
  Item: CommandItem,
  Group: CommandGroup,
  Separator: CommandSeparator,
  Empty: CommandEmpty,
  Loading: CommandLoading,
};

export {
  CommandRoot,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandEmpty,
  CommandLoading,
};
