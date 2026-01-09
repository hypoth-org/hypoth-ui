# 16-Step Color Scales

This document describes the design system's 16-step color scale system and provides guidance on using colors effectively and accessibly.

## Overview

Each color in the design system has 16 steps, ranging from very light (step 1) to very dark (step 16). This provides consistent, perceptually-uniform color progressions generated using the OKLCH color space.

## Step Purposes

| Steps | Lightness Range | Purpose | Example Uses |
|-------|-----------------|---------|--------------|
| 1-4   | Very Light      | Backgrounds | Page backgrounds, cards, modals |
| 5-7   | Light           | Interactive backgrounds | Hover states, selected items, subtle fills |
| 8-10  | Medium          | Borders | Input borders, dividers, outlines |
| 11-14 | Solid           | Primary fills | Buttons, badges, solid backgrounds |
| 15-16 | Dark            | Text | Headings, body text, icons |

### Detailed Step Guide

| Step | Description | Typical Use |
|------|-------------|-------------|
| 1 | Page background | Main page/app background |
| 2 | Raised surface | Cards, modals, popovers |
| 3 | Nested surface | Nested cards, code blocks |
| 4 | Deep nested | Deeply nested elements, well |
| 5 | Element background | Input backgrounds, toggle backgrounds |
| 6 | Element hover | Hover state for step 5 elements |
| 7 | Element active | Active/pressed state |
| 8 | Subtle border | Subtle dividers, disabled borders |
| 9 | Default border | Standard input borders, dividers |
| 10 | Strong border | Focused borders, emphasis |
| 11 | Solid default | Primary button, badge, tag |
| 12 | Solid hover | Hover state for solid elements |
| 13 | Solid active | Active/pressed state for solid elements |
| 14 | Solid emphasis | High emphasis elements |
| 15 | Muted text | Secondary text, placeholders |
| 16 | Default text | Primary text, headings |

## Available Color Scales

### Semantic Colors

| Color | Scale | Primary Use |
|-------|-------|-------------|
| Blue | `--ds-color-blue-*` | Primary actions, links, focus states |
| Gray | `--ds-color-gray-*` | Neutral UI, text, borders |
| Green | `--ds-color-green-*` | Success states, positive feedback |
| Red | `--ds-color-red-*` | Error states, destructive actions |
| Yellow | `--ds-color-yellow-*` | Warning states, caution |
| Purple | `--ds-color-purple-*` | Accent, highlight |
| Orange | `--ds-color-orange-*` | Attention, notifications |
| Cyan | `--ds-color-cyan-*` | Information, links (alternative) |
| Pink | `--ds-color-pink-*` | Decorative, accent (alternative) |

## Usage Examples

### CSS Custom Properties

```css
/* Text on page background */
.page {
  background-color: var(--ds-color-gray-1);
  color: var(--ds-color-gray-16);
}

/* Card with subtle border */
.card {
  background-color: var(--ds-color-gray-2);
  border: 1px solid var(--ds-color-gray-8);
}

/* Primary button */
.button-primary {
  background-color: var(--ds-color-blue-11);
  color: var(--ds-color-blue-1);
}

.button-primary:hover {
  background-color: var(--ds-color-blue-12);
}

/* Input field */
.input {
  background-color: var(--ds-color-gray-1);
  border: 1px solid var(--ds-color-gray-9);
}

.input:focus {
  border-color: var(--ds-color-blue-10);
}

/* Success message */
.alert-success {
  background-color: var(--ds-color-green-3);
  border-color: var(--ds-color-green-9);
  color: var(--ds-color-green-16);
}
```

### React/TypeScript

```tsx
import { tokens } from '@ds/tokens';

// Access color values programmatically
const primaryColor = tokens.colors.blue[11];
const textColor = tokens.colors.gray[16];
```

## Contrast Guidelines

### WCAG Requirements

- **AA Normal Text**: 4.5:1 minimum contrast ratio
- **AA Large Text**: 3:1 minimum (14pt bold or 18pt regular)
- **AAA Normal Text**: 7:1 minimum contrast ratio
- **AAA Large Text**: 4.5:1 minimum

### Recommended Pairings

#### Text on Light Backgrounds

| Background | Foreground | Contrast | Level |
|------------|------------|----------|-------|
| Step 1-2 | Step 16 | ~15:1 | AAA |
| Step 1-2 | Step 15 | ~10:1 | AAA |
| Step 3-4 | Step 16 | ~12:1 | AAA |
| Step 3-4 | Step 15 | ~8:1 | AAA |

#### Button Text (Light on Solid)

| Background | Foreground | Contrast | Level |
|------------|------------|----------|-------|
| Step 11 | Step 1-2 | ~7:1 | AAA |
| Step 12 | Step 1-2 | ~9:1 | AAA |
| Step 13 | Step 1-2 | ~11:1 | AAA |

#### Borders on Light Backgrounds

| Background | Border | Contrast | Level |
|------------|--------|----------|-------|
| Step 1-2 | Step 8 | ~3:1 | AA Large |
| Step 1-2 | Step 9 | ~4:1 | AA |
| Step 1-2 | Step 10 | ~5:1 | AA |

## Dark Mode

In dark mode, color steps are inverted symmetrically:

- Light mode step 1 maps to dark mode step 16
- Light mode step 2 maps to dark mode step 15
- And so on...

This ensures consistent contrast ratios and visual hierarchy in both modes.

### Dark Mode Variables

```css
/* Dark mode overrides */
[data-theme="dark"] {
  --ds-color-gray-1: var(--ds-color-gray-16-dark);
  --ds-color-gray-2: var(--ds-color-gray-15-dark);
  /* ... */
}
```

## OKLCH Color Space

The color scales are generated using OKLCH (Oklab Lightness, Chroma, Hue), which provides:

1. **Perceptual uniformity**: Equal steps in lightness appear equally different to human vision
2. **Consistent saturation**: Chroma is maintained appropriately across the lightness range
3. **Gamut awareness**: Colors are mapped to fit within the sRGB gamut

### Why OKLCH?

- HSL lightness is not perceptually uniform (50% L appears different for different hues)
- RGB interpolation creates muddy middle values
- OKLCH ensures consistent visual steps regardless of hue

## Accessibility Best Practices

1. **Always verify contrast** before using color combinations
2. **Don't rely on color alone** - use icons, patterns, or text labels
3. **Test with color blindness simulators** - especially for red/green combinations
4. **Use step 16 for primary text** on light backgrounds
5. **Use step 1-2 for text on solid fills** (steps 11-14)
6. **Reserve steps 11-14 for interactive elements** that need to stand out

## Tools

### Contrast Calculator

Use the contrast calculator script to check specific pairings:

```bash
# From packages/tokens directory
npx tsx scripts/contrast.ts
```

### Scale Generator

Regenerate scales with custom parameters:

```bash
# From packages/tokens directory
npx tsx scripts/generate-scales.ts
```

## See Also

- [Contrast Pairings](./contrast-pairings.md) - Full contrast ratio matrix
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [OKLCH Color Space](https://bottosson.github.io/posts/oklab/)
