/**
 * Tree structure utilities for APG-compliant ARIA attributes.
 *
 * Calculates aria-level, aria-setsize, and aria-posinset for tree items
 * to provide proper screen reader context (e.g., "Item 3 of 5, level 2").
 */

export interface TreeItemPosition {
  /** Nesting depth (1-based, root items are level 1) */
  level: number;
  /** Number of siblings at this level */
  setSize: number;
  /** Position among siblings (1-based) */
  posInSet: number;
}

/**
 * Calculate position attributes for a tree item element.
 *
 * @param element - The ds-tree-item element
 * @returns Position info for aria-level, aria-setsize, aria-posinset
 *
 * @example
 * ```ts
 * const position = calculateTreeItemPosition(treeItemElement);
 * // { level: 2, setSize: 3, posInSet: 1 }
 * ```
 */
export function calculateTreeItemPosition(element: HTMLElement): TreeItemPosition {
  // Calculate level by counting ancestor tree items
  let level = 1;
  let parent: HTMLElement | null = element.parentElement;

  while (parent) {
    // Check if parent is a tree item (indicates nested level)
    if (parent.tagName?.toLowerCase() === "ds-tree-item") {
      level++;
    }
    // Stop at tree root
    if (parent.tagName?.toLowerCase() === "ds-tree") {
      break;
    }
    parent = parent.parentElement;
  }

  // Find siblings at the same level
  const siblings = getSiblingTreeItems(element);
  const setSize = siblings.length;
  const posInSet = siblings.indexOf(element) + 1;

  return { level, setSize, posInSet };
}

/**
 * Get sibling tree items at the same level.
 *
 * @param element - The ds-tree-item element
 * @returns Array of sibling tree item elements
 */
function getSiblingTreeItems(element: HTMLElement): HTMLElement[] {
  // Find the container (either tree root or children slot)
  let container: HTMLElement | null = element.parentElement;

  // If parent is a slot, get the slot's parent
  if (container?.tagName?.toLowerCase() === "slot") {
    container = container.parentElement;
  }

  // If parent is a ul with role="group", get its parent (the tree-item)
  // and then find the children slot
  if (container?.getAttribute("role") === "group") {
    container = container.parentElement;
  }

  if (!container) {
    return [element];
  }

  // Query for direct tree-item children
  // This handles both root level (ds-tree > ds-tree-item)
  // and nested level (ds-tree-item [slot=children] > ds-tree-item)
  const items: HTMLElement[] = [];

  // Check direct children and slotted children
  const checkChildren = (parent: HTMLElement) => {
    for (const child of parent.children) {
      if (child.tagName?.toLowerCase() === "ds-tree-item") {
        items.push(child as HTMLElement);
      } else if (child.tagName?.toLowerCase() === "slot") {
        // Get assigned elements from slot
        const slot = child as HTMLSlotElement;
        for (const assigned of slot.assignedElements()) {
          if (assigned.tagName?.toLowerCase() === "ds-tree-item") {
            items.push(assigned as HTMLElement);
          }
        }
      }
    }
  };

  // For root tree, check its direct children
  if (container.tagName?.toLowerCase() === "ds-tree") {
    checkChildren(container);
  } else if (container.tagName?.toLowerCase() === "ds-tree-item") {
    // For nested items, find the children slot container
    const childrenSlot = container.querySelector('[slot="children"]');
    if (childrenSlot) {
      for (const child of childrenSlot.children) {
        if (child.tagName?.toLowerCase() === "ds-tree-item") {
          items.push(child as HTMLElement);
        }
      }
    }
  }

  // If no items found via DOM traversal, fall back to the element itself
  return items.length > 0 ? items : [element];
}

/**
 * Update ARIA position attributes on a tree item element.
 *
 * @param element - The ds-tree-item element to update
 */
export function updateTreeItemAriaAttributes(element: HTMLElement): void {
  const position = calculateTreeItemPosition(element);

  element.setAttribute("aria-level", String(position.level));
  element.setAttribute("aria-setsize", String(position.setSize));
  element.setAttribute("aria-posinset", String(position.posInSet));
}

/**
 * Update ARIA position attributes on all tree items within a tree.
 *
 * @param treeRoot - The ds-tree root element
 */
export function updateAllTreeItemAriaAttributes(treeRoot: HTMLElement): void {
  const items = treeRoot.querySelectorAll("ds-tree-item");
  for (const item of items) {
    updateTreeItemAriaAttributes(item as unknown as HTMLElement);
  }
}
