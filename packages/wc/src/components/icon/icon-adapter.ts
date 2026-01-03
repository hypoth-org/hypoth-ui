/**
 * Icon Adapter for Lucide Icons
 *
 * Provides a unified interface for accessing icons from the Lucide library.
 * Uses createElement() for efficient SVG generation.
 */

import { createElement, icons } from "lucide";
import type { IconNode } from "lucide";

/**
 * Convert kebab-case to PascalCase for Lucide icon names
 * e.g., "arrow-right" -> "ArrowRight"
 */
function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Get an SVG element for the specified icon name.
 *
 * @param name - The icon name in kebab-case (e.g., "arrow-right", "search", "external-link")
 * @param options - Optional attributes to apply to the SVG
 * @returns SVGSVGElement or null if icon not found
 *
 * @example
 * ```typescript
 * const svg = getIconSvg("search");
 * if (svg) {
 *   container.appendChild(svg);
 * }
 * ```
 */
export function getIconSvg(
  name: string,
  options?: {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }
): SVGSVGElement | null {
  // Convert kebab-case name to PascalCase for Lucide lookup
  const pascalName = toPascalCase(name);

  // Check if icon exists in Lucide
  const iconNode = icons[pascalName as keyof typeof icons] as IconNode | undefined;

  if (!iconNode) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[ds-icon] Icon "${name}" not found in Lucide library.`);
    }
    return null;
  }

  // Build custom attributes to merge with default icon attrs
  const customAttrs: Record<string, string | number> = {};

  if (options?.size) {
    customAttrs.width = options.size;
    customAttrs.height = options.size;
  }

  if (options?.color) {
    customAttrs.color = options.color;
  }

  if (options?.strokeWidth) {
    customAttrs["stroke-width"] = options.strokeWidth;
  }

  // Merge custom attributes with the icon's default attributes
  // IconNode is [tag, attrs, children?]
  const [tag, defaultAttrs, children] = iconNode;
  const mergedAttrs = { ...defaultAttrs, ...customAttrs };
  const modifiedIconNode: IconNode = children ? [tag, mergedAttrs, children] : [tag, mergedAttrs];

  const element = createElement(modifiedIconNode);

  return element as SVGSVGElement;
}

/**
 * Check if an icon name exists in the Lucide library.
 *
 * @param name - The icon name in kebab-case
 * @returns True if the icon exists
 */
export function hasIcon(name: string): boolean {
  const pascalName = toPascalCase(name);
  return pascalName in icons;
}

/**
 * Get all available icon names.
 *
 * @returns Array of icon names in kebab-case
 */
export function getAvailableIcons(): string[] {
  return Object.keys(icons).map((name) =>
    name
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/^-/, "")
  );
}
