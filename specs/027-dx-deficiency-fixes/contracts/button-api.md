# Contract: Unified Button API

## Canonical Button (headless)

Exported from: `@hypoth-ui/react` as `Button`

```typescript
interface ButtonProps {
  /** Press activation callback */
  onPress?: () => void;
  /** Standard click handler (native DOM) */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Key down handler */
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state — shows loading indicator, prevents activation */
  loading?: boolean;
  /** Button type attribute */
  type?: "button" | "submit" | "reset";
  /** Render as child element instead of <button> */
  asChild?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** React children */
  children?: React.ReactNode;
}
```

## DsButton (WC wrapper — renamed from Button)

Exported from: `@hypoth-ui/react/client` as `DsButton`

```typescript
interface DsButtonProps {
  /** Visual variant */
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  /** Size — supports responsive object syntax */
  size?: ResponsiveProp<"sm" | "md" | "lg">;
  /** Click handler (native DOM event on <ds-button>) */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Button type */
  type?: string;
  /** Additional CSS class names */
  className?: string;
  /** React children */
  children?: React.ReactNode;
}
```

## Migration

| Before | After |
|--------|-------|
| `import { Button } from "@hypoth-ui/react"` | No change (already headless) |
| `import { LegacyButton } from "@hypoth-ui/react"` | `import { DsButton } from "@hypoth-ui/react/client"` |
| `import { Button } from "@hypoth-ui/react/client"` | `import { DsButton } from "@hypoth-ui/react/client"` |
