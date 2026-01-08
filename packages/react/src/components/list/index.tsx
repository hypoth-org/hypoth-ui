"use client";

/**
 * List compound component exports
 */

import { ListRoot } from "./list.js";
import { ListItem } from "./list-item.js";

export type { ListRootProps, ListSelectionMode, ListOrientation, ListSize } from "./list.js";
export type { ListItemProps } from "./list-item.js";

/**
 * List compound component for collection display.
 *
 * @example
 * ```tsx
 * <List selectionMode="single" onSelectionChange={(ids) => console.log(ids)}>
 *   <List.Item itemId="1">Item 1</List.Item>
 *   <List.Item itemId="2">Item 2</List.Item>
 *   <List.Item itemId="3" disabled>Item 3 (disabled)</List.Item>
 * </List>
 * ```
 */
export const List = Object.assign(ListRoot, {
  Item: ListItem,
});

export { ListItem };

// TypeScript declarations for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ds-list": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
        "selection-mode"?: string;
        orientation?: string;
        size?: string;
        bordered?: boolean;
        label?: string;
        "onDs-selection-change"?: (event: CustomEvent) => void;
      };
      "ds-list-item": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
        "item-id"?: string;
        selected?: boolean;
        disabled?: boolean;
        value?: string;
        "onDs-select"?: (event: CustomEvent) => void;
        "onDs-activate"?: (event: CustomEvent) => void;
      };
    }
  }
}
