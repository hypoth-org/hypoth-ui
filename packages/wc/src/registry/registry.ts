/**
 * Component Registry - Centralized mapping of tag names to component classes.
 *
 * This registry is the single source of truth for all design system component registrations.
 * Components do NOT self-register; instead, the loader uses this registry to register
 * components when the application starts.
 */

import type { DsButton } from "../components/button/button.js";
import type { DsInput } from "../components/input/input.js";

/**
 * Custom element constructor type
 */
export type CustomElementConstructor = new (...args: unknown[]) => HTMLElement;

/**
 * Component registry type - maps tag names to component classes
 */
export type ComponentRegistryType = Record<string, CustomElementConstructor>;

/**
 * Valid component tag names in the design system
 */
export type ComponentTag = "ds-button" | "ds-input";

/**
 * Lazy loader type for dynamic imports
 */
type ComponentLoader = () => Promise<{ default: CustomElementConstructor } | CustomElementConstructor>;

/**
 * Registry entry that supports lazy loading
 */
interface RegistryEntry {
  /** Component class (populated after loading) */
  class?: CustomElementConstructor;
  /** Lazy loader function */
  loader?: ComponentLoader;
}

/**
 * Internal registry storage
 */
const registry = new Map<string, RegistryEntry>();

/**
 * Initialize the registry with component mappings.
 * This is called internally and populates the registry with all known components.
 */
function initializeRegistry(): void {
  // Register components with lazy loaders for tree-shaking support
  registry.set("ds-button", {
    loader: async () => {
      const mod = await import("../components/button/button.js");
      return mod.DsButton;
    },
  });

  registry.set("ds-input", {
    loader: async () => {
      const mod = await import("../components/input/input.js");
      return mod.DsInput;
    },
  });
}

// Initialize on module load
initializeRegistry();

/**
 * Get all registered tag names.
 *
 * @returns Array of all tag names in the registry
 */
export function getRegisteredTags(): ComponentTag[] {
  return Array.from(registry.keys()) as ComponentTag[];
}

/**
 * Get component class by tag name.
 * If the component uses lazy loading, this will trigger the load.
 *
 * @param tagName - The custom element tag name
 * @returns Promise resolving to the component class or undefined if not found
 */
export async function getComponentClass(
  tagName: string,
): Promise<CustomElementConstructor | undefined> {
  const entry = registry.get(tagName);
  if (!entry) return undefined;

  // Return cached class if already loaded
  if (entry.class) return entry.class;

  // Load class if loader exists
  if (entry.loader) {
    const result = await entry.loader();
    const componentClass = "default" in result ? result.default : result;
    entry.class = componentClass as CustomElementConstructor;
    return entry.class;
  }

  return undefined;
}

/**
 * Get component class synchronously (only works for already-loaded components).
 *
 * @param tagName - The custom element tag name
 * @returns The component class or undefined if not loaded/found
 */
export function getComponentClassSync(tagName: string): CustomElementConstructor | undefined {
  const entry = registry.get(tagName);
  return entry?.class;
}

/**
 * Register a component class directly (for pre-loaded components).
 *
 * @param tagName - The custom element tag name
 * @param componentClass - The component class constructor
 */
export function registerComponent(
  tagName: string,
  componentClass: CustomElementConstructor,
): void {
  registry.set(tagName, { class: componentClass });
}

/**
 * Check if a tag name is in the registry.
 *
 * @param tagName - The custom element tag name
 * @returns True if the tag is registered
 */
export function hasComponent(tagName: string): boolean {
  return registry.has(tagName);
}

/**
 * Load all components in the registry.
 * This is useful for eager loading all components at once.
 *
 * @returns Promise that resolves when all components are loaded
 */
export async function loadAllComponents(): Promise<void> {
  const tags = getRegisteredTags();
  await Promise.all(tags.map((tag) => getComponentClass(tag)));
}

// Type declarations for components
declare global {
  interface HTMLElementTagNameMap {
    "ds-button": DsButton;
    "ds-input": DsInput;
  }
}
