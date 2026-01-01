# hypoth-ui Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-01

## Active Technologies
- TypeScript 5.x (strict mode) + Ajv 8.x (JSON Schema validation), gray-matter (frontmatter parsing), glob (file discovery) (002-component-docs-contracts)
- File-based (manifest.json per component, edition-map.json generated) (002-component-docs-contracts)

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
```

## Code Style

TypeScript 5.x (strict mode): Follow standard conventions

## Recent Changes
- 002-component-docs-contracts: Added TypeScript 5.x (strict mode) + Ajv 8.x (JSON Schema validation), gray-matter (frontmatter parsing), glob (file discovery)

- 001-design-system: Added TypeScript 5.x (strict mode) + Lit 3.x (WC only), React 18+ (adapter peer), Next.js 14+ (adapter peer)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
