import type { ComponentShowcase, SectionContent } from '../types.js';

/**
 * Overlay component showcase definitions for demo applications.
 */

export const dialogShowcase: ComponentShowcase = {
  component: 'Dialog',
  title: 'Dialog',
  description: 'A modal dialog interrupts the user with important content and expects a response.',
  variants: ['default', 'alert'],
  interactive: true,
};

export const alertDialogShowcase: ComponentShowcase = {
  component: 'AlertDialog',
  title: 'Alert Dialog',
  description: 'A modal dialog that interrupts the user with important content and expects a confirmation.',
  variants: ['destructive', 'warning'],
  interactive: true,
};

export const sheetShowcase: ComponentShowcase = {
  component: 'Sheet',
  title: 'Sheet',
  description: 'A slide-out panel that extends from the edge of the screen.',
  variants: ['left', 'right', 'top', 'bottom'],
  interactive: true,
};

export const drawerShowcase: ComponentShowcase = {
  component: 'Drawer',
  title: 'Drawer',
  description: 'A mobile-optimized slide-in panel with swipe-to-dismiss gesture support.',
  variants: ['bottom'],
  interactive: true,
};

export const popoverShowcase: ComponentShowcase = {
  component: 'Popover',
  title: 'Popover',
  description: 'A floating panel positioned relative to an anchor element.',
  variants: ['default'],
  interactive: true,
};

export const tooltipShowcase: ComponentShowcase = {
  component: 'Tooltip',
  title: 'Tooltip',
  description: 'A small overlay that shows additional information on hover or focus.',
  variants: ['default'],
  interactive: false,
};

export const overlaysSectionContent: SectionContent = {
  id: 'overlays',
  title: 'Overlays',
  description: 'Components that render content in a layer above the main content, including dialogs, sheets, drawers, popovers, and tooltips.',
  components: [
    dialogShowcase,
    alertDialogShowcase,
    sheetShowcase,
    drawerShowcase,
    popoverShowcase,
    tooltipShowcase,
  ],
};
