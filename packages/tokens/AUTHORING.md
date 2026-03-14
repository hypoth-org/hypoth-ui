# Token Integration Guide

How to add design tokens for a new component. Target time: 15 minutes.

## Table of Contents

1. [Determine the Type Category](#1-determine-the-type-category)
2. [Create the Component Token File](#2-create-the-component-token-file)
3. [Properties That Need State Variants](#3-properties-that-need-state-variants)
4. [Reference Type Tokens as Defaults](#4-reference-type-tokens-as-defaults)
5. [Update Component CSS](#5-update-component-css)
6. [Property Shorthand Vocabulary](#6-property-shorthand-vocabulary)
7. [Build and Verify](#7-build-and-verify)
8. [Worked Example: InfoCard](#8-worked-example-infocard)

---

## 1. Determine the Type Category

Every component belongs to one of six type categories. Type tokens define shared defaults so that all components in a category stay visually consistent.

| Category | Type Token Prefix | Criteria | Examples |
|---|---|---|---|
| **actions** | `action.*` | Clickable elements that trigger an operation | Button, Link, Icon (interactive), Tag |
| **form-controls** | `form-control.*` | Elements that accept user input and participate in form submission | Input, Textarea, Select, Checkbox, Radio, Switch, Slider |
| **overlays** | `overlay.*` | Floating surfaces that appear above the page and typically have a backdrop or dismiss behavior | Dialog, Popover, Tooltip, Sheet, Drawer, HoverCard |
| **navigation** | `nav.*` | Elements that move the user between views or sections | Tabs, Breadcrumb, Pagination, Menu, NavigationMenu |
| **feedback** | `feedback.*` | Elements that communicate status, progress, or alerts to the user | Alert, Badge, Toast, Progress, Spinner, Skeleton |
| **containers** | `container.*` | Static layout surfaces that group related content | Card, Accordion, Collapsible, Table, DataTable |

**Decision heuristic:** Ask "what does this component _do_ for the user?" If it triggers an action, it is `actions`. If it collects input, it is `form-controls`. If it floats above the page, it is `overlays`. If it moves between sections, it is `navigation`. If it communicates status, it is `feedback`. If it groups content, it is `containers`.

---

## 2. Create the Component Token File

Create a JSON file at:

```
packages/tokens/src/tokens/component/<component>.json
```

Use kebab-case for multi-word component names (e.g., `date-picker.json`, `data-table.json`).

The file uses DTCG (Design Tokens Community Group) format. Every leaf token has three fields:

| Field | Required | Purpose |
|---|---|---|
| `$value` | Yes | The token value. Either a literal (`"0.875rem"`) or a reference (`"{action.primary.bg}"`) |
| `$type` | Yes | The DTCG type: `color`, `dimension`, `fontWeight`, `shadow`, `number` |
| `$description` | No | Human-readable explanation. Add for non-obvious tokens. |

### File structure

```jsonc
{
  "$description": "ComponentName component tokens — references <category> type tokens",
  "<component>": {
    // Root-level tokens (apply to the component host)
    "bg": { "$value": "{container.bg}", "$type": "color" },
    "border-radius": { "$value": "{container.border-radius}", "$type": "dimension" },

    // Sub-element group
    "header": {
      "padding": { "$value": "1rem", "$type": "dimension" },
      "font-size": { "$value": "1.125rem", "$type": "dimension" }
    },

    // State tokens (flattened with suffix)
    "primary": {
      "bg": { "$value": "{action.primary.bg}", "$type": "color" },
      "bg-hover": { "$value": "{action.primary.bg-hover}", "$type": "color" }
    }
  }
}
```

### Naming convention

Tokens compile to CSS custom properties following this pattern:

```
--ds-{component}-{element?}-{property}-{state?}
```

Examples:
- `button.border-radius` compiles to `--ds-button-border-radius`
- `button.primary.bg-hover` compiles to `--ds-button-primary-bg-hover`
- `dialog.title.font-size` compiles to `--ds-dialog-title-font-size`
- `input.field.border-color-focus` compiles to `--ds-input-field-border-color-focus`

---

## 3. Properties That Need State Variants

### Need state variants (hover, active, focus, disabled)

These properties change with user interaction:

- `bg` -- background color
- `color` -- text/foreground color
- `border-color` -- border color

Common state suffixes: `-hover`, `-active`, `-focus`, `-disabled`.

### Do NOT need state variants

These properties stay constant across states:

- `border-radius`
- `font-size`, `font-weight`
- `padding`, `padding-x`, `padding-y`
- `gap`, `height`, `width`
- `shadow` (except overlays with open/closed states)
- `z-index`

### Size variants

For size-responsive properties, use a flat suffix convention rather than state suffixes:

```jsonc
"height": { "$value": "{action.height.md}", "$type": "dimension" },
"height-sm": { "$value": "{action.height.sm}", "$type": "dimension" },
"height-lg": { "$value": "{action.height.lg}", "$type": "dimension" }
```

---

## 4. Reference Type Tokens as Defaults

Use the `{reference}` syntax to point to type tokens. This is how type-level theming works: when a consumer overrides `--ds-container-bg`, all container components update automatically.

### Available type token prefixes

| Prefix | Source file | Provides |
|---|---|---|
| `action.*` | `type/actions.json` | height, padding, font-size, font-weight, border-radius, gap, variant colors (primary/secondary/ghost/destructive), disabled, focus-ring |
| `form-control.*` | `type/form-controls.json` | bg, border-color (+ hover/focus), border-radius, focus-ring, error-color, placeholder-color, height, padding, font-size, disabled |
| `overlay.*` | `type/overlays.json` | bg, border-color, border-radius, shadow, padding, backdrop-color, z-index, max-width |
| `nav.*` | `type/navigation.json` | item (padding, color + hover/active, bg + hover/active, border-radius), indicator-color, separator-color |
| `feedback.*` | `type/feedback.json` | border-radius, padding, font-size, severity variants (info/success/warning/error with bg/color/border-color) |
| `container.*` | `type/containers.json` | bg, border-color, border-radius, shadow, padding |

### Reference syntax

```jsonc
// Reference a type token (resolved at build time)
"bg": { "$value": "{container.bg}", "$type": "color" }

// Reference a global token (for values not covered by type tokens)
"color": { "$value": "{color.foreground.default}", "$type": "color" }

// Literal value (when no suitable reference exists)
"gap": { "$value": "0.75rem", "$type": "dimension" }
```

**Prefer type token references over global token references.** Use global tokens (`{color.*}`, `{radius.*}`, `{font.*}`) only when the type token does not cover the property you need.

---

## 5. Update Component CSS

After creating the token JSON file, update the component CSS to use the new component tokens.

### Before (using global tokens directly -- wrong)

```css
.ds-info-card {
  background-color: var(--ds-color-background-default);
  border: 1px solid var(--ds-color-border-default);
  border-radius: var(--ds-radius-lg);
  padding: 1.5rem;
}
```

### After (using component tokens -- correct)

```css
.ds-info-card {
  background-color: var(--ds-info-card-bg);
  border: 1px solid var(--ds-info-card-border-color);
  border-radius: var(--ds-info-card-border-radius);
  padding: var(--ds-info-card-padding);
}
```

### Rules

1. **NO inline fallbacks.** Write `var(--ds-info-card-bg)`, not `var(--ds-info-card-bg, white)`. Fallback values are defined in the token layer, not in component CSS.

2. **NO internal `--_` tokens.** Do not create private custom properties like `--_card-bg` inside the component. Use the public `--ds-` tokens directly.

3. **Every `var()` in component CSS must reference a `--ds-{component}-*` token.** If you find yourself reaching for `var(--ds-color-*)` or `var(--ds-radius-*)` in a component stylesheet, that property needs a component token.

---

## 6. Property Shorthand Vocabulary

Use these standardized property names across all component token files. This keeps naming consistent and predictable.

### Color properties
| Name | Meaning |
|---|---|
| `bg` | Background color |
| `color` | Text / foreground color |
| `border-color` | Border color |
| `icon-color` | Icon fill/stroke color |
| `focus-ring` | Focus ring outline color |
| `backdrop-color` | Overlay backdrop color |
| `indicator-color` | Active indicator highlight |
| `separator-color` | Divider line color |

### Dimension properties
| Name | Meaning |
|---|---|
| `padding` | Uniform padding |
| `padding-x` | Horizontal (inline) padding |
| `padding-y` | Vertical (block) padding |
| `gap` | Flex/grid gap between children |
| `border-radius` | Corner rounding |
| `height` | Component height |
| `width` | Component width |
| `size` | Width and height (square elements like icons) |
| `max-width` | Maximum width constraint |

### Typography properties
| Name | Meaning |
|---|---|
| `font-size` | Text size |
| `font-weight` | Text weight |

### Effect properties
| Name | Meaning |
|---|---|
| `shadow` | Box shadow |
| `z-index` | Stacking order |

### State suffixes
| Suffix | Meaning |
|---|---|
| `-hover` | Mouse hover state |
| `-active` | Active / pressed state |
| `-focus` | Keyboard focus state |
| `-disabled` | Disabled state |

### Size suffixes
| Suffix | Meaning |
|---|---|
| `-sm` | Small size variant |
| `-lg` | Large size variant |
| `-xl` | Extra large size variant |

---

## 7. Build and Verify

After adding or modifying token files:

```bash
# Build token outputs
pnpm --filter @hypoth-ui/tokens build
```

Then verify your tokens appear in the compiled CSS:

```bash
# Check that your new tokens are present
grep "ds-info-card" packages/tokens/dist/css/component-tokens.css
```

You should see your tokens in `dist/css/component-tokens.css` as CSS custom properties inside `@layer tokens { :root { ... } }`.

The compiled output preserves type token references as `var()` calls. For example, a token with `"$value": "{container.bg}"` compiles to:

```css
--ds-info-card-bg: var(--ds-container-bg);
```

This reference chain is what makes cascading overrides work.

---

## 8. Worked Example: InfoCard

Walk-through of adding tokens for a hypothetical `InfoCard` component from scratch.

### Step 1: Determine category

InfoCard is a static surface that groups related content with a header, body, and icon. That makes it a **container**.

Type token prefix: `container.*`

### Step 2: Create the token file

File: `packages/tokens/src/tokens/component/info-card.json`

```json
{
  "$description": "InfoCard component tokens — references container type tokens",
  "info-card": {
    "bg": { "$value": "{container.bg}", "$type": "color" },
    "border-color": { "$value": "{container.border-color}", "$type": "color" },
    "border-radius": { "$value": "{container.border-radius}", "$type": "dimension" },
    "padding": { "$value": "{container.padding}", "$type": "dimension" },
    "header": {
      "bg": { "$value": "{color.background.subtle}", "$type": "color", "$description": "Subtle background to distinguish the header area" },
      "padding": { "$value": "1rem 1.5rem", "$type": "dimension" },
      "font-size": { "$value": "1.125rem", "$type": "dimension" },
      "font-weight": { "$value": "600", "$type": "fontWeight" }
    },
    "body": {
      "padding": { "$value": "{container.padding}", "$type": "dimension" },
      "color": { "$value": "{color.foreground.default}", "$type": "color" }
    },
    "icon": {
      "size": { "$value": "1.5rem", "$type": "dimension" },
      "color": { "$value": "{color.primary.default}", "$type": "color" }
    }
  }
}
```

This compiles to the following CSS custom properties:

```css
--ds-info-card-bg: var(--ds-container-bg);
--ds-info-card-border-color: var(--ds-container-border-color);
--ds-info-card-border-radius: var(--ds-container-border-radius);
--ds-info-card-padding: var(--ds-container-padding);
--ds-info-card-header-bg: var(--ds-color-background-subtle);
--ds-info-card-header-padding: 1rem 1.5rem;
--ds-info-card-header-font-size: 1.125rem;
--ds-info-card-header-font-weight: 600;
--ds-info-card-body-padding: var(--ds-container-padding);
--ds-info-card-body-color: var(--ds-color-foreground-default);
--ds-info-card-icon-size: 1.5rem;
--ds-info-card-icon-color: var(--ds-color-primary-default);
```

### Step 3: Write component CSS using token vars

File: `packages/wc/src/components/info-card/info-card.css`

```css
@layer components {
  ds-info-card {
    display: block;
    background-color: var(--ds-info-card-bg);
    border: 1px solid var(--ds-info-card-border-color);
    border-radius: var(--ds-info-card-border-radius);
    overflow: hidden;
  }

  ds-info-card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: var(--ds-info-card-header-bg);
    padding: var(--ds-info-card-header-padding);
    font-size: var(--ds-info-card-header-font-size);
    font-weight: var(--ds-info-card-header-font-weight);
  }

  ds-info-card-body {
    display: block;
    padding: var(--ds-info-card-body-padding);
    color: var(--ds-info-card-body-color);
  }

  ds-info-card-header .ds-info-card-icon {
    width: var(--ds-info-card-icon-size);
    height: var(--ds-info-card-icon-size);
    color: var(--ds-info-card-icon-color);
  }
}
```

### Step 4: Verify cascading overrides

The token reference chain enables two levels of override:

**Override all containers at once** -- change the type token:

```css
:root {
  --ds-container-bg: oklch(0.97 0.01 250);
}
```

Every container component (Card, Accordion, Table, InfoCard) picks up the new background because their `bg` tokens reference `var(--ds-container-bg)`.

**Override only InfoCard header** -- change the component token:

```css
:root {
  --ds-info-card-header-bg: oklch(0.95 0.03 250);
}
```

Only InfoCard's header changes. All other containers and InfoCard's body remain unaffected.

**Override a single instance** -- scope to a class or attribute:

```css
.my-custom-card {
  --ds-info-card-border-color: oklch(0.7 0.15 250);
  --ds-info-card-icon-color: oklch(0.5 0.2 250);
}
```

Only the InfoCard instances with class `my-custom-card` get the overridden border and icon color.

### Step 5: Build and confirm

```bash
pnpm --filter @hypoth-ui/tokens build
grep "ds-info-card" packages/tokens/dist/css/component-tokens.css
```

Expected output: 12 custom properties matching the token file above.
