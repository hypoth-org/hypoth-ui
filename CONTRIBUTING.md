# Contributing to the Design System

Thank you for contributing to our design system! This guide will help you add new components and contribute effectively.

## Prerequisites

- Node.js 20+
- pnpm 8+

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Build all packages: `pnpm build`
4. Start development: `pnpm dev`

## Adding a New Component

### Quick Start

Use the component generator to create all required files:

```bash
pnpm new-component <component-name> [category] [description]

# Examples
pnpm new-component card layout "A container for grouping content"
pnpm new-component dialog overlay "A modal dialog component"
pnpm new-component input forms "A text input field"
```

This creates:
- Web Component: `packages/wc/src/components/<name>/<name>.ts`
- Component CSS: `packages/wc/src/components/<name>/<name>.css`
- React wrapper: `packages/react/src/components/<name>.tsx`
- Manifest: `packages/docs-content/manifests/<name>.json`
- Documentation: `packages/docs-content/components/<name>.mdx`

### Manual Steps After Generation

1. **Update Web Component exports**

   Edit `packages/wc/src/index.ts`:
   ```ts
   export { Ds<Name>, type <Name>Variant } from "./components/<name>/<name>.js";
   ```

2. **Update React exports**

   Edit `packages/react/src/index.ts`:
   ```ts
   export { <Name>, type <Name>Props } from "./components/<name>.js";
   ```

3. **Build and validate**

   ```bash
   pnpm build
   pnpm validate:manifests
   ```

## Component Guidelines

### Web Component Structure

Each Web Component should:
- Extend `LightElement` for Light DOM rendering
- Use `@property` decorators for reactive properties
- Use `html` template literals for rendering
- Be registered with `define("ds-<name>", DsName)`

```ts
import { html } from "lit";
import { property } from "lit/decorators.js";
import { LightElement } from "../../base/light-element.js";
import { define } from "../../registry/define.js";

export class DsMyComponent extends LightElement {
  @property({ type: String, reflect: true })
  variant = "default";

  override render() {
    return html`<div class="ds-my-component"><slot></slot></div>`;
  }
}

define("ds-my-component", DsMyComponent);
```

### CSS Guidelines

- Use CSS custom properties from `@ds/tokens`
- Place styles in `@layer components`
- Follow BEM-like naming: `ds-component`, `ds-component__element`, `ds-component--modifier`

```css
@layer components {
  ds-my-component {
    display: block;
  }

  .ds-my-component {
    padding: var(--ds-spacing-md);
    background: var(--ds-color-background-default);
  }
}
```

### React Wrapper Guidelines

- Use `forwardRef` for ref forwarding
- Use `createElement` instead of JSX for custom elements
- Map props to Web Component attributes

### Manifest Requirements

All manifests must include:
- `id`: kebab-case identifier
- `name`: Display name
- `status`: alpha | beta | stable | deprecated
- `availabilityTags`: ["public"] at minimum
- `platforms`: ["wc", "react"] for most components
- `a11y`: Accessibility information
- `tokensUsed`: List of design tokens used
- `props`: Property documentation
- `category`: Navigation category

Validate with:
```bash
pnpm validate:manifests
```

### Documentation Guidelines

MDX files should include:
- Frontmatter with title, description, componentId
- Usage examples for both HTML and React
- All variants documented
- Accessibility section
- Best practices (Do/Don't)

## Testing

### Unit Tests

```bash
pnpm test                 # Run all tests
pnpm --filter @ds/wc test # Run WC tests only
```

### Accessibility Tests

```bash
pnpm test:a11y
```

### E2E Tests

```bash
pnpm test:e2e
```

## Code Style

We use Biome for linting and formatting:

```bash
pnpm lint        # Check for issues
pnpm lint:fix    # Auto-fix issues
pnpm format      # Format code
pnpm check       # Run all checks
```

## Pull Request Process

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Make your changes
3. Run checks: `pnpm check && pnpm build && pnpm test`
4. Commit with conventional commits: `feat: add card component`
5. Push and create a PR

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

## Questions?

Open an issue or discussion for questions about contributing.
