/**
 * ClientOnly Primitive
 *
 * Utilities for SSR-safe rendering. Prevents hydration mismatches
 * by ensuring certain content only renders on the client.
 */

/**
 * Check if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof window.document !== "undefined"
  );
}

/**
 * Check if we're running in a server environment (Node.js, Deno, etc.)
 */
export function isServer(): boolean {
  return !isBrowser();
}

/**
 * Check if the document is fully loaded and ready
 */
export function isDocumentReady(): boolean {
  if (!isBrowser()) return false;
  return document.readyState === "complete" || document.readyState === "interactive";
}

/**
 * Wait for the document to be ready
 */
export function onDocumentReady(callback: () => void): void {
  if (!isBrowser()) return;

  if (isDocumentReady()) {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  }
}

/**
 * Execute a callback only on the client side.
 * Returns undefined on the server.
 *
 * @example
 * ```typescript
 * const windowWidth = clientOnly(() => window.innerWidth);
 * // windowWidth is undefined on server, number on client
 * ```
 */
export function clientOnly<T>(callback: () => T): T | undefined {
  if (!isBrowser()) return undefined;
  return callback();
}

/**
 * Create a value that's only available on the client.
 * Returns the fallback on the server.
 *
 * @example
 * ```typescript
 * const scrollY = clientValue(() => window.scrollY, 0);
 * // scrollY is 0 on server, actual scroll position on client
 * ```
 */
export function clientValue<T>(callback: () => T, fallback: T): T {
  if (!isBrowser()) return fallback;
  return callback();
}

/**
 * Options for the client-only content controller
 */
export interface ClientOnlyOptions {
  /** Callback when client-side rendering is ready */
  onReady?: () => void;
  /** Delay in ms before showing client content (useful for avoiding flicker) */
  delay?: number;
}

/**
 * Controller for managing client-only content rendering
 */
export interface ClientOnlyController {
  /** Whether we're on the client and ready to render */
  readonly isReady: boolean;
  /** Manually trigger ready state */
  setReady(): void;
  /** Add a callback for when ready */
  onReady(callback: () => void): () => void;
  /** Cleanup */
  destroy(): void;
}

/**
 * Create a controller for managing client-only rendering.
 * Useful for coordinating multiple client-only components.
 *
 * @example
 * ```typescript
 * const controller = createClientOnly({
 *   onReady: () => console.log('Client ready'),
 * });
 *
 * if (controller.isReady) {
 *   // Render client-only content
 * }
 *
 * controller.onReady(() => {
 *   // Do something when ready
 * });
 * ```
 */
export function createClientOnly(
  options: ClientOnlyOptions = {}
): ClientOnlyController {
  const { onReady: onReadyCallback, delay = 0 } = options;

  let isReady = false;
  const readyCallbacks = new Set<() => void>();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function notifyReady() {
    isReady = true;
    onReadyCallback?.();
    for (const callback of readyCallbacks) {
      callback();
    }
  }

  // Initialize on client
  if (isBrowser()) {
    if (delay > 0) {
      timeoutId = setTimeout(notifyReady, delay);
    } else {
      // Use microtask to ensure we're past any initial render
      queueMicrotask(notifyReady);
    }
  }

  return {
    get isReady() {
      return isReady;
    },

    setReady() {
      if (!isReady) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        notifyReady();
      }
    },

    onReady(callback: () => void): () => void {
      if (isReady) {
        callback();
        return () => {};
      }

      readyCallbacks.add(callback);
      return () => {
        readyCallbacks.delete(callback);
      };
    },

    destroy() {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      readyCallbacks.clear();
    },
  };
}

/**
 * Hook-like function for use in Web Components.
 * Returns true only after the component has mounted on the client.
 *
 * @example
 * ```typescript
 * class MyComponent extends LitElement {
 *   private clientOnly = useClientOnly();
 *
 *   render() {
 *     if (!this.clientOnly.isReady) {
 *       return html`<slot name="fallback"></slot>`;
 *     }
 *     return html`<slot></slot>`;
 *   }
 *
 *   connectedCallback() {
 *     super.connectedCallback();
 *     this.clientOnly.activate();
 *   }
 *
 *   disconnectedCallback() {
 *     super.disconnectedCallback();
 *     this.clientOnly.deactivate();
 *   }
 * }
 * ```
 */
export function useClientOnly(): {
  isReady: boolean;
  activate: () => void;
  deactivate: () => void;
} {
  let isReady = false;
  let rafId: number | null = null;

  return {
    get isReady() {
      return isReady;
    },

    activate() {
      if (isBrowser() && !isReady) {
        // Use rAF to ensure we're past initial render
        rafId = requestAnimationFrame(() => {
          isReady = true;
          rafId = null;
        });
      }
    },

    deactivate() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      isReady = false;
    },
  };
}
