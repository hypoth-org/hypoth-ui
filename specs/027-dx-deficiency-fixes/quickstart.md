# Quickstart: DX Deficiency Fixes

## Phase 1: Critical Blockers (Patch Release)

### 1A. Fix workspace:* in @hypoth-ui/react peerDeps

```bash
# In packages/react/package.json, change peerDependencies:
# "@hypoth-ui/wc": "workspace:*"  →  "@hypoth-ui/wc": ">=0.1.0"
```

### 1B. Add "use client" to main React entry

```bash
# Add "use client"; as line 1 of packages/react/src/index.ts
```

### 1C. Widen peer dep ranges

```bash
# packages/react/package.json peerDependencies:
#   "react": "^18.0.0 || ^19.0.0"
#   "react-dom": "^18.0.0 || ^19.0.0"
#
# packages/next/package.json peerDependencies:
#   "next": "^14.0.0 || ^15.0.0"
#   "react": "^18.0.0 || ^19.0.0"
#   "react-dom": "^18.0.0 || ^19.0.0"
```

**Verify**: `pnpm build && pnpm test`
**Publish**: Create changeset (patch), push, merge version PR, trigger release.

## Phase 2: API Consolidation (Breaking Alpha Release)

### 2. Unify Button

```bash
# packages/react/src/index.ts:
#   Remove: export { Button as LegacyButton } from "./components/button.js"
#   Keep:   export { Button } from "./components/button/index.js"
#
# packages/react/src/client.ts:
#   Change: export { Button } → export { Button as DsButton }
#   Change: export { ButtonProps } → export { ButtonProps as DsButtonProps }
```

### 3. Standardize event naming

```bash
# Audit all React components — most are already correct.
# Key change: WC wrapper button onClick stays (it's a standard DOM event on DsButton).
# Document convention in CONTRIBUTING.md.
```

### 4. Fix CSS ↔ WC circular dep

```bash
# packages/css/package.json:
#   Move "@hypoth-ui/wc": "workspace:*" from dependencies → devDependencies
```

**Verify**: `pnpm build && pnpm test`
**Publish**: Create changeset (minor bump with breaking changes), push, merge, release.

## Phase 3: Documentation & New Component

### 5. Document DsLoader selective loading

Add to README.md and packages/next/README.md:

```tsx
// Register only specific components (reduces bundle)
<DsLoader include={["ds-button", "ds-dialog"]} />

// Register all except specific components
<DsLoader exclude={["ds-data-table"]} />
```

### 6. Add EmptyState component

```bash
# Create files:
#   packages/wc/src/components/empty-state/empty-state.ts
#   packages/react/src/components/empty-state/index.tsx
#   packages/css/src/layers/components.css (add empty-state styles)
#   packages/cli/templates/empty-state/ (CLI template)
#   packages/cli/registry/components.json (add entry)
```

**Verify**: `pnpm build && pnpm test && pnpm test:a11y`
**Publish**: Create changeset (patch), push, merge, release.
