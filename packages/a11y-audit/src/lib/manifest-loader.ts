/**
 * Manifest loader
 *
 * Loads component list from the design system manifest
 */

import * as fs from "node:fs";
import * as path from "node:path";

export interface ComponentManifest {
  id: string;
  name: string;
  category?: string;
  status?: "stable" | "beta" | "deprecated";
}

/**
 * Default components list if no manifest is available
 */
const DEFAULT_COMPONENTS = [
  "ds-button",
  "ds-checkbox",
  "ds-dialog",
  "ds-field",
  "ds-icon",
  "ds-input",
  "ds-link",
  "ds-menu",
  "ds-popover",
  "ds-radio",
  "ds-spinner",
  "ds-switch",
  "ds-text",
  "ds-textarea",
  "ds-tooltip",
  "ds-visually-hidden",
];

/**
 * Load components from manifest or use defaults
 */
export function loadComponentList(manifestPath?: string): string[] {
  if (manifestPath && fs.existsSync(manifestPath)) {
    try {
      const content = fs.readFileSync(manifestPath, "utf-8");
      const manifest = JSON.parse(content);

      if (Array.isArray(manifest.components)) {
        return manifest.components.map((c: ComponentManifest) =>
          typeof c === "string" ? c : c.id
        );
      }

      if (Array.isArray(manifest)) {
        return manifest.map((c: ComponentManifest) => (typeof c === "string" ? c : c.id));
      }
    } catch {
      console.warn(`Warning: Could not parse manifest at ${manifestPath}`);
    }
  }

  // Try to discover components from the wc package
  const wcComponentsPath = path.resolve(process.cwd(), "packages/wc/src/components");

  if (fs.existsSync(wcComponentsPath)) {
    const dirs = fs.readdirSync(wcComponentsPath, { withFileTypes: true });
    const components = dirs.filter((d) => d.isDirectory()).map((d) => `ds-${d.name}`);

    if (components.length > 0) {
      return components;
    }
  }

  return DEFAULT_COMPONENTS;
}

/**
 * Get component metadata from manifest
 */
export function getComponentMetadata(
  componentId: string,
  manifestPath?: string
): ComponentManifest | undefined {
  if (!manifestPath || !fs.existsSync(manifestPath)) {
    return undefined;
  }

  try {
    const content = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(content);

    const components = Array.isArray(manifest.components) ? manifest.components : manifest;

    return components.find(
      (c: ComponentManifest) => (typeof c === "string" ? c : c.id) === componentId
    );
  } catch {
    return undefined;
  }
}
