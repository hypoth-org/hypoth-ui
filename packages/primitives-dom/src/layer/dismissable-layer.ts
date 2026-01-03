/**
 * Dismissable layer utility for popovers, menus, and dialogs.
 * Handles Escape key and outside click dismissal with layer stacking support.
 */

/**
 * Reason for layer dismissal.
 */
export type DismissReason = "escape" | "outside-click";

/**
 * Options for creating a dismissable layer.
 */
export interface DismissableLayerOptions {
  /**
   * The layer container element.
   */
  container: HTMLElement;

  /**
   * Elements that should not trigger outside-click dismissal.
   * Typically includes the trigger button.
   */
  excludeElements?: HTMLElement[];

  /**
   * Callback invoked when layer should be dismissed.
   */
  onDismiss: (reason: DismissReason) => void;

  /**
   * Whether Escape key dismisses the layer.
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Whether clicking outside dismisses the layer.
   * @default true
   */
  closeOnOutsideClick?: boolean;
}

/**
 * Return interface for dismissable layer.
 */
export interface DismissableLayer {
  /**
   * Activates the dismissable layer.
   * Adds to the global layer stack and attaches event listeners.
   */
  activate: () => void;

  /**
   * Deactivates the dismissable layer.
   * Removes from the layer stack and detaches event listeners.
   */
  deactivate: () => void;
}

// Module-level layer stack for LIFO dismissal
interface LayerEntry {
  layer: DismissableLayer;
  container: HTMLElement;
  excludeElements: HTMLElement[];
  onDismiss: (reason: DismissReason) => void;
  closeOnEscape: boolean;
  closeOnOutsideClick: boolean;
}

const layerStack: LayerEntry[] = [];

/**
 * Global Escape key handler using capture phase.
 * Only the topmost layer receives the event.
 */
function handleGlobalEscape(event: KeyboardEvent): void {
  if (event.key !== "Escape" || layerStack.length === 0) return;

  const topLayer = layerStack[layerStack.length - 1];
  if (!topLayer) return;

  if (topLayer.closeOnEscape) {
    event.preventDefault();
    event.stopPropagation();
    topLayer.onDismiss("escape");
  }
}

/**
 * Global outside click handler.
 * Only the topmost layer receives the event.
 */
function handleGlobalPointerDown(event: PointerEvent): void {
  if (layerStack.length === 0) return;

  const topLayer = layerStack[layerStack.length - 1];
  if (!topLayer) return;

  if (!topLayer.closeOnOutsideClick) return;

  const target = event.target as Node;

  // Check if click is inside the container
  if (topLayer.container.contains(target)) return;

  // Check if click is on an excluded element
  for (const excluded of topLayer.excludeElements) {
    if (excluded.contains(target)) return;
  }

  // Outside click detected
  topLayer.onDismiss("outside-click");
}

// Track whether global listeners are attached
let globalListenersAttached = false;

function attachGlobalListeners(): void {
  if (globalListenersAttached) return;
  document.addEventListener("keydown", handleGlobalEscape, true);
  document.addEventListener("pointerdown", handleGlobalPointerDown, true);
  globalListenersAttached = true;
}

function detachGlobalListeners(): void {
  if (layerStack.length > 0) return;
  document.removeEventListener("keydown", handleGlobalEscape, true);
  document.removeEventListener("pointerdown", handleGlobalPointerDown, true);
  globalListenersAttached = false;
}

/**
 * Creates a dismissable layer with Escape key and outside click support.
 */
export function createDismissableLayer(options: DismissableLayerOptions): DismissableLayer {
  const {
    container,
    excludeElements = [],
    onDismiss,
    closeOnEscape = true,
    closeOnOutsideClick = true,
  } = options;

  let entry: LayerEntry | null = null;

  function activate(): void {
    if (entry) return; // Already active

    entry = {
      layer: { activate, deactivate },
      container,
      excludeElements,
      onDismiss,
      closeOnEscape,
      closeOnOutsideClick,
    };

    layerStack.push(entry);
    attachGlobalListeners();
  }

  function deactivate(): void {
    if (!entry) return; // Not active

    const index = layerStack.indexOf(entry);
    if (index !== -1) {
      layerStack.splice(index, 1);
    }

    entry = null;
    detachGlobalListeners();
  }

  return { activate, deactivate };
}
