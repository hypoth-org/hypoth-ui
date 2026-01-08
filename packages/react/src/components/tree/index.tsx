"use client";

/**
 * Tree compound component exports
 */

import { TreeRoot } from "./tree.js";
import { TreeItem } from "./tree-item.js";

export type { TreeRootProps, TreeSelectionMode, TreeSize } from "./tree.js";
export type { TreeItemProps } from "./tree-item.js";

/**
 * Tree compound component for hierarchical data display.
 *
 * @example
 * ```tsx
 * <Tree selectionMode="single" onSelectionChange={(ids) => console.log(ids)}>
 *   <Tree.Item itemId="1">
 *     Documents
 *     <div slot="children">
 *       <Tree.Item itemId="1-1">Work</Tree.Item>
 *       <Tree.Item itemId="1-2">Personal</Tree.Item>
 *     </div>
 *   </Tree.Item>
 *   <Tree.Item itemId="2">Pictures</Tree.Item>
 * </Tree>
 * ```
 */
export const Tree = Object.assign(TreeRoot, {
  Item: TreeItem,
});

export { TreeItem };

// TypeScript declarations for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ds-tree": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
        "selection-mode"?: string;
        size?: string;
        lines?: boolean;
        label?: string;
        "onDs-selection-change"?: (event: CustomEvent) => void;
      };
      "ds-tree-item": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
        "item-id"?: string;
        expanded?: boolean;
        selected?: boolean;
        disabled?: boolean;
        "onDs-expand"?: (event: CustomEvent) => void;
        "onDs-select"?: (event: CustomEvent) => void;
        "onDs-activate"?: (event: CustomEvent) => void;
      };
    }
  }
}
