# Research: Component Styling Tokens

**Feature**: 029-component-styling-tokens
**Date**: 2026-03-07

## Research Topics

### 1. Token Resolution Pattern: Nested var() vs. Definition Chain

**Decision**: Definition chain in `@layer tokens` layer, with simple single-token references in component CSS.

**Rationale**: The component CSS stays clean (`var(--ds-button-bg)`) while the tiering is expressed through token definitions (`--ds-button-bg: var(--ds-action-bg)`). This avoids the verbosity of Spectrum's three-level `var()` nesting in every property declaration. The existing Dialog component already uses this pattern — `--ds-dialog-backdrop-color` is defined once and referenced simply.

**Alternatives considered**:
- Nested `var()` in component CSS: `var(--ds-button-bg, var(--ds-action-bg, var(--ds-color-primary-default)))` — rejected because it makes component CSS verbose, harder to read, and adds parsing overhead. Every property needs 2-3 levels of nesting.
- Spectrum's `--mod-*` layer: separate `--mod-button-bg` consumer namespace — rejected because it doubles the number of CSS custom properties and adds cognitive overhead. Our two-layer approach (component token is the consumer API) is sufficient for alpha.

### 2. Where to Define Type and Component Tokens

**Decision**: New DTCG JSON files in `packages/tokens/src/tokens/type/` and `packages/tokens/src/tokens/component/`, compiled to separate CSS files.

**Rationale**: Keeps the token source-of-truth in the DTCG pipeline. Type and component tokens reference semantic tokens using DTCG `{reference}` syntax, maintaining a single resolution path. Separate CSS output files (`type-tokens.css`, `component-tokens.css`) allow consumers to opt-in to granularity levels.

**Alternatives considered**:
- Define component tokens inline in component CSS files using `@layer tokens { :root { ... } }` — rejected because it scatters token definitions across 50+ files, making it impossible to see the full token surface at a glance or generate documentation from a single source.
- Define tokens only in CSS (skip DTCG JSON) — rejected because it breaks the existing DTCG pipeline and loses TypeScript type generation.

### 3. Naming Convention for Sub-Element Tokens

**Decision**: `--ds-{component}-{element}-{property}` pattern (e.g., `--ds-select-trigger-bg`, `--ds-input-label-font-weight`).

**Rationale**: Matches the existing pattern used in some components (`--ds-accordion-trigger-bg`, `--ds-sheet-content-bg`). The element segment is omitted for simple/root-level component properties (`--ds-button-bg` not `--ds-button-root-bg`), keeping names short for the common case.

**Alternatives considered**:
- BEM-inspired double-underscore: `--ds-select__trigger-bg` — rejected because double underscores in CSS custom properties are visually noisy and don't match any existing convention in the codebase.
- Flat naming without element: `--ds-select-trigger-background-color` — rejected because full CSS property names make tokens excessively long. Using shorthand properties (`bg`, `color`, `radius`, `gap`, `padding`) keeps names scannable.

### 4. Property Shorthand Vocabulary

**Decision**: Use consistent shorthand names for properties across all tokens.

| Shorthand | CSS Property |
|-----------|-------------|
| `bg` | `background-color` |
| `color` | `color` (text) |
| `border-color` | `border-color` |
| `border-radius` | `border-radius` |
| `shadow` | `box-shadow` |
| `padding` | `padding` (shorthand) |
| `padding-x` | `padding-inline` |
| `padding-y` | `padding-block` |
| `gap` | `gap` |
| `height` | `height` |
| `min-height` | `min-height` |
| `font-size` | `font-size` |
| `font-weight` | `font-weight` |
| `line-height` | `line-height` |

**Rationale**: Consistent shorthands reduce naming ambiguity. `bg` is universally understood (Tailwind, shadcn). Full property names (`background-color`) are used only for less common properties where shorthand is ambiguous.

### 5. shadcn/ui Visual Mapping to Token Values

**Decision**: Adopt shadcn's oklch color space and structural patterns, but diverge on specific color values for primary, success, and destructive roles. Use Geist as the default typeface.

**Key mappings** (divergences from shadcn marked with `*`):

| shadcn token | Our semantic token | Value | Notes |
|-------------|-------------------|-------|-------|
| `--background` | `--ds-color-background-default` | `oklch(1 0 0)` | White |
| `--foreground` | `--ds-color-foreground-default` | `oklch(0.145 0 0)` | Near-black |
| `--primary` | `--ds-color-primary-default` | `oklch(0.55 0.19 250)` | *Blue accent (shadcn uses dark gray) |
| `--primary-foreground` | `--ds-color-primary-foreground` | `oklch(0.985 0 0)` | White on blue |
| `--secondary` | `--ds-color-secondary-default` | `oklch(0.97 0 0)` | Light gray |
| `--muted` | `--ds-color-background-muted` | `oklch(0.97 0 0)` | — |
| `--muted-foreground` | `--ds-color-foreground-muted` | `oklch(0.556 0 0)` | — |
| `--destructive` | `--ds-color-destructive-default` | `oklch(0.55 0.2 35)` | *Warm vermillion, color-blind safe |
| (none) | `--ds-color-success-default` | `oklch(0.55 0.14 185)` | *Teal instead of green |
| `--border` | `--ds-color-border-default` | `oklch(0.922 0 0)` | Light gray |
| `--ring` | `--ds-color-focus-ring` | `oklch(0.55 0.19 250)` | *Matches blue primary |
| `--radius` | `--ds-radius-md` | `0.375rem` | — |
| (none) | `--ds-font-family-sans` | `'Geist', system-ui, sans-serif` | *Geist typeface |
| (none) | `--ds-font-family-mono` | `'Geist Mono', ui-monospace, monospace` | *Geist Mono |

**Rationale**:
- **oklch color space**: Perceptually uniform, enabling consistent lightness across hues. This is the direction CSS is moving.
- **Blue primary**: A vibrant blue accent (hue 250) provides clear interactive affordance. shadcn's dark gray primary works well with their utility-class approach but lacks the visual "pop" expected from a design system's default theme. Blue is universally associated with interactive elements.
- **Teal success / Vermillion destructive**: Chosen for color-blind accessibility. The 150-degree hue separation between teal (hue 185) and vermillion (hue 35) remains distinguishable across protanopia, deuteranopia, and tritanopia — the three most common forms of color vision deficiency. Traditional green (hue ~145) and red (hue ~25) have only ~120-degree separation and collapse to near-identical for deuteranopes.
- **Geist font**: Clean geometric sans-serif designed for UI readability. Pairs well with the modern shadcn aesthetic. `system-ui` fallback ensures graceful degradation when Geist is not loaded.

**Alternatives considered**:
- Keep hex values — rejected because oklch provides better perceptual uniformity.
- Use HSL — rejected because oklch is perceptually uniform while HSL is not.
- shadcn's dark gray primary — rejected because it relies on class-level styling for interactive affordance; our CSS-variable-driven system benefits from a distinctly colored primary.
- Traditional green/red for success/destructive — rejected due to poor distinguishability for color-blind users (~8% of males have some form of red-green deficiency).

### 6. Type Token Scope per Category

**Decision**: Each type category defines a focused set of shared tokens covering the properties that all components in the category have in common.

**form-controls**:
- `--ds-form-control-bg`, `--ds-form-control-border-color`, `--ds-form-control-border-radius`
- `--ds-form-control-height-{sm,md,lg}`, `--ds-form-control-padding-x-{sm,md,lg}`, `--ds-form-control-padding-y-{sm,md,lg}`
- `--ds-form-control-font-size-{sm,md,lg}`
- `--ds-form-control-focus-ring`, `--ds-form-control-error-color`
- `--ds-form-control-disabled-bg`, `--ds-form-control-disabled-color`

**overlays**:
- `--ds-overlay-bg`, `--ds-overlay-border-color`, `--ds-overlay-border-radius`
- `--ds-overlay-shadow`, `--ds-overlay-padding`
- `--ds-overlay-backdrop-color`, `--ds-overlay-backdrop-blur`
- `--ds-overlay-z-index`

**navigation**:
- `--ds-nav-item-padding-x`, `--ds-nav-item-padding-y`
- `--ds-nav-item-color`, `--ds-nav-item-color-hover`, `--ds-nav-item-color-active`
- `--ds-nav-item-bg-hover`, `--ds-nav-item-bg-active`
- `--ds-nav-indicator-color`

**feedback**:
- `--ds-feedback-border-radius`, `--ds-feedback-padding`
- `--ds-feedback-{info,success,warning,error}-bg`, `--ds-feedback-{info,success,warning,error}-color`, `--ds-feedback-{info,success,warning,error}-border-color`

**containers**:
- `--ds-container-bg`, `--ds-container-border-color`, `--ds-container-border-radius`
- `--ds-container-shadow`, `--ds-container-padding`

**actions**:
- `--ds-action-height-{sm,md,lg}`, `--ds-action-padding-x-{sm,md,lg}`, `--ds-action-padding-y-{sm,md,lg}`
- `--ds-action-font-size-{sm,md,lg}`, `--ds-action-font-weight`
- `--ds-action-border-radius`, `--ds-action-gap`
- `--ds-action-primary-bg`, `--ds-action-primary-color`, `--ds-action-primary-bg-hover`
- `--ds-action-secondary-bg`, `--ds-action-secondary-color`
- `--ds-action-ghost-color`, `--ds-action-ghost-bg-hover`
- `--ds-action-destructive-bg`, `--ds-action-destructive-color`

### 7. Component CSS Migration — Handling Inconsistent Token Usage

**Decision**: During migration, audit each component for inconsistencies (hardcoded values, inconsistent token references, missing token references) and normalize all to the new tiered pattern. Visual output must remain identical post-migration.

**Rationale**: The current codebase has inconsistencies: some components use `--ds-color-*` semantic tokens, others use hardcoded hex values, and some use `--ds-space-*` while others use `--ds-spacing-*`. The migration normalizes all references through the component token layer.

**Approach**:
1. For each component, capture a visual snapshot before migration
2. Replace all direct semantic/primitive token references with component-level tokens
3. Replace all hardcoded values with component-level tokens
4. Verify visual snapshot matches — zero visual diff

### 8. Build Pipeline — Separate vs. Combined CSS Output

**Decision**: Emit separate CSS files per tier, combined into a single import via the CSS package.

**Rationale**: Separate files (`tokens.css`, `type-tokens.css`, `component-tokens.css`) allow consumers to opt-in to the level of granularity they need. The `@hypoth-ui/css` package imports all three in the correct order within `@layer tokens`.

**Alternatives considered**:
- Single combined `tokens.css` — rejected because it would make the file very large and prevent tree-shaking of unused tiers.
- Per-component CSS token files — rejected because it would create 56+ tiny files with high HTTP overhead. Component tokens are small enough to bundle into one file.

### 9. Default Typeface: Geist

**Decision**: Use Geist (sans) and Geist Mono (mono) as the default typefaces, with system-ui and ui-monospace as fallbacks.

**Rationale**: Geist is a clean geometric sans-serif designed specifically for UI readability by Vercel. It pairs well with the shadcn/ui aesthetic we're referencing. The system-ui fallback chain (`'Geist', system-ui, -apple-system, sans-serif`) ensures the design system works gracefully when Geist is not loaded — consumers who don't want Geist simply don't load the font files and get their platform's native UI font.

**Alternatives considered**:
- Inter — widely used in design systems, but Geist has better UI-specific optical sizing and is gaining rapid adoption.
- system-ui only — rejected because a named default font ensures visual consistency across platforms (system-ui renders as SF Pro on macOS, Segoe UI on Windows, Roboto on Android — visually different).

### 10. Color-Blind Safe Success/Destructive Palette

**Decision**: Teal success (oklch hue 185) and warm vermillion destructive (oklch hue 35) with 150° hue separation.

**Rationale**: ~8% of males and ~0.5% of females have some form of color vision deficiency, overwhelmingly red-green (protanopia/deuteranopia). Traditional green (hue ~145) and red (hue ~25) have only ~120° separation in oklch and collapse to near-identical brownish tones for deuteranopes. Our teal (hue 185, has strong blue component) and vermillion (hue 35, has strong orange component) maintain clear perceptual distinction because:
- **Protanopia**: blue-green vs. orange remains distinguishable (different luminance channels)
- **Deuteranopia**: teal's blue component vs. vermillion's yellow-orange component remain separable
- **Tritanopia**: both colors maintain adequate luminance contrast (both at L=0.55)

Additionally, equal lightness (L=0.55 for both) means neither color "disappears" against typical light or dark backgrounds.

**Alternatives considered**:
- Traditional green/red with icon-only differentiation — rejected because color alone must carry meaning in many contexts (status dots, progress bars, charts). Non-color cues are still used as reinforcement, but the colors themselves must be distinguishable.
- Blue success / orange destructive — rejected because blue conflicts with the primary accent color.

### 11. Blue Primary Accent vs. shadcn's Dark Gray

**Decision**: Use a vibrant blue (`oklch(0.55 0.19 250)`) as the default primary/accent color instead of shadcn's near-black (`oklch(0.205 0 0)`).

**Rationale**: shadcn's dark gray primary works in their context because consumers directly edit Tailwind classes and the dark primary doubles as a high-contrast button style. In our CSS-variable-driven system, the primary color is referenced by many components (buttons, links, checkboxes, radio buttons, sliders, focus rings) — a neutral gray would make these elements look inactive or low-contrast. A blue accent provides clear interactive affordance and is the most universally recognized "clickable" color on the web.

**Alternatives considered**:
- shadcn's dark gray primary — rejected because it relies on surrounding Tailwind utility classes (shadows, borders) for visual affordance that our BEM/CSS-variable approach doesn't replicate the same way.
- Indigo/violet — viable, but blue is more universally associated with interactive elements and has better contrast ratios against white backgrounds at the same lightness level.
