/**
 * Component registry utilities
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { ComponentDefinition, ComponentRegistry, Framework } from "../types/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Path to bundled registry (relative to built output in dist/)
// When built, __dirname is packages/cli/dist, so we go up one level to packages/cli/registry
const BUNDLED_REGISTRY_PATH = join(__dirname, "../registry/components.json");

// Remote registry URL (for updates)
const REMOTE_REGISTRY_URL = "https://hypoth-ui.dev/registry/components.json";

/**
 * Load the bundled component registry
 */
export function loadBundledRegistry(): ComponentRegistry {
  try {
    const content = readFileSync(BUNDLED_REGISTRY_PATH, "utf-8");
    return JSON.parse(content) as ComponentRegistry;
  } catch (error) {
    throw new Error(`Failed to load bundled registry: ${(error as Error).message}`);
  }
}

/**
 * Fetch remote registry (with fallback to bundled)
 */
export async function fetchRegistry(): Promise<ComponentRegistry> {
  try {
    const response = await fetch(REMOTE_REGISTRY_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as ComponentRegistry;
  } catch {
    // Fall back to bundled registry
    return loadBundledRegistry();
  }
}

/**
 * Get a component definition by name
 */
export function getComponent(
  registry: ComponentRegistry,
  name: string
): ComponentDefinition | undefined {
  const normalizedName = name.toLowerCase();
  return registry.components.find((c) => c.name.toLowerCase() === normalizedName);
}

/**
 * Get all component names
 */
export function getComponentNames(registry: ComponentRegistry): string[] {
  return registry.components.map((c) => c.name);
}

/**
 * Check if a component exists in the registry
 */
export function componentExists(registry: ComponentRegistry, name: string): boolean {
  return getComponent(registry, name) !== undefined;
}

/**
 * Get components compatible with a framework
 */
export function getComponentsForFramework(
  registry: ComponentRegistry,
  framework: Framework
): ComponentDefinition[] {
  const frameworkMap: Record<Framework, "react" | "wc"> = {
    react: "react",
    next: "react", // Next.js uses React components
    wc: "wc",
    vanilla: "wc", // Vanilla uses Web Components
  };

  const targetFramework = frameworkMap[framework];
  return registry.components.filter((c) => c.frameworks.includes(targetFramework));
}

/**
 * Resolve all dependencies for a list of components
 * Returns components in installation order (dependencies first)
 */
export function resolveDependencies(
  registry: ComponentRegistry,
  componentNames: string[]
): ComponentDefinition[] {
  const resolved = new Map<string, ComponentDefinition>();
  const visiting = new Set<string>();

  function visit(name: string): void {
    const normalizedName = name.toLowerCase();

    if (resolved.has(normalizedName)) {
      return;
    }

    if (visiting.has(normalizedName)) {
      throw new Error(`Circular dependency detected: ${name}`);
    }

    const component = getComponent(registry, name);
    if (!component) {
      throw new Error(`Component not found in registry: ${name}`);
    }

    visiting.add(normalizedName);

    // Visit dependencies first
    for (const dep of component.registryDependencies) {
      visit(dep);
    }

    visiting.delete(normalizedName);
    resolved.set(normalizedName, component);
  }

  for (const name of componentNames) {
    visit(name);
  }

  return Array.from(resolved.values());
}

/**
 * Get npm dependencies for a list of components (deduplicated)
 */
export function getNpmDependencies(components: ComponentDefinition[]): string[] {
  const deps = new Set<string>();

  for (const component of components) {
    for (const dep of component.dependencies) {
      deps.add(dep);
    }
  }

  return Array.from(deps);
}

/**
 * Check if component is compatible with framework
 */
export function isComponentCompatible(
  component: ComponentDefinition,
  framework: Framework
): boolean {
  const frameworkMap: Record<Framework, "react" | "wc"> = {
    react: "react",
    next: "react",
    wc: "wc",
    vanilla: "wc",
  };

  return component.frameworks.includes(frameworkMap[framework]);
}
