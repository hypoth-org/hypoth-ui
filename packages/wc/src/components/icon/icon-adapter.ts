/**
 * Icon Adapter for Lucide Icons
 *
 * Provides a unified interface for accessing icons from the Lucide library.
 * Uses a bundler-opaque dynamic import so lucide is only loaded when the Icon
 * component is actually used. Consumers who don't use <ds-icon> don't need
 * lucide installed — the build will not fail and no "Module not found" error
 * will be emitted.
 */

type LucideModule = typeof import("lucide");

let _lucide: LucideModule | null = null;
let _loadPromise: Promise<LucideModule | null> | null = null;
let _loadFailed = false;

/**
 * Lazily load the lucide module. Returns null if lucide is not installed.
 *
 * The `webpackIgnore` magic comment tells webpack (and Next.js, which uses
 * webpack under the hood) to skip static resolution of this import at build
 * time. Without it, consumers who don't have lucide installed get a hard
 * "Module not found: Can't resolve 'lucide'" build error even though lucide
 * is an optional peer dependency.
 */
async function loadLucide(): Promise<LucideModule | null> {
  if (_lucide) return _lucide;
  if (_loadFailed) return null;

  if (!_loadPromise) {
    _loadPromise = import(/* webpackIgnore: true */ "lucide")
      .then((mod) => {
        _lucide = mod;
        return mod;
      })
      .catch(() => {
        _loadFailed = true;
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            '[ds-icon] "lucide" is not installed. Install it to use the Icon component:\n  npm install lucide'
          );
        }
        return null;
      });
  }

  return _loadPromise;
}

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
 * Returns null if lucide is not installed or icon not found.
 *
 * @param name - The icon name in kebab-case (e.g., "arrow-right", "search", "external-link")
 * @param options - Optional attributes to apply to the SVG
 * @returns SVGSVGElement or null if icon not found
 */
export async function getIconSvg(
  name: string,
  options?: {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }
): Promise<SVGSVGElement | null> {
  const lucide = await loadLucide();
  if (!lucide) return null;

  const pascalName = toPascalCase(name);
  const iconNode = lucide.icons[pascalName as keyof typeof lucide.icons] as
    | import("lucide").IconNode
    | undefined;

  if (!iconNode) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[ds-icon] Icon "${name}" not found in Lucide library.`);
    }
    return null;
  }

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

  const [tag, defaultAttrs, children] = iconNode;
  const mergedAttrs = { ...defaultAttrs, ...customAttrs };
  const modifiedIconNode: import("lucide").IconNode = children
    ? [tag, mergedAttrs, children]
    : [tag, mergedAttrs];

  const element = lucide.createElement(modifiedIconNode);

  return element as SVGSVGElement;
}

/**
 * Check if an icon name exists in the Lucide library.
 *
 * @param name - The icon name in kebab-case
 * @returns True if the icon exists
 */
export async function hasIcon(name: string): Promise<boolean> {
  const lucide = await loadLucide();
  if (!lucide) return false;
  const pascalName = toPascalCase(name);
  return pascalName in lucide.icons;
}

/**
 * Get all available icon names.
 *
 * @returns Array of icon names in kebab-case
 */
export async function getAvailableIcons(): Promise<string[]> {
  const lucide = await loadLucide();
  if (!lucide) return [];
  return Object.keys(lucide.icons).map((name) =>
    name
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/^-/, "")
  );
}
