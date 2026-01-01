import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  useEffect,
  useRef,
} from "react";

/**
 * Factory for creating React wrapper components around Web Components.
 * Handles ref forwarding and property/attribute synchronization.
 */

export interface WrapperConfig<P extends Record<string, unknown>> {
  /** The custom element tag name */
  tagName: string;
  /** Properties to sync to the element */
  properties?: (keyof P)[];
  /** Event name mappings: React prop name → DOM event name */
  events?: Record<string, string>;
}

/**
 * Creates a React wrapper component for a Web Component.
 * Handles property synchronization and event forwarding.
 */
export function createComponent<
  E extends HTMLElement,
  P extends Record<string, unknown> = Record<string, unknown>,
>(config: WrapperConfig<P>) {
  const { tagName, properties = [], events = {} } = config;

  type WrapperProps = P &
    ComponentPropsWithoutRef<ElementType> & {
      children?: React.ReactNode;
    };

  const Component = forwardRef<E, WrapperProps>((props, forwardedRef) => {
    const internalRef = useRef<E>(null);

    // Merge refs
    const mergedRef = (element: E | null) => {
      (internalRef as React.MutableRefObject<E | null>).current = element;

      if (typeof forwardedRef === "function") {
        forwardedRef(element);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<E | null>).current = element;
      }
    };

    // Sync properties to element
    useEffect(() => {
      const element = internalRef.current;
      if (!element) return;

      for (const prop of properties) {
        const value = props[prop];
        if (value !== undefined) {
          (element as unknown as Record<string, unknown>)[prop as string] = value;
        }
      }
    }, [props]);

    // Attach event listeners
    useEffect(() => {
      const element = internalRef.current;
      if (!element) return;

      const listeners: (() => void)[] = [];

      for (const [reactProp, domEvent] of Object.entries(events)) {
        const handler = props[reactProp as keyof typeof props] as
          | ((event: Event) => void)
          | undefined;
        if (handler) {
          element.addEventListener(domEvent, handler);
          listeners.push(() => element.removeEventListener(domEvent, handler));
        }
      }

      return () => {
        for (const cleanup of listeners) {
          cleanup();
        }
      };
    }, [props]);

    // Extract known props from rest
    const elementProps: Record<string, unknown> = {};
    const restProps: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props)) {
      if (properties.includes(key as keyof P) || key in events) {
      } else if (key === "children" || key === "className" || key === "style") {
        elementProps[key] = value;
      } else {
        restProps[key] = value;
      }
    }

    // Use React.createElement for dynamic tag
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require("react");
    return React.createElement(
      tagName,
      { ref: mergedRef, ...elementProps, ...restProps },
      props.children
    );
  });

  Component.displayName = `React(${tagName})`;

  return Component;
}
