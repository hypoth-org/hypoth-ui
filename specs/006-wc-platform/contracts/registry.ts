/**
 * Component Registry API Contract
 * Centralized mapping of tag names to component classes
 *
 * @package @ds/wc
 * @path packages/wc/src/registry/registry.ts
 */

/**
 * Custom element constructor type
 */
export type CustomElementConstructor = new (...args: unknown[]) => HTMLElement;

/**
 * Component registry type
 * Maps custom element tag names to their class constructors
 */
export type ComponentRegistryType = Record<string, CustomElementConstructor>;

/**
 * The centralized component registry
 *
 * All design system components MUST be registered here.
 * Components are NOT self-registering - the loader uses this registry.
 *
 * @example
 * ```typescript
 * export const componentRegistry = {
 *   'ds-button': DsButton,
 *   'ds-input': DsInput,
 *   'ds-card': DsCard,
 * } as const satisfies ComponentRegistryType;
 * ```
 */
export declare const componentRegistry: ComponentRegistryType;

/**
 * Get all registered tag names
 *
 * @returns Array of tag names in the registry
 */
export declare function getRegisteredTags(): string[];

/**
 * Get component class by tag name
 *
 * @param tagName - The custom element tag name
 * @returns The component class or undefined if not found
 */
export declare function getComponentClass(tagName: string): CustomElementConstructor | undefined;
