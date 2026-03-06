# Contracts: Framework-Specific Demo Showcases

**Date**: 2026-01-16
**Feature**: 025-demo-showcases

## Overview

This feature has **no API contracts** in the traditional sense. The demos are:
- Client-side only (no backend APIs)
- Stateless (no server-side data persistence)
- Self-contained (all data is mock data bundled with the app)

## Internal Contracts

The following internal contracts exist between the shared package and demo apps:

### @hypoth-ui/demo-shared Exports

```typescript
// Navigation
export const navigation: NavSection[];
export type NavSection, NavItem;

// Mock Data
export const mockUsers: MockUser[];
export const mockProducts: MockProduct[];
export const mockNotifications: MockNotification[];
export type MockUser, MockProduct, MockNotification;

// Content Configuration
export const sectionContent: Record<string, SectionContent>;
export type SectionContent, ComponentShowcase;

// Assets (paths, not bundled)
export const assetPaths: {
  logo: string;
  placeholderAvatar: string;
};
```

### Theme Contract

Both demos implement identical theme toggling:

```typescript
interface ThemeContract {
  // Read current theme
  getTheme(): 'light' | 'dark';

  // Set theme (persists to localStorage)
  setTheme(mode: 'light' | 'dark'): void;

  // Toggle between light/dark
  toggleTheme(): void;

  // Subscribe to theme changes
  onThemeChange(callback: (mode: 'light' | 'dark') => void): () => void;
}
```

### Responsive Breakpoint Contract

Both demos implement identical breakpoint behavior:

| Breakpoint | Width | Sidebar Behavior |
|------------|-------|------------------|
| Desktop | >1024px | Expanded (240px, labels visible) |
| Tablet | 768-1024px | Collapsed (64px, icons only) |
| Mobile | <768px | Hidden (hamburger menu triggers drawer) |

## Visual Parity Contract

The visual regression tests enforce:
- **95% pixel parity** between React and WC demos at each breakpoint
- **Identical** navigation structure and labels
- **Matching** component showcase layouts
- **Same** theme toggle placement and behavior
