/**
 * @ds/test-utils - Framework-agnostic test utilities
 *
 * Provides shared testing helpers for Web Component and React component testing.
 *
 * @example
 * ```ts
 * import { pressKey, Keys, hasRole, createComponent } from '@ds/test-utils';
 *
 * // Keyboard simulation
 * pressKey(button, 'Enter');
 * pressKey(element, { key: 'A', shiftKey: true });
 *
 * // ARIA assertions
 * expect(hasRole(element, 'button')).toBe(true);
 * expect(isExpanded(dropdown)).toBe(true);
 *
 * // Component wrapper
 * const { component } = await createComponent('ds-button', { variant: 'primary' }, 'Click me');
 * component.click();
 * ```
 */

// Keyboard simulation helpers
export {
  Keys,
  createKeyboardEvent,
  pressKey,
  keyDown,
  keyUp,
  typeText,
  tab,
  enter,
  space,
  escape,
  arrowUp,
  arrowDown,
  arrowLeft,
  arrowRight,
  type KeyboardEventInit,
} from "./keyboard.js";

// ARIA assertion helpers
export {
  getRole,
  hasRole,
  getAriaAttribute,
  hasAriaAttribute,
  isExpanded,
  isCollapsed,
  isSelected,
  isChecked,
  isDisabled,
  isHidden,
  hasAccessibleName,
  getAccessibleName,
  queryByRole,
  getFocusableElements,
  type AriaRole,
} from "./aria.js";

// Component wrapper utilities
export {
  wrapElement,
  createComponent,
  cleanupComponents,
  renderHTML,
  type ComponentWrapper,
} from "./component.js";
