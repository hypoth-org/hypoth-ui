/**
 * ComponentController Mixin
 *
 * Provides standardized lifecycle hooks and controller integration for
 * design system Web Components. This mixin adds:
 *
 * - Simplified lifecycle hooks (onMount, onUnmount, onUpdate)
 * - Proper cleanup management
 * - Integration with Lit's reactive controller system
 *
 * @example
 * ```typescript
 * import { ComponentControllerMixin } from '../base/component-controller.js';
 * import { DSElement } from '../base/ds-element.js';
 *
 * class DsMyComponent extends ComponentControllerMixin(DSElement) {
 *   protected override onMount(): void {
 *     console.log('Component mounted');
 *     // Set up event listeners, observers, etc.
 *   }
 *
 *   protected override onUnmount(): void {
 *     console.log('Component unmounted');
 *     // Clean up resources
 *   }
 *
 *   protected override onUpdate(changedProps: PropertyValues): void {
 *     console.log('Component updated:', changedProps);
 *   }
 * }
 * ```
 *
 * @packageDocumentation
 */

import type { LitElement, PropertyValues } from "lit";

/**
 * Type for mixin constructor with any args.
 */
// biome-ignore lint/suspicious/noExplicitAny: Mixin pattern requires any[] for constructor args
type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Interface for cleanup function.
 */
export type CleanupFn = () => void;

/**
 * Interface for components using ComponentController mixin.
 */
export interface ComponentControllerInterface {
  /**
   * Register a cleanup function to run on unmount.
   * Returns a function to unregister the cleanup.
   */
  addCleanup(fn: CleanupFn): () => void;

  /**
   * Run all registered cleanup functions and clear the list.
   */
  runCleanups(): void;
}

/**
 * ComponentController mixin for Lit elements.
 *
 * Adds simplified lifecycle hooks that are easier to use than Lit's
 * native lifecycle methods, while providing proper cleanup management.
 *
 * ## Lifecycle Hooks
 *
 * | Hook | When Called | Use For |
 * |------|-------------|---------|
 * | `onMount()` | After first render | Setup: event listeners, observers, API calls |
 * | `onUnmount()` | Before element is removed | Cleanup: remove listeners, cancel timers |
 * | `onUpdate(changedProps)` | After each update | React to prop changes |
 *
 * ## Cleanup Management
 *
 * The mixin provides automatic cleanup tracking via `addCleanup()`:
 *
 * ```typescript
 * protected override onMount(): void {
 *   const observer = new IntersectionObserver(callback);
 *   observer.observe(this);
 *
 *   // Register cleanup - will run automatically on unmount
 *   this.addCleanup(() => observer.disconnect());
 * }
 * ```
 *
 * @param Base - The base Lit element class to extend
 * @returns A new class with lifecycle hooks and cleanup management
 */
export function ComponentControllerMixin<T extends Constructor<LitElement>>(Base: T) {
  abstract class ComponentControllerClass extends Base implements ComponentControllerInterface {
    /**
     * Set of cleanup functions to run on unmount.
     */
    private _cleanupFns = new Set<CleanupFn>();

    /**
     * Whether the component has been mounted (first render complete).
     */
    private _isMounted = false;

    /**
     * Register a cleanup function to run on unmount.
     *
     * @param fn - Cleanup function to run on unmount
     * @returns Function to remove the cleanup (if no longer needed)
     *
     * @example
     * ```typescript
     * protected override onMount(): void {
     *   const controller = new AbortController();
     *
     *   fetch('/api/data', { signal: controller.signal })
     *     .then(handleData);
     *
     *   // Will abort fetch on unmount
     *   this.addCleanup(() => controller.abort());
     * }
     * ```
     */
    addCleanup(fn: CleanupFn): () => void {
      this._cleanupFns.add(fn);
      return () => {
        this._cleanupFns.delete(fn);
      };
    }

    /**
     * Run all registered cleanup functions and clear the list.
     * This is called automatically on unmount.
     */
    runCleanups(): void {
      for (const fn of this._cleanupFns) {
        try {
          fn();
        } catch (error) {
          console.error("Cleanup function failed:", error);
        }
      }
      this._cleanupFns.clear();
    }

    /**
     * Called after the component's first render.
     * Override to set up event listeners, observers, or other resources.
     *
     * @example
     * ```typescript
     * protected override onMount(): void {
     *   // Safe to access DOM here
     *   const input = this.querySelector('input');
     *   input?.addEventListener('input', this.handleInput);
     *
     *   this.addCleanup(() => {
     *     input?.removeEventListener('input', this.handleInput);
     *   });
     * }
     * ```
     */
    protected onMount(): void {
      // Override in subclass
    }

    /**
     * Called before the component is removed from the DOM.
     * Override to clean up resources not registered via addCleanup().
     *
     * Note: Prefer using addCleanup() for cleanup functions.
     * This hook is for cleanup that requires access to component state.
     *
     * @example
     * ```typescript
     * protected override onUnmount(): void {
     *   // Clean up state-dependent resources
     *   this.someExternalService?.unsubscribe(this.id);
     * }
     * ```
     */
    protected onUnmount(): void {
      // Override in subclass
    }

    /**
     * Called after each reactive update.
     * Override to react to property changes.
     *
     * @param changedProperties - PropertyValues map of changed property names to their previous values
     *
     * @example
     * ```typescript
     * protected override onUpdate(changedProperties: Map<string, unknown>): void {
     *   if (changedProperties.has('value')) {
     *     this.dispatchEvent(new CustomEvent('ds:change', {
     *       detail: { value: this.value }
     *     }));
     *   }
     * }
     * ```
     */
    protected onUpdate(_changedProperties: PropertyValues): void {
      // Override in subclass
    }

    /**
     * Lit lifecycle: first update complete.
     */
    protected override firstUpdated(changedProperties: PropertyValues): void {
      super.firstUpdated(changedProperties);
      this._isMounted = true;
      this.onMount();
    }

    /**
     * Lit lifecycle: each update.
     */
    protected override updated(changedProperties: PropertyValues): void {
      super.updated(changedProperties);
      // Only call onUpdate after mount (firstUpdated calls onMount)
      if (this._isMounted) {
        this.onUpdate(changedProperties as PropertyValues);
      }
    }

    /**
     * Lit lifecycle: element disconnected.
     */
    override disconnectedCallback(): void {
      this.onUnmount();
      this.runCleanups();
      this._isMounted = false;
      super.disconnectedCallback();
    }
  }

  return ComponentControllerClass as unknown as Constructor<ComponentControllerInterface & LitElement> & T;
}
