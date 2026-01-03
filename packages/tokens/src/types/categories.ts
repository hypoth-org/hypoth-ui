/**
 * Token category constants
 * 12 standardized categories for design tokens
 */

/** All valid token categories */
export const TOKEN_CATEGORIES = [
  "color",
  "typography",
  "spacing",
  "sizing",
  "border",
  "shadow",
  "motion",
  "opacity",
  "z-index",
  "breakpoint",
  "icon",
  "radius",
] as const;

/** Token category type */
export type TokenCategory = (typeof TOKEN_CATEGORIES)[number];

/** Category descriptions for documentation */
export const CATEGORY_DESCRIPTIONS: Record<TokenCategory, string> = {
  color: "Color values for backgrounds, text, borders, and decorative elements",
  typography: "Font composites including family, size, weight, and line height",
  spacing: "Margin and padding values for layout consistency",
  sizing: "Width and height values for elements",
  border: "Border composites including width, style, and color",
  shadow: "Box shadow values for elevation and depth",
  motion: "Duration and easing values for animations and transitions",
  opacity: "Transparency values for overlays and disabled states",
  "z-index": "Stacking order values for layered elements",
  breakpoint: "Responsive design breakpoint values",
  icon: "Icon sizing and spacing values",
  radius: "Border radius values for rounded corners",
};

/** Check if a string is a valid token category */
export function isTokenCategory(value: string): value is TokenCategory {
  return TOKEN_CATEGORIES.includes(value as TokenCategory);
}

/** Extract category from a token path */
export function getCategoryFromPath(path: string): TokenCategory | null {
  const parts = path.split(".");
  const category = parts[0];
  if (!category) return null;
  return isTokenCategory(category) ? category : null;
}
