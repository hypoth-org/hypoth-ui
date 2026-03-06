# Research: Framework-Specific Demo Showcases

**Date**: 2026-01-16
**Feature**: 025-demo-showcases

## Research Topics

### 1. Vite Configuration for Web Components

**Decision**: Use Vite 5.x with vanilla TypeScript template

**Rationale**:
- Vite's native ES module support aligns with Web Components' module-based architecture
- No framework overhead—demonstrates WC can work without React/Vue/etc.
- Fast HMR for development experience parity with Next.js
- Built-in TypeScript support without additional configuration

**Alternatives considered**:
- **Parcel**: Similar zero-config approach but less ecosystem adoption
- **esbuild direct**: Too low-level for app development; no dev server
- **Rollup**: More configuration required; Vite uses Rollup under the hood anyway

**Configuration notes**:
- Use `vite-plugin-static-copy` for shared assets from @hypoth-ui/demo-shared
- Configure `resolve.alias` to map workspace packages

### 2. Theme Persistence Strategy

**Decision**: localStorage with system preference fallback

**Rationale**:
- localStorage persists across browser sessions (spec requirement)
- System preference (`prefers-color-scheme`) used for first-time visitors
- No server-side storage needed—keeps demos stateless
- Consistent with common design system demos (shadcn, Radix)

**Alternatives considered**:
- **sessionStorage**: Doesn't persist across sessions (rejected per spec)
- **Cookie-based**: Overkill for client-only demos; adds server concerns
- **URL parameter**: Would break when sharing links with unexpected theme

**Implementation pattern**:
```typescript
// Pseudocode for theme initialization
const stored = localStorage.getItem('theme');
const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const theme = stored ?? system;
document.documentElement.setAttribute('data-theme', theme);
```

### 3. Responsive Sidebar Pattern

**Decision**: CSS-driven with minimal JavaScript state

**Rationale**:
- CSS media queries handle breakpoint detection (no JS resize listeners)
- Single `expanded` state controls sidebar visibility
- Mobile drawer uses existing `@hypoth-ui/wc` Sheet component
- Follows shadcn sidebar-07 reference pattern

**Alternatives considered**:
- **JavaScript breakpoint detection**: Adds complexity; prone to hydration mismatches
- **Separate mobile/desktop components**: Duplicates logic; harder to maintain
- **CSS Container Queries**: Browser support still maturing; media queries sufficient

**Breakpoint implementation**:
```css
/* Desktop: expanded sidebar */
@media (min-width: 1025px) {
  .sidebar { width: 240px; }
}

/* Tablet: collapsed icons */
@media (min-width: 768px) and (max-width: 1024px) {
  .sidebar { width: 64px; }
  .sidebar-label { display: none; }
}

/* Mobile: hidden, shown via drawer */
@media (max-width: 767px) {
  .sidebar { display: none; }
  .mobile-nav-trigger { display: block; }
}
```

### 4. Visual Regression Testing Strategy

**Decision**: Playwright visual comparisons with snapshot threshold

**Rationale**:
- Playwright already in monorepo for E2E tests
- Built-in `toHaveScreenshot()` with configurable threshold
- Can run both demos side-by-side and compare
- CI integration via existing workflow

**Alternatives considered**:
- **Percy/Chromatic**: External service; adds cost and complexity
- **jest-image-snapshot**: Less maintained; Playwright handles this natively
- **Manual comparison**: Not scalable; defeats automation purpose

**Test structure**:
```typescript
// Pseudocode for visual parity test
test('dashboard layout matches between demos', async ({ page }) => {
  // Capture React demo
  await page.goto('http://localhost:3001/');
  const reactScreenshot = await page.screenshot();

  // Capture WC demo
  await page.goto('http://localhost:3002/');
  const wcScreenshot = await page.screenshot();

  // Compare with 5% threshold (95% parity requirement)
  expect(wcScreenshot).toMatchSnapshot('dashboard.png', { threshold: 0.05 });
});
```

### 5. Shared Package Architecture

**Decision**: Pure TypeScript package with JSON data exports

**Rationale**:
- No runtime dependencies—just data and types
- Tree-shakeable exports for each content section
- Assets served via static file copying (not bundled)
- Both frameworks can import identically

**Alternatives considered**:
- **JSON files only**: Loses TypeScript type safety
- **Bundled assets**: Increases package size; complicates caching
- **Separate data and types packages**: Over-engineered for this use case

**Package structure**:
```typescript
// @hypoth-ui/demo-shared exports
export { navigation } from './navigation';
export { mockUsers, mockProducts, mockNotifications } from './mock-data';
export { dashboardContent, formsContent, ... } from './content';
export type { NavItem, User, Product, Notification } from './types';
```

### 6. Client-Side Routing for demo-wc

**Decision**: Hash-based routing with vanilla JavaScript

**Rationale**:
- No framework router needed—keeps demo lightweight
- Hash routing works without server configuration
- Simple pattern matching for 5 static routes
- Demonstrates WC can work without SPA frameworks

**Alternatives considered**:
- **History API**: Requires server fallback configuration
- **@vaadin/router**: Adds dependency; overkill for 5 routes
- **Page.js**: Unmaintained; security concerns

**Implementation pattern**:
```typescript
// Simple hash router
window.addEventListener('hashchange', () => {
  const route = location.hash.slice(1) || 'dashboard';
  renderPage(route);
});
```

## Summary

All technical decisions align with the constitution principles:
- **Performance**: Vite, CSS-driven responsive, minimal JS state
- **Accessibility**: Existing APG-compliant components, keyboard nav
- **Customizability**: Token consumption, CSS layers

No blocking unknowns remain. Ready for Phase 1.
