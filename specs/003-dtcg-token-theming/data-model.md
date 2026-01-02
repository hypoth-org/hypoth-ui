# Data Model: DTCG Token-Driven Theming

**Branch**: `003-dtcg-token-theming` | **Date**: 2026-01-01

## Entities

### Token

A design decision encoded as a name-value pair following DTCG format.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | `string` | Yes | Dot-notation path (e.g., `color.background.primary`) |
| `$value` | `TokenValue` | Yes | The token's value or reference |
| `$type` | `TokenType` | No | Token type (can be inherited) |
| `$description` | `string` | No | Human-readable description |
| `$extensions` | `Record<string, unknown>` | No | Vendor-specific metadata |

**Validation Rules**:
- Path must start with a valid category: `color`, `typography`, `spacing`, `sizing`, `border`, `shadow`, `motion`, `opacity`, `z-index`, `breakpoint`, `icon`, `radius`
- Path segments cannot contain `.`, `{`, `}`, or start with `$`
- `$value` is required to identify as a token (vs. group)

### TokenValue

Union type representing possible token values.

```typescript
type TokenValue =
  | string                    // Primitive or reference
  | number                    // Number type
  | string[]                  // fontFamily array
  | [number, number, number, number]  // cubicBezier
  | ShadowValue              // shadow type
  | ShadowValue[]            // multi-shadow
  | BorderValue              // border type
  | TypographyValue          // typography composite
  | GradientStop[]           // gradient type
  | TransitionValue;         // transition type
```

### TokenType

Enum of supported DTCG token types.

```typescript
type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'shadow'
  | 'border'
  | 'strokeStyle'
  | 'typography'
  | 'gradient'
  | 'transition';
```

### TokenReference

A reference to another token using curly brace syntax.

| Field | Type | Description |
|-------|------|-------------|
| `raw` | `string` | Original reference string (e.g., `{color.blue.500}`) |
| `path` | `string` | Extracted path (e.g., `color.blue.500`) |

**Validation Rules**:
- Must match pattern `^\{[a-zA-Z][a-zA-Z0-9._-]*\}$`
- Referenced token must exist in resolution scope

---

### TokenSet

A collection of tokens for a specific scope.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `scope` | `TokenScope` | Yes | Scope type |
| `name` | `string` | No | Name for brand/mode scopes |
| `tokens` | `Map<string, Token>` | Yes | Token map keyed by path |
| `filePath` | `string` | Yes | Source file path |

### TokenScope

```typescript
type TokenScope = 'global' | 'brand' | 'mode';
```

---

### Brand

A named theme configuration.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Brand identifier (kebab-case) |
| `name` | `string` | No | Display name |
| `tokenSet` | `TokenSet` | Yes | Brand-specific token overrides |

**Validation Rules**:
- `id` must be unique
- `id: "default"` is reserved for implicit brand

---

### Mode

A runtime-switchable variation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `ModeId` | Yes | Mode identifier |
| `tokenSet` | `TokenSet` | Yes | Mode-specific token overrides |
| `mediaQuery` | `string` | No | Associated media query |

```typescript
type ModeId = 'light' | 'dark' | 'high-contrast' | 'reduced-motion';
```

| Mode | Media Query |
|------|-------------|
| `light` | `prefers-color-scheme: light` |
| `dark` | `prefers-color-scheme: dark` |
| `high-contrast` | `prefers-contrast: more` |
| `reduced-motion` | `prefers-reduced-motion: reduce` |

---

### TokenReference (Component Manifest)

Relationship between a component and tokens it consumes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `componentId` | `string` | Yes | Component manifest ID |
| `tokensUsed` | `string[]` | Yes | Array of token paths |

**Validation Rules**:
- Each path in `tokensUsed` must exist in compiled token set
- Paths should use semantic tokens (not primitives) for maintainability

---

## Composite Value Types

### ShadowValue

```typescript
interface ShadowValue {
  color: string;      // Color value or reference
  offsetX: string;    // Dimension
  offsetY: string;    // Dimension
  blur: string;       // Dimension
  spread: string;     // Dimension
}
```

### BorderValue

```typescript
interface BorderValue {
  color: string;      // Color value or reference
  width: string;      // Dimension
  style: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'outset' | 'inset';
}
```

### TypographyValue

```typescript
interface TypographyValue {
  fontFamily: string | string[];   // Font family or reference
  fontSize: string;                // Dimension
  fontWeight: number | string;     // Weight value or reference
  letterSpacing: string;           // Dimension
  lineHeight: string | number;     // Number or dimension
}
```

### GradientStop

```typescript
interface GradientStop {
  color: string;      // Color value or reference
  position: number;   // 0-1 position
}
```

### TransitionValue

```typescript
interface TransitionValue {
  duration: string;                              // Duration
  delay: string;                                 // Duration
  timingFunction: [number, number, number, number];  // cubicBezier
}
```

---

## Compilation Outputs

### CompiledTokenSet

Result of token compilation.

| Field | Type | Description |
|-------|------|-------------|
| `css` | `string` | Generated CSS with scoped custom properties |
| `json` | `ResolvedTokenTree` | Fully resolved token tree |
| `types` | `string` | TypeScript type definitions |
| `metadata` | `CompilationMetadata` | Build metadata |

### ResolvedTokenTree

```typescript
interface ResolvedTokenTree {
  [category: string]: {
    [path: string]: {
      value: string | number | object;  // Resolved value
      type: TokenType;
      description?: string;
      originalValue: string;            // Pre-resolution value
    };
  };
}
```

### CompilationMetadata

```typescript
interface CompilationMetadata {
  version: string;
  compiledAt: string;       // ISO timestamp
  tokenCount: number;
  brands: string[];
  modes: string[];
  warnings: CompilationWarning[];
}
```

---

## State Transitions

### Token Resolution

```
┌─────────────┐     parse      ┌─────────────┐
│ DTCG JSON   │ ───────────────► │ Raw Tokens  │
└─────────────┘                 └─────────────┘
                                      │
                                      │ resolve references
                                      ▼
                               ┌─────────────┐
                               │ Resolved    │
                               │ Tokens      │
                               └─────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
              ┌───────────┐    ┌───────────┐    ┌───────────┐
              │ CSS       │    │ JSON      │    │ TypeScript│
              │ Output    │    │ Output    │    │ Types     │
              └───────────┘    └───────────┘    └───────────┘
```

### Runtime Mode Switching

```
┌─────────────┐    set data-mode    ┌─────────────┐
│ Light Mode  │ ◄─────────────────► │ Dark Mode   │
└─────────────┘                     └─────────────┘
       ▲                                   ▲
       │         prefers-color-scheme      │
       └───────────────────────────────────┘
                  (system preference)
```

---

## Relationships

```
┌─────────────┐
│ Token       │
└─────────────┘
       │ belongs to
       ▼
┌─────────────┐         overrides        ┌─────────────┐
│ TokenSet    │ ────────────────────────► │ TokenSet    │
│ (global)    │                           │ (brand)     │
└─────────────┘                           └─────────────┘
                                                │
                                                │ overrides
                                                ▼
                                          ┌─────────────┐
                                          │ TokenSet    │
                                          │ (mode)      │
                                          └─────────────┘

┌─────────────┐     tokensUsed      ┌─────────────┐
│ Component   │ ───────────────────► │ Token       │
│ Manifest    │                      │ (semantic)  │
└─────────────┘                      └─────────────┘
```

---

## File Structure

```
packages/tokens/src/tokens/
├── global/
│   ├── color.json          # TokenSet (scope: global)
│   ├── typography.json     # TokenSet (scope: global)
│   ├── spacing.json        # TokenSet (scope: global)
│   └── ...
├── brands/
│   ├── default/
│   │   └── tokens.json     # TokenSet (scope: brand, name: default)
│   └── acme/
│       └── tokens.json     # TokenSet (scope: brand, name: acme)
└── modes/
    ├── light.json          # TokenSet (scope: mode, name: light)
    ├── dark.json           # TokenSet (scope: mode, name: dark)
    ├── high-contrast.json  # TokenSet (scope: mode, name: high-contrast)
    └── reduced-motion.json # TokenSet (scope: mode, name: reduced-motion)
```
