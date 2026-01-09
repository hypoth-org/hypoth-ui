# Data Model: Design System Quality Overhaul

**Feature**: 022-ds-quality-overhaul
**Date**: 2026-01-09
**Phase**: 1 (Design)

## Overview

This document defines the data structures, type definitions, and API contracts for all new systems introduced in this feature.

---

## 1. Style Props System

### Core Types

```typescript
// packages/react/src/primitives/types.ts

/**
 * Spacing scale values (maps to --ds-spacing-{n})
 */
type SpacingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto';

/**
 * Color token paths (maps to --ds-color-{path})
 */
type ColorValue =
  | `${SemanticColor}.${ColorStep}`  // e.g., "primary.9"
  | `${PrimitiveColor}.${ColorStep}` // e.g., "blue.9"
  | 'transparent'
  | 'currentColor'
  | 'inherit';

type SemanticColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
type PrimitiveColor = 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
type ColorStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/**
 * Typography scale values
 */
type FontSizeValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type FontWeightValue = 'normal' | 'medium' | 'semibold' | 'bold';
type LineHeightValue = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';

/**
 * Breakpoint keys for responsive values
 */
type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Responsive value wrapper
 */
type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * Style props interface (partial - common properties)
 */
interface StyleProps {
  // Spacing
  m?: Responsive<SpacingValue>;
  mt?: Responsive<SpacingValue>;
  mr?: Responsive<SpacingValue>;
  mb?: Responsive<SpacingValue>;
  ml?: Responsive<SpacingValue>;
  mx?: Responsive<SpacingValue>;
  my?: Responsive<SpacingValue>;
  p?: Responsive<SpacingValue>;
  pt?: Responsive<SpacingValue>;
  pr?: Responsive<SpacingValue>;
  pb?: Responsive<SpacingValue>;
  pl?: Responsive<SpacingValue>;
  px?: Responsive<SpacingValue>;
  py?: Responsive<SpacingValue>;
  gap?: Responsive<SpacingValue>;

  // Colors
  bg?: Responsive<ColorValue>;
  color?: Responsive<ColorValue>;
  borderColor?: Responsive<ColorValue>;

  // Typography
  fontSize?: Responsive<FontSizeValue>;
  fontWeight?: Responsive<FontWeightValue>;
  lineHeight?: Responsive<LineHeightValue>;
  textAlign?: Responsive<'left' | 'center' | 'right' | 'justify'>;

  // Layout
  display?: Responsive<'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none'>;
  position?: Responsive<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'>;
  overflow?: Responsive<'visible' | 'hidden' | 'scroll' | 'auto'>;

  // Sizing
  w?: Responsive<SpacingValue | 'full' | 'screen' | 'auto'>;
  h?: Responsive<SpacingValue | 'full' | 'screen' | 'auto'>;
  minW?: Responsive<SpacingValue | 'full' | 'screen'>;
  maxW?: Responsive<SpacingValue | 'full' | 'screen' | 'prose'>;
  minH?: Responsive<SpacingValue | 'full' | 'screen'>;
  maxH?: Responsive<SpacingValue | 'full' | 'screen'>;

  // Borders
  rounded?: Responsive<'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>;
  border?: Responsive<'none' | 'default'>;
  borderWidth?: Responsive<0 | 1 | 2 | 4>;
}

/**
 * Flex-specific props
 */
interface FlexProps extends StyleProps {
  direction?: Responsive<'row' | 'row-reverse' | 'column' | 'column-reverse'>;
  wrap?: Responsive<'nowrap' | 'wrap' | 'wrap-reverse'>;
  justify?: Responsive<'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'>;
  align?: Responsive<'start' | 'end' | 'center' | 'baseline' | 'stretch'>;
}

/**
 * Grid-specific props
 */
interface GridProps extends StyleProps {
  columns?: Responsive<number | string>;
  rows?: Responsive<number | string>;
  templateColumns?: Responsive<string>;
  templateRows?: Responsive<string>;
  autoFlow?: Responsive<'row' | 'column' | 'dense' | 'row dense' | 'column dense'>;
}
```

### Build-Time Compilation

```typescript
// panda.config.ts (conceptual - actual config in @ds/react)

import { defineConfig } from '@pandacss/dev';
import { tokens } from '@ds/tokens';

export default defineConfig({
  // Use our DTCG tokens
  theme: {
    tokens: {
      spacing: tokens.spacing,
      colors: tokens.colors,
      fontSizes: tokens.typography.fontSize,
      // ...
    },
  },

  // Output atomic CSS classes
  outdir: 'styled-system',

  // Enable responsive syntax
  conditions: {
    sm: '@media (min-width: 640px)',
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
    xl: '@media (min-width: 1280px)',
    '2xl': '@media (min-width: 1536px)',
  },
});
```

---

## 2. Color Scale System (16-Step)

### Token Structure (DTCG Format)

```json
// packages/tokens/src/colors/primitives.json
{
  "$type": "color",
  "blue": {
    "1": { "$value": "#fafcff", "$description": "Page background" },
    "2": { "$value": "#f5f9ff", "$description": "Raised surface" },
    "3": { "$value": "#edf4ff", "$description": "Nested surface" },
    "4": { "$value": "#e1edff", "$description": "Deep nested surface" },
    "5": { "$value": "#d3e4ff", "$description": "Element background" },
    "6": { "$value": "#c1d9ff", "$description": "Element hover" },
    "7": { "$value": "#a8c8ff", "$description": "Element active" },
    "8": { "$value": "#8ab4ff", "$description": "Subtle border" },
    "9": { "$value": "#6a9eff", "$description": "Default border" },
    "10": { "$value": "#4a88ff", "$description": "Strong border" },
    "11": { "$value": "#0066cc", "$description": "Solid default" },
    "12": { "$value": "#0059b3", "$description": "Solid hover" },
    "13": { "$value": "#004d99", "$description": "Solid active" },
    "14": { "$value": "#004080", "$description": "Solid emphasis" },
    "15": { "$value": "#003366", "$description": "Muted text" },
    "16": { "$value": "#001d3d", "$description": "Default text" }
  }
}
```

### Semantic Mappings

```json
// packages/tokens/src/colors/semantic.json
{
  "$type": "color",
  "primary": {
    "1": { "$value": "{color.blue.1}" },
    "2": { "$value": "{color.blue.2}" },
    "3": { "$value": "{color.blue.3}" },
    "4": { "$value": "{color.blue.4}" },
    "5": { "$value": "{color.blue.5}" },
    "6": { "$value": "{color.blue.6}" },
    "7": { "$value": "{color.blue.7}" },
    "8": { "$value": "{color.blue.8}" },
    "9": { "$value": "{color.blue.9}" },
    "10": { "$value": "{color.blue.10}" },
    "11": { "$value": "{color.blue.11}" },
    "12": { "$value": "{color.blue.12}" },
    "13": { "$value": "{color.blue.13}" },
    "14": { "$value": "{color.blue.14}" },
    "15": { "$value": "{color.blue.15}" },
    "16": { "$value": "{color.blue.16}" },
    "default": { "$value": "{color.blue.11}", "$description": "Primary solid color" },
    "hover": { "$value": "{color.blue.12}", "$description": "Primary hover" },
    "active": { "$value": "{color.blue.13}", "$description": "Primary active" },
    "subtle": { "$value": "{color.blue.2}", "$description": "Subtle background" },
    "muted": { "$value": "{color.blue.15}", "$description": "Muted text" },
    "foreground": { "$value": "#ffffff", "$description": "Text on solid" }
  }
}
```

### TypeScript Types

```typescript
// packages/tokens/src/types/colors.ts

/**
 * 16-step color scale
 *
 * Steps 1-4:   Backgrounds (page, card, nested, deep)
 * Steps 5-7:   Interactive (element, hover, active)
 * Steps 8-10:  Borders (subtle, default, strong)
 * Steps 11-14: Solids (default, hover, active, emphasis)
 * Steps 15-16: Text (muted, default)
 */
interface ColorScale {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  13: string;
  14: string;
  15: string;
  16: string;
}

interface SemanticColorScale extends ColorScale {
  default: string;   // step 11
  hover: string;     // step 12
  active: string;    // step 13
  subtle: string;    // step 2
  muted: string;     // step 15
  foreground: string; // white or step 1
}

interface ColorTokens {
  // Primitives
  gray: ColorScale;
  blue: ColorScale;
  green: ColorScale;
  yellow: ColorScale;
  red: ColorScale;
  purple: ColorScale;
  orange: ColorScale;
  cyan: ColorScale;
  pink: ColorScale;

  // Semantics
  primary: SemanticColorScale;
  secondary: SemanticColorScale;
  success: SemanticColorScale;
  warning: SemanticColorScale;
  error: SemanticColorScale;
  neutral: SemanticColorScale;
}
```

---

## 3. Density System

### Token Structure

```json
// packages/tokens/src/density/modes.json
{
  "density": {
    "compact": {
      "$type": "dimension",
      "spacing": {
        "1": { "$value": "0.125rem" },
        "2": { "$value": "0.25rem" },
        "3": { "$value": "0.375rem" },
        "4": { "$value": "0.5rem" },
        "5": { "$value": "0.625rem" },
        "6": { "$value": "0.75rem" },
        "8": { "$value": "1rem" },
        "10": { "$value": "1.25rem" },
        "12": { "$value": "1.5rem" }
      },
      "component": {
        "button-padding-x": { "$value": "0.75rem" },
        "button-padding-y": { "$value": "0.375rem" },
        "input-padding-x": { "$value": "0.5rem" },
        "input-padding-y": { "$value": "0.25rem" },
        "input-height": { "$value": "1.75rem" }
      }
    },
    "default": {
      "$type": "dimension",
      "spacing": {
        "1": { "$value": "0.25rem" },
        "2": { "$value": "0.5rem" },
        "3": { "$value": "0.75rem" },
        "4": { "$value": "1rem" },
        "5": { "$value": "1.25rem" },
        "6": { "$value": "1.5rem" },
        "8": { "$value": "2rem" },
        "10": { "$value": "2.5rem" },
        "12": { "$value": "3rem" }
      },
      "component": {
        "button-padding-x": { "$value": "1rem" },
        "button-padding-y": { "$value": "0.5rem" },
        "input-padding-x": { "$value": "0.75rem" },
        "input-padding-y": { "$value": "0.5rem" },
        "input-height": { "$value": "2.25rem" }
      }
    },
    "spacious": {
      "$type": "dimension",
      "spacing": {
        "1": { "$value": "0.375rem" },
        "2": { "$value": "0.75rem" },
        "3": { "$value": "1rem" },
        "4": { "$value": "1.25rem" },
        "5": { "$value": "1.5rem" },
        "6": { "$value": "1.75rem" },
        "8": { "$value": "2.5rem" },
        "10": { "$value": "3rem" },
        "12": { "$value": "3.5rem" }
      },
      "component": {
        "button-padding-x": { "$value": "1.25rem" },
        "button-padding-y": { "$value": "0.625rem" },
        "input-padding-x": { "$value": "1rem" },
        "input-padding-y": { "$value": "0.625rem" },
        "input-height": { "$value": "2.75rem" }
      }
    }
  }
}
```

### React Provider

```typescript
// packages/react/src/density/density-provider.tsx

type DensityMode = 'compact' | 'default' | 'spacious';

interface DensityContextValue {
  density: DensityMode;
  setDensity: (density: DensityMode) => void;
}

const DensityContext = createContext<DensityContextValue>({
  density: 'default',
  setDensity: () => {},
});

interface DensityProviderProps {
  children: ReactNode;
  density?: DensityMode;
  onDensityChange?: (density: DensityMode) => void;
}

function DensityProvider({
  children,
  density = 'default',
  onDensityChange
}: DensityProviderProps) {
  const [internalDensity, setInternalDensity] = useState(density);

  const value = useMemo(() => ({
    density: internalDensity,
    setDensity: (d: DensityMode) => {
      setInternalDensity(d);
      onDensityChange?.(d);
    },
  }), [internalDensity, onDensityChange]);

  return (
    <DensityContext.Provider value={value}>
      <div data-density={internalDensity}>
        {children}
      </div>
    </DensityContext.Provider>
  );
}

function useDensity(): DensityContextValue {
  return useContext(DensityContext);
}
```

### CSS Output

```css
/* packages/tokens/dist/density.css */

/* Default density (base) */
:root,
[data-density="default"] {
  --ds-spacing-1: 0.25rem;
  --ds-spacing-2: 0.5rem;
  --ds-spacing-4: 1rem;
  /* ... */
  --ds-button-padding-x: 1rem;
  --ds-button-padding-y: 0.5rem;
  --ds-input-height: 2.25rem;
}

/* Compact density */
[data-density="compact"] {
  --ds-spacing-1: 0.125rem;
  --ds-spacing-2: 0.25rem;
  --ds-spacing-4: 0.5rem;
  /* ... */
  --ds-button-padding-x: 0.75rem;
  --ds-button-padding-y: 0.375rem;
  --ds-input-height: 1.75rem;
}

/* Spacious density */
[data-density="spacious"] {
  --ds-spacing-1: 0.375rem;
  --ds-spacing-2: 0.75rem;
  --ds-spacing-4: 1.25rem;
  /* ... */
  --ds-button-padding-x: 1.25rem;
  --ds-button-padding-y: 0.625rem;
  --ds-input-height: 2.75rem;
}
```

---

## 4. Event System

### Event Naming Convention

```typescript
// packages/primitives-dom/src/events/event-names.ts

/**
 * Standard event naming conventions for the design system.
 *
 * React props use camelCase callbacks.
 * Web Components use ds: prefixed custom events.
 */
export const EventNames = {
  // Activation events (buttons, links, menu items)
  press: {
    react: 'onPress',
    wc: 'ds:press',
  },

  // Value change events (inputs, selects, checkboxes)
  valueChange: {
    react: 'onValueChange',
    wc: 'ds:change',
  },

  // Open/close state events (dialogs, menus, popovers)
  openChange: {
    react: 'onOpenChange',
    wc: 'ds:open-change',
  },

  // Selection events (lists, trees, tables)
  select: {
    react: 'onSelect',
    wc: 'ds:select',
  },

  // Focus events
  focusChange: {
    react: 'onFocusChange',
    wc: 'ds:focus-change',
  },

  // Sort events (tables)
  sortChange: {
    react: 'onSortChange',
    wc: 'ds:sort-change',
  },

  // Expansion events (trees, accordions)
  expandedChange: {
    react: 'onExpandedChange',
    wc: 'ds:expanded-change',
  },
} as const;

/**
 * Event detail types
 */
export interface PressEvent {
  originalEvent: MouseEvent | KeyboardEvent;
  target: HTMLElement;
}

export interface ValueChangeEvent<T = unknown> {
  value: T;
  previousValue?: T;
}

export interface OpenChangeEvent {
  open: boolean;
  reason?: 'escape' | 'outside-click' | 'trigger' | 'programmatic';
}

export interface SelectEvent<T = unknown> {
  value: T;
  selected: boolean;
}
```

---

## 5. ID Generation System

### Behavior Primitive Option

```typescript
// packages/primitives-dom/src/id/create-id-generator.ts

export type IdGenerator = (prefix?: string) => string;

/**
 * Default ID generator using crypto.randomUUID().
 * Safe for client-only rendering.
 */
export function createDefaultIdGenerator(): IdGenerator {
  return (prefix = 'ds') => {
    const id = crypto.randomUUID().slice(0, 8);
    return `${prefix}-${id}`;
  };
}

/**
 * Counter-based ID generator.
 * Use when deterministic IDs are needed.
 */
export function createCounterIdGenerator(seed = 0): IdGenerator {
  let counter = seed;
  return (prefix = 'ds') => {
    return `${prefix}-${counter++}`;
  };
}
```

### React Hook

```typescript
// packages/react/src/hooks/use-stable-id.ts

import { useId } from 'react';

/**
 * SSR-safe ID generation hook.
 * Uses React 18's useId() for hydration-safe IDs.
 *
 * @param prefix - Optional prefix for the ID
 * @returns Stable, unique ID string
 */
export function useStableId(prefix?: string): string {
  const reactId = useId();
  return prefix ? `${prefix}${reactId}` : reactId;
}

/**
 * Generate multiple related IDs.
 * Useful for components with multiple ARIA relationships.
 */
export function useStableIds<T extends string>(
  parts: T[],
  prefix?: string
): Record<T, string> {
  const baseId = useStableId(prefix);

  return useMemo(() => {
    const ids = {} as Record<T, string>;
    for (const part of parts) {
      ids[part] = `${baseId}-${part}`;
    }
    return ids;
  }, [baseId, parts]);
}
```

---

## 6. Loading State Interface

### Component Props

```typescript
// packages/react/src/types/loading.ts

export interface LoadingProps {
  /**
   * Whether the component is in a loading state.
   * When true, shows loading UI and sets aria-busy="true".
   */
  loading?: boolean;

  /**
   * Custom loading indicator element.
   * If not provided, uses default Skeleton/Spinner.
   */
  loadingIndicator?: ReactNode;
}

// Applied to Select, Combobox, Table, Tree
export interface AsyncDataComponentProps<T> extends LoadingProps {
  /**
   * Callback when more data is needed (infinite scroll/pagination).
   */
  onLoadMore?: () => void;

  /**
   * Whether there is more data to load.
   */
  hasMore?: boolean;
}
```

### ARIA Implementation

```typescript
// Example: Select with loading state
function Select({ loading, ...props }: SelectProps) {
  return (
    <div
      role="listbox"
      aria-busy={loading ? 'true' : undefined}
      aria-describedby={loading ? 'loading-message' : undefined}
    >
      {loading ? (
        <>
          <span id="loading-message" className="sr-only">
            Loading options...
          </span>
          <LoadingIndicator />
        </>
      ) : (
        <SelectContent {...props} />
      )}
    </div>
  );
}
```

---

## 7. Dev Warnings System

### Warning Types

```typescript
// packages/wc/src/utils/dev-warnings.ts

export const WarningCodes = {
  MISSING_REQUIRED_CHILD: 'DS001',
  INVALID_PROP_COMBINATION: 'DS002',
  ACCESSIBILITY_VIOLATION: 'DS003',
  DEPRECATED_USAGE: 'DS004',
} as const;

interface DevWarning {
  code: keyof typeof WarningCodes;
  component: string;
  message: string;
  suggestion?: string;
}

/**
 * Emit a development-only warning.
 * Stripped in production builds via dead code elimination.
 */
export function devWarn(warning: DevWarning): void {
  if (process.env.NODE_ENV !== 'production') {
    const prefix = `[${warning.component}] `;
    const code = WarningCodes[warning.code];
    console.warn(
      `${prefix}${warning.message} (${code})` +
      (warning.suggestion ? `\n💡 ${warning.suggestion}` : '')
    );
  }
}

/**
 * Pre-defined warnings for common misuse patterns.
 */
export const Warnings = {
  dialogMissingTitle: (component: string): DevWarning => ({
    code: 'MISSING_REQUIRED_CHILD',
    component,
    message: 'Missing required ds-dialog-title for accessibility.',
    suggestion: 'Add a <ds-dialog-title> element inside the dialog.',
  }),

  inputMissingLabel: (component: string): DevWarning => ({
    code: 'ACCESSIBILITY_VIOLATION',
    component,
    message: 'Input is missing an accessible label.',
    suggestion: 'Add aria-label, aria-labelledby, or wrap in a <ds-field> with <ds-label>.',
  }),

  buttonInvalidVariant: (component: string, variant: string): DevWarning => ({
    code: 'INVALID_PROP_COMBINATION',
    component,
    message: `Invalid variant "${variant}".`,
    suggestion: 'Use one of: default, primary, secondary, destructive, ghost, link.',
  }),
};
```

---

## 8. CLI Copy Command Data

### Component Registry

```typescript
// packages/cli/src/registry/components.ts

interface ComponentEntry {
  name: string;
  category: string;
  files: string[];
  dependencies: string[];
  devDependencies: string[];
  peerDependencies: string[];
  cssImports: string[];
}

export const componentRegistry: Record<string, ComponentEntry> = {
  button: {
    name: 'Button',
    category: 'actions',
    files: [
      'components/button/button.tsx',
      'components/button/button.css',
    ],
    dependencies: [],
    devDependencies: [],
    peerDependencies: ['react', '@ds/tokens'],
    cssImports: ['@ds/css/reset.css', '@ds/tokens/variables.css'],
  },
  dialog: {
    name: 'Dialog',
    category: 'overlays',
    files: [
      'components/dialog/dialog.tsx',
      'components/dialog/dialog-content.tsx',
      'components/dialog/dialog-title.tsx',
      'components/dialog/dialog-description.tsx',
      'components/dialog/dialog-close.tsx',
      'components/dialog/dialog.css',
    ],
    dependencies: ['button', 'portal'], // Internal deps
    devDependencies: [],
    peerDependencies: ['react', '@ds/tokens', '@ds/primitives-dom'],
    cssImports: ['@ds/css/reset.css', '@ds/tokens/variables.css'],
  },
  // ... more components
};
```

### Config File Schema

```typescript
// packages/cli/src/config/schema.ts

interface DsConfig {
  /**
   * Output directory for copied components.
   * @default "components/ui"
   */
  outputDir: string;

  /**
   * TypeScript alias for imports.
   * @default "@/components/ui"
   */
  alias: string;

  /**
   * Styling approach.
   * @default "css"
   */
  style: 'css' | 'tailwind';

  /**
   * Whether to use TypeScript.
   * @default true
   */
  typescript: boolean;

  /**
   * RSC compatibility mode.
   * @default true
   */
  rsc: boolean;
}

// ds.config.json example
const exampleConfig: DsConfig = {
  outputDir: 'components/ui',
  alias: '@/components/ui',
  style: 'css',
  typescript: true,
  rsc: true,
};
```

---

## Entity Relationship Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                        Design Tokens                             │
├─────────────────────────────────────────────────────────────────┤
│  Colors (12-step)  ──┬──▶  Semantic Colors                      │
│  Spacing           ──┼──▶  Density Modes (compact/default/spa.) │
│  Typography        ──┘                                          │
└──────────────────────────────┬──────────────────────────────────┘
                               │ consumed by
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Style Props System                           │
├─────────────────────────────────────────────────────────────────┤
│  Box, Flex, Grid, Text  ◀── StyleProps interface                │
│  Responsive syntax      ◀── Breakpoint system                   │
│  Build-time CSS         ◀── Panda CSS compilation               │
└──────────────────────────────┬──────────────────────────────────┘
                               │ used in
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Adapters                              │
├─────────────────────────────────────────────────────────────────┤
│  55 components         ◀── Wrapping Web Components              │
│  useStableId()         ◀── SSR-safe IDs                        │
│  DensityProvider       ◀── Density context                     │
│  Event callbacks       ◀── onPress, onValueChange, onOpenChange │
└─────────────────────────────────────────────────────────────────┘
```
