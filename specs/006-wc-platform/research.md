# Research: Web Components Platform Conventions

**Feature**: 006-wc-platform
**Date**: 2026-01-02

## DSElement Base Class Pattern

### Decision
Extend `LitElement` with `createRenderRoot() { return this; }` to enable Light DOM rendering. Name the class `DSElement` for clarity.

### Rationale
- Light DOM allows external CSS (from @ds/css and consumer stylesheets) to style component internals directly
- Enables form integration (autocomplete, form association) which doesn't work in Shadow DOM
- Simplifies testing with standard DOM APIs (querySelector works from any scope)
- Events bubble naturally without needing `composed: true` workarounds
- Aligns with constitution principle: "Light DOM everywhere"

### Alternatives Considered
1. **Shadow DOM (Lit default)**: Provides encapsulation but blocks external styling, breaks form features, and requires complex `::part` workarounds
2. **Hybrid (Shadow DOM + slots)**: More complex, still has form issues, doesn't align with constitution
3. **No base class (each component implements)**: Leads to inconsistency and duplication

### Key Implementation Notes
- Light DOM means no `<slot>` elements—use direct DOM composition instead
- CSS from @ds/css applies directly to component internals
- Reactive properties work the same; use `reflect: true` when CSS needs to target attribute selectors
- Custom events can use `bubbles: true, composed: true` for maximum interoperability

---

## Component Registry Format

### Decision
Use a static TypeScript object export mapping tag names to component classes:

```typescript
export const componentRegistry = {
  'ds-button': DsButton,
  'ds-input': DsInput,
  // ...
} as const;
```

### Rationale
- Single source of truth for all component registrations
- Enables tree-shaking when combined with proper entry points
- Type-safe: TypeScript validates registry entries
- Simple to maintain and understand
- Works with existing @ds/wc export patterns

### Alternatives Considered
1. **JSON manifest file**: Requires build-time processing to resolve module paths; harder to tree-shake
2. **Convention-based discovery**: Needs build tooling to scan filesystem; magic behavior
3. **Decorator-based**: Requires experimental TypeScript features or build plugins

### Key Implementation Notes
- Registry lives in `@ds/wc/src/registry/registry.ts`
- Each component exports its class without self-registering
- Loader imports registry and calls `define()` for each entry
- Adding a component = export class + add to registry

---

## Event Naming Convention

### Decision
Custom events use `ds:{event-name}` format with `bubbles: true` and `composed: true` by default.

### Rationale
- Namespaced prefix prevents collision with native DOM events
- Bubbles: enables event delegation patterns at any ancestor level
- Composed: allows events to cross shadow boundaries when ds-* components are used inside third-party Shadow DOM components
- Lowercase with hyphen separators matches native event conventions

### Event Helper
Create a utility function to standardize event emission:

```typescript
function emitEvent(element: HTMLElement, name: string, detail?: unknown) {
  element.dispatchEvent(new CustomEvent(`ds:${name}`, {
    bubbles: true,
    composed: true,
    detail
  }));
}
```

---

## Next.js Integration Pattern

### Decision
Use a single `'use client'` component (DsLoader) that registers all components via `useEffect` and dynamic import.

### Rationale
- Minimal client boundary: only one `'use client'` directive needed
- SSR-safe: custom elements render as empty tags on server (valid HTML)
- Hydration-safe: registration happens after initial render, no mismatches
- Clean separation: server knows nothing about component internals

### Current Implementation Analysis
Existing code in `@ds/next` follows this pattern:
- `element-loader.tsx`: Client component with useEffect-based registration
- `register.ts`: Guards with `typeof window === "undefined"` check

### Enhancements Needed
1. Update `register.ts` to use the centralized registry
2. Ensure registration order is deterministic
3. Add logging for duplicate registration attempts (warn, don't error)

### Alternatives Considered
1. **Blocking script in head**: Prevents FOUC but blocks rendering
2. **@lit-labs/nextjs**: Full SSR with Declarative Shadow DOM—unnecessary for Light DOM approach
3. **Module-level registration**: Causes side effects on import, breaks tree-shaking

---

## Enforcement Script Approach

### Decision
Use ts-morph (TypeScript Compiler API wrapper) to create a standalone AST-based script that detects top-level `customElements.define()` calls.

### Rationale
- ts-morph provides cleaner API than raw TypeScript Compiler API
- Already using TypeScript 5.x; no need for Babel/Acorn which require TS plugins
- Can detect scope depth to distinguish top-level (side-effect) vs function-scoped calls
- Integrates with existing tooling (tsx for execution, glob for file discovery)
- No runtime dependencies: script runs during CI/build only

### Detection Logic
1. Parse TypeScript files using ts-morph
2. Find all `CallExpression` nodes where callee matches `customElements.define`
3. Check if call is at module scope (no function/class ancestor)
4. Module-scope calls = side-effect = violation

### Integration Points
- Run as pnpm script: `pnpm check:auto-define`
- Add to CI pipeline in `.github/workflows/ci.yml`
- Optional: Add as pre-commit hook via husky/lint-staged

### Alternatives Considered
1. **ESLint rule**: Would require adding ESLint alongside Biome
2. **Biome plugin**: Requires Rust, significantly more complex
3. **Runtime detection**: Too late; we want to catch at build time

---

## Documentation Strategy

### Decision
Create a focused guide at `apps/docs/content/guides/nextjs-app-router.mdx` covering:
1. Adding DsLoader to root layout
2. Using components in Server and Client Components
3. Troubleshooting common issues

### Rationale
- Single, focused document is easier to maintain than scattered references
- MDX allows interactive examples
- Lives alongside other docs in established structure

### Content Outline
1. Quick Start (3-step setup)
2. Understanding SSR with Custom Elements
3. Using in Server Components
4. Using in Client Components
5. Event Handling
6. TypeScript Support
7. Troubleshooting

---

## Summary of Decisions

| Area | Decision | Key Benefit |
|------|----------|-------------|
| Base Class | DSElement with Light DOM | CSS/form integration |
| Registry | Static TS object | Tree-shakeable, type-safe |
| Events | `ds:{name}`, bubbles+composed | Interoperability |
| Next.js | Single DsLoader client boundary | Minimal hydration surface |
| Enforcement | ts-morph AST script | Build-time detection |
| Docs | Focused MDX guide | Clear, maintainable |
