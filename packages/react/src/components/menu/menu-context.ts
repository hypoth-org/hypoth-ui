/**
 * Menu context for compound component pattern.
 */

import type { MenuBehavior } from "@ds/primitives-dom";
import { createCompoundContext } from "../../utils/create-context.js";

export interface MenuContextValue {
  /** Menu behavior instance */
  behavior: MenuBehavior;
  /** Whether menu is open */
  open: boolean;
  /** Set open state */
  setOpen: (open: boolean) => void;
}

export const [MenuProvider, useMenuContext] =
  createCompoundContext<MenuContextValue>("Menu");
