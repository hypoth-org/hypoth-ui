# hypoth-ui Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-03

## Active Technologies
- TypeScript 5.x (strict mode) + Ajv 8.x (JSON Schema validation), gray-matter (frontmatter parsing), glob (file discovery) (002-component-docs-contracts)
- File-based (manifest.json per component, edition-map.json generated) (002-component-docs-contracts)
- TypeScript 5.x (strict mode) + None for runtime (build-time only: tsx for compilation, Ajv for schema validation) (003-dtcg-token-theming)
- File-based (DTCG JSON tokens → compiled CSS/JSON/TS outputs) (003-dtcg-token-theming)
- CSS (native `@layer`), TypeScript 5.x (build tooling only) + PostCSS 8.x (build-time import flattening), postcss-import, cssnano (minification) (004-css-layers)
- N/A (static CSS files) (004-css-layers)
- TypeScript 5.x (strict mode, ES2022 target) + None (zero runtime deps per constitution) (005-behavior-utilities)
- N/A (stateless utilities with closure-captured state) (005-behavior-utilities)
- TypeScript 5.3+ + Lit 3.1+ (Web Components), React 18+ (Next.js adapter), Next.js 14+ (App Router) (006-wc-platform)
- N/A (no persistence layer) (006-wc-platform)
- TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (Web Components), External icon library (Lucide or Heroicons) with adapter (007-baseline-components)
- N/A (stateless UI components) (007-baseline-components)
- TypeScript 5.3+ (strict mode) + Next.js 14+ (App Router), @ds/docs-core, @ds/docs-content, @mdx-js/mdx 3.x, gray-matter 4.x (009-docs-renderer)
- File-based (content packs as npm packages, edition-config.json per deployment) (009-docs-renderer)
- TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (Web Components), `@ds/primitives-dom` (focus-trap, dismissable-layer, roving-focus, type-ahead) (010-forms-overlays)
- TypeScript 5.3+ (strict mode, ES2022 target) + axe-core (automated testing), Vitest (test runner), @ds/docs-core (documentation integration) (011-a11y-audit)
- File-based (JSON artifacts in repository, 5-year retention) (011-a11y-audit)
- TypeScript 5.3+ (strict mode) + @changesets/cli (versioning), conventional-commits (commit format), @ds/docs-core (docs integration) (012-governance-adoption)
- File-based (JSON deprecation registry, markdown templates, changelog files) (012-governance-adoption)
- TypeScript 5.3+ (existing monorepo standard) + None added; removing @ds/governance from active workspace (013-defer-governance)
- N/A (file moves only) (013-defer-governance)
- TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (WC only), React 18+ (React adapter peer dependency) (014-shared-a11y-api)
- TypeScript 5.3+ (strict mode, ES2022 target) + Commander.js (CLI framework), prompts (interactive prompts), picocolors (terminal colors), execa (subprocess execution) (015-cli-tool)
- File-based (ds.config.json local config, remote JSON registry) (015-cli-tool)
- TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (WC only), React 18+ (adapter peer dependency), existing `@ds/primitives-dom` (016-motion-system)
- N/A (stateless animation system) (016-motion-system)
- TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (WC), React 18+ (adapters), date-fns 3.x (DatePicker/TimePicker only) (017-advanced-form-controls)
- TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (WC), React 18+ (adapter peer dependency), `@ds/primitives-dom` (focus-trap, dismissable-layer, roving-focus, type-ahead) (018-structure-nav-overlays)
- TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (WC), React 18+ (adapter peer dependency), `@ds/primitives-dom` (focus-trap, roving-focus, type-ahead) (019-feedback-data-utilities)
- TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (Web Components), React 18+ (adapter peer dependency) (020-layout-primitives)
- N/A (stateless layout components) (020-layout-primitives)
- TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (WC), React 18+ (adapter peer), @ds/primitives-dom (behavior primitives) (021-ds-audit-remediation)
- TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (WC), React 18+ (adapters), Next.js 14+ (SSR/RSC testing) (022-ds-quality-overhaul)
- N/A (stateless UI components; file-based docs/manifests) (022-ds-quality-overhaul)

- TypeScript 5.x (strict mode) + Lit 3.x (WC only), React 18+ (adapter peer), Next.js 14+ (adapter peer) (001-design-system)

## Project Structure

```text
src/
tests/
```

## Commands

```bash
# Build & Test
pnpm build           # Build all packages
pnpm test            # Run unit tests
pnpm lint            # Run Biome linter
pnpm typecheck       # Run TypeScript type checking

# Contract Validation
pnpm --filter @ds/docs-core validate              # Validate manifests + docs
pnpm --filter @ds/docs-core validate --strict     # Strict mode (for CI)
pnpm --filter @ds/docs-core validate --watch      # Watch mode for development
pnpm --filter @ds/docs-core validate:manifests    # Validate manifests only

# Audit & Reports
pnpm --filter @ds/docs-core audit:components              # Table format
pnpm --filter @ds/docs-core audit:components --json       # JSON format
pnpm --filter @ds/docs-core audit:components --markdown   # Markdown format
pnpm --filter @ds/docs-core audit:components --status stable --edition core  # Filter

# Edition-specific Development
pnpm --filter @ds/docs-app dev:core        # Run docs with core edition
pnpm --filter @ds/docs-app dev:pro         # Run docs with pro edition
pnpm --filter @ds/docs-app dev:enterprise  # Run docs with enterprise edition
pnpm --filter @ds/docs-app build:edition-map  # Generate edition map

# Token Commands
pnpm --filter @ds/tokens build              # Build token outputs (CSS, JSON, TS)
pnpm --filter @ds/tokens clean              # Clean dist directory
pnpm --filter @ds/docs-core validate:tokens # Validate tokensUsed references
pnpm --filter @ds/docs-core build:token-docs # Generate token documentation

# Accessibility Commands
pnpm test:a11y                              # Run all accessibility tests
pnpm --filter @ds/wc test:a11y              # Run WC accessibility tests only
pnpm a11y:audit -- -c ds-button --category form-controls  # Start manual audit
pnpm a11y:report -- -v 1.0.0                # Generate conformance report
pnpm a11y:validate                          # Validate audit records

# CLI Tool Commands
pnpm --filter @hypoth-ui/cli build          # Build CLI tool
hypoth-ui init                              # Initialize project config (ds.config.json)
hypoth-ui add button dialog                 # Add components to project
hypoth-ui add button --copy                 # Copy component source instead of package install
hypoth-ui list                              # List available components
hypoth-ui list --installed                  # List installed components
pnpm --filter @hypoth-ui/cli sync:templates # Sync component templates from source
```

## Code Style

TypeScript 5.x (strict mode): Follow standard conventions

## Recent Changes
- 022-ds-quality-overhaul: Added TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (WC), React 18+ (adapters), Next.js 14+ (SSR/RSC testing)
- 021-ds-audit-remediation: Added TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (WC), React 18+ (adapter peer), @ds/primitives-dom (behavior primitives)
- 020-layout-primitives: Added TypeScript 5.3+ (strict mode, ES2022 target) + Lit 3.1+ (Web Components), React 18+ (adapter peer dependency)


<!-- MANUAL ADDITIONS START -->

## Key Patterns

### Event Naming Convention
All custom events use `ds:` prefix with kebab-case names:
- `ds:change` - Value change events
- `ds:open-change` - Open/close state changes
- `ds:press` - Button/link activation
- `ds:select` - Selection events

### Component Architecture
1. **Web Components (Lit)**: Core implementation in `packages/wc/`
2. **React Adapters**: Thin wrappers in `packages/react/` using `createElement`
3. **Behavior Primitives**: Shared logic in `packages/primitives-dom/`

### Responsive Props
Components support responsive object syntax:
```tsx
<Button size={{ base: "sm", md: "md", lg: "lg" }} />
```

### Dev Warnings
Development-only warnings for common misuse patterns:
- DS001: Missing required child element
- DS002: Invalid prop combination
- DS003: Accessibility violation
- DS004: Deprecated usage
- DS005: Missing context
- DS006: Invalid value

### Loading States
Components support `loading` prop with skeleton fallbacks:
```tsx
<Button loading>Saving...</Button>
<DataTable loading loadingItemCount={5} />
```

<!-- MANUAL ADDITIONS END -->
