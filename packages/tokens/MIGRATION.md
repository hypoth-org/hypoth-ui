# Token Migration Guide

This document tracks the transition to the new 16-step color scale and density system.

## Overview

The design system is adopting:
- **16-step color scales** (replacing 11-step Tailwind-like scales)
- **Density modes** (compact, default, spacious)
- **rem-based spacing** (all px values converted)

## Color Scale Migration

### Old Format (11-step, Tailwind-like)
```json
{
  "blue": {
    "50": "#eff6ff",
    "100": "#dbeafe",
    "200": "#bfdbfe",
    ...
    "900": "#1e3a8a",
    "950": "#172554"
  }
}
```

### New Format (16-step)
```json
{
  "blue": {
    "1": "#fafcff",   // Page background
    "2": "#f5f9ff",   // Raised surface
    "3": "#edf4ff",   // Nested surface
    "4": "#e1edff",   // Deep nested
    "5": "#d3e4ff",   // Element background
    "6": "#c1d9ff",   // Element hover
    "7": "#a8c8ff",   // Element active
    "8": "#8ab4ff",   // Subtle border
    "9": "#6a9eff",   // Default border
    "10": "#4a88ff",  // Strong border
    "11": "#0066cc",  // Solid default
    "12": "#0059b3",  // Solid hover
    "13": "#004d99",  // Solid active
    "14": "#004080",  // Solid emphasis
    "15": "#003366",  // Muted text
    "16": "#001d3d"   // Default text
  }
}
```

### Step Mapping Guide

| Old Step | Purpose | New Step |
|----------|---------|----------|
| 50 | Lightest bg | 1-2 |
| 100-200 | Light bg | 3-4 |
| 300-400 | Interactive bg | 5-7 |
| 500 | Border | 8-9 |
| 600 | Strong border | 10 |
| 700 | Solid color | 11-12 |
| 800 | Solid hover | 13 |
| 900 | Dark solid | 14 |
| 950 | Text | 15-16 |

### Benefits of 16-step Scale

1. **Better layering**: 4 background levels (1-4) vs 2 in old system
2. **More interactive states**: 3 levels (5-7) for normal/hover/active
3. **Richer solid colors**: 4 levels (11-14) for more button states
4. **Consistent text**: 2 levels (15-16) for muted and default text

## Density System

### Token Structure

Density tokens are organized in three modes:
- `compact.json` - Tighter spacing for data-dense UIs
- `default.json` - Balanced spacing for general use
- `spacious.json` - Generous spacing for readability

### Spacing Scale Comparison

| Scale | Compact | Default | Spacious |
|-------|---------|---------|----------|
| 1 | 0.125rem | 0.25rem | 0.375rem |
| 2 | 0.25rem | 0.5rem | 0.75rem |
| 4 | 0.5rem | 1rem | 1.25rem |
| 8 | 1rem | 2rem | 2.5rem |

### Component Tokens

Each density mode defines component-specific tokens:
- Button padding/height
- Input padding/height
- Card padding
- List item spacing
- Table cell padding
- Icon sizes

## px to rem Conversion Audit

### Already Converted (rem units)
- `global/spacing.json` - All values use rem

### Files Using Hardcoded px (to migrate)
The following token files may contain px values:
- Check `global/sizing.json`
- Check `global/border.json`
- Check component-specific tokens in primitives/

### Conversion Formula
```
rem = px / 16
```

Common conversions:
| px | rem |
|----|-----|
| 4px | 0.25rem |
| 8px | 0.5rem |
| 12px | 0.75rem |
| 16px | 1rem |
| 20px | 1.25rem |
| 24px | 1.5rem |
| 32px | 2rem |
| 48px | 3rem |

## CSS Output Files

After migration, the build produces:
- `dist/css/tokens.css` - Base tokens
- `dist/css/colors.css` - 16-step color scales
- `dist/css/density.css` - Density mode variants

## Usage After Migration

### CSS Custom Properties
```css
/* Colors use step-based naming */
background: var(--ds-color-blue-2);
color: var(--ds-color-blue-16);
border-color: var(--ds-color-blue-9);

/* Semantic colors reference primitives */
background: var(--ds-color-primary-subtle);
color: var(--ds-color-primary-default);

/* Density-aware spacing */
padding: var(--ds-spacing-4);
gap: var(--ds-spacing-2);
```

### HTML Data Attributes
```html
<!-- Color mode -->
<html data-color-mode="dark">

<!-- Density mode -->
<html data-density="compact">
```

## Migration Steps

1. Update component styles to use new color scale (1-16 instead of 50-950)
2. Replace semantic color references with new aliases
3. Ensure all spacing uses density-aware tokens
4. Test with all three density modes
5. Test with light/dark color modes
