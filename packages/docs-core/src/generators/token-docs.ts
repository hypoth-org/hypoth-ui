/**
 * Token Documentation Generator
 * Generates MDX documentation for design tokens
 */

import { TOKEN_CATEGORIES, type TokenCategory } from "../validation/token-categories.js";

/** Token documentation entry */
export interface TokenDocEntry {
  path: string;
  cssVariable: string;
  type: string;
  description?: string;
  values: Record<string, Record<string, unknown>>;
  usedBy: string[];
}

/** Token category documentation */
export interface TokenCategoryDoc {
  category: TokenCategory;
  title: string;
  description: string;
  tokens: TokenDocEntry[];
}

/** Category titles and descriptions */
const CATEGORY_INFO: Record<TokenCategory, { title: string; description: string }> = {
  color: {
    title: "Color Tokens",
    description: "Color values for backgrounds, text, borders, and decorative elements.",
  },
  typography: {
    title: "Typography Tokens",
    description: "Font composites including family, size, weight, and line height.",
  },
  spacing: {
    title: "Spacing Tokens",
    description: "Margin and padding values for layout consistency.",
  },
  sizing: {
    title: "Sizing Tokens",
    description: "Width and height values for elements.",
  },
  border: {
    title: "Border Tokens",
    description: "Border composites including width, style, and color.",
  },
  shadow: {
    title: "Shadow Tokens",
    description: "Box shadow values for elevation and depth.",
  },
  motion: {
    title: "Motion Tokens",
    description: "Duration and easing values for animations and transitions.",
  },
  opacity: {
    title: "Opacity Tokens",
    description: "Transparency values for overlays and disabled states.",
  },
  "z-index": {
    title: "Z-Index Tokens",
    description: "Stacking order values for layered elements.",
  },
  breakpoint: {
    title: "Breakpoint Tokens",
    description: "Responsive design breakpoint values.",
  },
  icon: {
    title: "Icon Tokens",
    description: "Icon sizing and spacing values.",
  },
  radius: {
    title: "Radius Tokens",
    description: "Border radius values for rounded corners.",
  },
};

/**
 * Generate MDX content for a token category
 */
export function generateTokenCategoryMDX(categoryDoc: TokenCategoryDoc): string {
  const lines: string[] = [];

  // Frontmatter
  lines.push("---");
  lines.push(`title: ${categoryDoc.title}`);
  lines.push(`description: ${categoryDoc.description}`);
  lines.push(`category: ${categoryDoc.category}`);
  lines.push("---");
  lines.push("");

  // Header
  lines.push(`# ${categoryDoc.title}`);
  lines.push("");
  lines.push(categoryDoc.description);
  lines.push("");

  // Token table
  lines.push("## Tokens");
  lines.push("");
  lines.push("| Token | CSS Variable | Value | Used By |");
  lines.push("|-------|--------------|-------|---------|");

  for (const token of categoryDoc.tokens) {
    const value = formatValue(token.values.default?.light);
    const usedBy = token.usedBy.length > 0 ? token.usedBy.join(", ") : "-";
    lines.push(`| \`${token.path}\` | \`${token.cssVariable}\` | ${value} | ${usedBy} |`);
  }

  lines.push("");

  // Usage examples
  lines.push("## Usage");
  lines.push("");
  lines.push("```css");
  lines.push(".example {");
  const firstToken = categoryDoc.tokens[0];
  if (firstToken) {
    lines.push(
      `  ${getCSSPropertyForCategory(categoryDoc.category)}: var(${firstToken.cssVariable});`
    );
  }
  lines.push("}");
  lines.push("```");
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate all token category MDX files
 */
export function generateAllTokenDocs(
  tokens: TokenDocEntry[],
  usageMap: Map<string, string[]>
): Map<TokenCategory, string> {
  const docs = new Map<TokenCategory, string>();

  // Group tokens by category
  const tokensByCategory = new Map<TokenCategory, TokenDocEntry[]>();

  for (const token of tokens) {
    const category = token.path.split(".")[0] as TokenCategory;
    if (!TOKEN_CATEGORIES.includes(category)) continue;

    if (!tokensByCategory.has(category)) {
      tokensByCategory.set(category, []);
    }

    // Add usage info
    const usedBy = usageMap.get(token.path) || [];
    tokensByCategory.get(category)?.push({ ...token, usedBy });
  }

  // Generate MDX for each category
  for (const category of TOKEN_CATEGORIES) {
    const categoryTokens = tokensByCategory.get(category) || [];
    if (categoryTokens.length === 0) continue;

    const info = CATEGORY_INFO[category];
    const categoryDoc: TokenCategoryDoc = {
      category,
      title: info.title,
      description: info.description,
      tokens: categoryTokens.sort((a, b) => a.path.localeCompare(b.path)),
    };

    docs.set(category, generateTokenCategoryMDX(categoryDoc));
  }

  return docs;
}

/**
 * Format a token value for display
 */
function formatValue(value: unknown): string {
  if (value === undefined) return "-";
  if (typeof value === "string") return `\`${value}\``;
  if (typeof value === "number") return `\`${value}\``;
  if (typeof value === "object") return "*(composite)*";
  return String(value);
}

/**
 * Get example CSS property for category
 */
function getCSSPropertyForCategory(category: TokenCategory): string {
  switch (category) {
    case "color":
      return "background-color";
    case "typography":
      return "font";
    case "spacing":
      return "padding";
    case "sizing":
      return "width";
    case "border":
      return "border";
    case "shadow":
      return "box-shadow";
    case "motion":
      return "transition-duration";
    case "opacity":
      return "opacity";
    case "z-index":
      return "z-index";
    case "breakpoint":
      return "width";
    case "icon":
      return "font-size";
    case "radius":
      return "border-radius";
    default:
      return "value";
  }
}
