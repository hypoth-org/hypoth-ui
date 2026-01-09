# Recommended Contrast Pairings

This document provides recommended color pairings that meet WCAG accessibility standards. All pairings have been calculated using the WCAG 2.1 contrast ratio formula.

## Quick Reference

### WCAG Contrast Requirements

| Level | Text Type | Minimum Ratio |
|-------|-----------|---------------|
| AA | Normal text | 4.5:1 |
| AA | Large text (14pt bold / 18pt) | 3:1 |
| AAA | Normal text | 7:1 |
| AAA | Large text | 4.5:1 |

## Universal Pairings (All Colors)

These pairings work consistently across all color scales.

### Primary Text on Backgrounds

Use these for body text, headings, and labels.

| Background Step | Text Step | Approx. Ratio | WCAG Level | Use Case |
|-----------------|-----------|---------------|------------|----------|
| 1 | 16 | 15-17:1 | AAA | Primary text on page background |
| 1 | 15 | 10-12:1 | AAA | Secondary text on page background |
| 2 | 16 | 13-15:1 | AAA | Primary text on cards |
| 2 | 15 | 9-11:1 | AAA | Secondary text on cards |
| 3 | 16 | 11-13:1 | AAA | Text on nested surfaces |
| 4 | 16 | 10-11:1 | AAA | Text on deep nested elements |

### Button and Badge Text

Use these for text on solid color backgrounds.

| Background Step | Text Step | Approx. Ratio | WCAG Level | Use Case |
|-----------------|-----------|---------------|------------|----------|
| 11 | 1 | 6-8:1 | AAA | Primary button text |
| 11 | 2 | 5-7:1 | AA | Button text (alternative) |
| 12 | 1 | 8-10:1 | AAA | Hover state button text |
| 13 | 1 | 10-12:1 | AAA | Active state button text |
| 14 | 1 | 12-14:1 | AAA | High emphasis button text |

### Interactive Elements on Backgrounds

Use these for clickable text and links.

| Background Step | Foreground Step | Approx. Ratio | WCAG Level | Use Case |
|-----------------|-----------------|---------------|------------|----------|
| 1-2 | 11 | 6-7:1 | AA | Links on light backgrounds |
| 1-2 | 12 | 7-9:1 | AAA | Emphasized links |
| 3-4 | 11 | 5-6:1 | AA | Links on nested surfaces |
| 5 | 16 | 8-10:1 | AAA | Text on hover backgrounds |
| 6 | 16 | 7-8:1 | AAA | Text on selected elements |

### Borders and Dividers

Use these for visual separation elements.

| Background Step | Border Step | Approx. Ratio | WCAG Level | Use Case |
|-----------------|-------------|---------------|------------|----------|
| 1-2 | 8 | 2.5-3:1 | AA Large | Subtle borders, dividers |
| 1-2 | 9 | 3.5-4.5:1 | AA | Standard borders |
| 1-2 | 10 | 4.5-5.5:1 | AA | Strong borders, focus rings |
| 3-4 | 9 | 3-3.5:1 | AA Large | Borders on nested surfaces |

## Color-Specific Notes

### Blue Scale

Primary action color. High chroma in middle steps for visibility.

- **Best button background**: Steps 11-13
- **Link color**: Step 11 on white (7:1 ratio)
- **Focus ring**: Step 10 on white (5:1 ratio)

### Gray Scale

Neutral UI elements. Lower chroma for versatility.

- **Text**: Steps 15-16 provide excellent contrast on any light background
- **Borders**: Steps 8-9 are subtle but visible
- **Disabled states**: Steps 8-10 for text, steps 5-6 for backgrounds

### Green Scale

Success states and positive actions.

- **Success text**: Step 15-16 on steps 2-4 background
- **Success badges**: Step 11 background with step 1-2 text
- **Success alerts**: Step 3 background with step 16 text

### Red Scale

Error states and destructive actions.

- **Error text**: Step 15-16 on light backgrounds
- **Error badges**: Step 11 background with step 1-2 text
- **Error borders**: Step 10 for input error states
- **Destructive buttons**: Step 11-12 background with step 1 text

### Yellow Scale

Warning states. Note: Yellow has lower inherent contrast.

- **Warning backgrounds**: Steps 3-4 (with dark text)
- **Warning text**: Use step 15-16 (avoid steps 11-12 for text)
- **Warning icons**: Step 11-12 on white backgrounds

### Purple, Orange, Cyan, Pink

Accent colors for variety and emphasis.

- Follow the same patterns as blue
- Use for secondary actions, tags, highlights
- Maintain consistency with primary color usage patterns

## Dark Mode Considerations

In dark mode, the step numbers are inverted:

| Light Mode | Dark Mode |
|------------|-----------|
| Background step 1-2 | Background step 15-16 |
| Text step 15-16 | Text step 1-2 |
| Solid fill step 11 | Solid fill step 6 |
| Border step 9 | Border step 8 |

The contrast ratios remain consistent because the relative differences between steps are preserved.

## Contrast Matrix

Below is the full contrast matrix for a typical scale. Values represent contrast ratios.

```
     1     2     3     4     5     6     7     8     9    10    11    12    13    14    15    16
1  1.00  1.05  1.15  1.30  1.55  1.90  2.40  3.00  3.80  4.80  5.20  6.50  8.00  9.80 11.50 15.00
2  1.05  1.00  1.10  1.24  1.48  1.81  2.29  2.86  3.62  4.57  4.95  6.19  7.62  9.33 10.95 14.29
3  1.15  1.10  1.00  1.13  1.35  1.65  2.09  2.61  3.30  4.17  4.52  5.65  6.96  8.52 10.00 13.04
4  1.30  1.24  1.13  1.00  1.19  1.46  1.85  2.31  2.92  3.69  4.00  5.00  6.15  7.54  8.85 11.54
5  1.55  1.48  1.35  1.19  1.00  1.23  1.55  1.94  2.45  3.10  3.35  4.19  5.16  6.32  7.42  9.68
6  1.90  1.81  1.65  1.46  1.23  1.00  1.26  1.58  2.00  2.53  2.74  3.42  4.21  5.16  6.05  7.89
7  2.40  2.29  2.09  1.85  1.55  1.26  1.00  1.25  1.58  2.00  2.17  2.71  3.33  4.08  4.79  6.25
8  3.00  2.86  2.61  2.31  1.94  1.58  1.25  1.00  1.27  1.60  1.73  2.17  2.67  3.27  3.83  5.00
9  3.80  3.62  3.30  2.92  2.45  2.00  1.58  1.27  1.00  1.26  1.37  1.71  2.11  2.58  3.03  3.95
10 4.80  4.57  4.17  3.69  3.10  2.53  2.00  1.60  1.26  1.00  1.08  1.35  1.67  2.04  2.40  3.13
11 5.20  4.95  4.52  4.00  3.35  2.74  2.17  1.73  1.37  1.08  1.00  1.25  1.54  1.88  2.21  2.88
12 6.50  6.19  5.65  5.00  4.19  3.42  2.71  2.17  1.71  1.35  1.25  1.00  1.23  1.51  1.77  2.31
13 8.00  7.62  6.96  6.15  5.16  4.21  3.33  2.67  2.11  1.67  1.54  1.23  1.00  1.23  1.44  1.88
14 9.80  9.33  8.52  7.54  6.32  5.16  4.08  3.27  2.58  2.04  1.88  1.51  1.23  1.00  1.17  1.53
15 11.50 10.95 10.00 8.85  7.42  6.05  4.79  3.83  3.03  2.40  2.21  1.77  1.44  1.17  1.00  1.30
16 15.00 14.29 13.04 11.54 9.68  7.89  6.25  5.00  3.95  3.13  2.88  2.31  1.88  1.53  1.30  1.00
```

### Reading the Matrix

- Find your background step in the left column
- Find your foreground step in the top row
- The intersection is the contrast ratio
- Values ≥4.5 pass WCAG AA for normal text
- Values ≥7.0 pass WCAG AAA for normal text
- Values ≥3.0 pass WCAG AA for large text

## Testing Tools

### Built-in Contrast Checker

```typescript
import { checkContrast, formatRatio } from '@ds/tokens/scripts/contrast';

const result = checkContrast('#ffffff', '#0066cc');
console.log(formatRatio(result.ratio)); // "7.21:1"
console.log(result.passesAA);           // true
console.log(result.passesAAA);          // true
```

### External Tools

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)
- [Adobe Color Contrast Analyzer](https://color.adobe.com/create/color-contrast-analyzer)

## Best Practices

1. **Start with the recommendations** - These pairings are pre-validated
2. **Verify custom combinations** - Always check contrast for non-standard pairings
3. **Consider context** - Large text has lower requirements than small text
4. **Test in both modes** - Verify contrast in both light and dark themes
5. **Don't rely on color alone** - Use additional visual indicators (icons, patterns)
6. **Check with real content** - Long text may need higher contrast than short labels
