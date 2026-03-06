# Data Model: Framework-Specific Demo Showcases

**Date**: 2026-01-16
**Feature**: 025-demo-showcases

## Overview

This feature has minimal data modeling requirements. The demos are stateless showcases with:
- Local theme state (persisted to localStorage)
- Mock data for component demonstrations
- Navigation configuration

No backend APIs or persistent storage beyond localStorage.

## Entities

### ThemeState

Represents the current theme preference for the application.

| Field | Type | Description |
|-------|------|-------------|
| `mode` | `'light' \| 'dark'` | Current theme mode |
| `source` | `'user' \| 'system'` | Whether user explicitly set or inherited from OS |

**Persistence**: localStorage key `ds-demo-theme`

**State transitions**:
- Initial → `system` preference detected → ThemeState created
- User toggles → `source` becomes `'user'`, `mode` flips
- User clears storage → reverts to `system` preference

### NavItem

Represents a navigation entry in the sidebar.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (kebab-case) |
| `label` | `string` | Display text |
| `icon` | `string` | Icon identifier (e.g., 'home', 'form', 'table') |
| `href` | `string` | Route path (React) or hash (WC) |
| `section` | `string` | Parent section for grouping |

**Validation**:
- `id` must be unique across all nav items
- `href` must start with `/` (React) or `#` (WC)

### NavSection

Represents a group of navigation items.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Section identifier |
| `label` | `string` | Section heading (optional, can be empty for flat nav) |
| `items` | `NavItem[]` | Navigation items in this section |

**Fixed sections** (per spec clarification):
1. Dashboard (id: `dashboard`)
2. Forms (id: `forms`)
3. Data Display (id: `data-display`)
4. Overlays (id: `overlays`)
5. Feedback (id: `feedback`)

## Mock Data Entities

### MockUser

For avatar and user profile demonstrations.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | Display name |
| `email` | `string` | Email address |
| `avatar` | `string \| null` | Avatar URL or null for fallback |
| `role` | `string` | User role (e.g., 'Admin', 'Member') |
| `status` | `'active' \| 'inactive' \| 'pending'` | Account status |

### MockProduct

For data table and card demonstrations.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Product identifier |
| `name` | `string` | Product name |
| `description` | `string` | Short description |
| `price` | `number` | Price in cents |
| `category` | `string` | Product category |
| `inStock` | `boolean` | Availability flag |
| `imageUrl` | `string \| null` | Product image URL |

### MockNotification

For toast and alert demonstrations.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Notification identifier |
| `type` | `'info' \| 'success' \| 'warning' \| 'error'` | Notification severity |
| `title` | `string` | Notification heading |
| `message` | `string` | Notification body |
| `timestamp` | `string` | ISO timestamp |
| `read` | `boolean` | Read status |

## Content Configuration

### SectionContent

Describes what components are showcased in each navigation section.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Section identifier |
| `title` | `string` | Page heading |
| `description` | `string` | Section description |
| `components` | `ComponentShowcase[]` | Components to demonstrate |

### ComponentShowcase

Individual component demonstration configuration.

| Field | Type | Description |
|-------|------|-------------|
| `component` | `string` | Component name (e.g., 'Button', 'Dialog') |
| `title` | `string` | Showcase title |
| `description` | `string` | What this demonstrates |
| `variants` | `string[]` | Variants to show (e.g., ['primary', 'secondary']) |
| `interactive` | `boolean` | Whether demo is interactive or static |

## Relationships

```
NavSection 1──* NavItem
    │
    └── maps to ──> SectionContent 1──* ComponentShowcase

ThemeState (singleton, persisted)

MockUser, MockProduct, MockNotification (read-only demo data)
```

## Type Definitions

All types are defined in `@hypoth-ui/demo-shared/src/types.ts` and exported for consumption by both demo apps.
