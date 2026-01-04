# Quickstart: Docs Renderer v1 (Next.js) + White-Label Overlay

**Feature**: 009-docs-renderer
**Date**: 2026-01-03

## Overview

This guide walks through setting up a documentation site with the docs renderer, including:
1. Basic setup with default content
2. Edition-based filtering
3. Tenant branding customization
4. Content overlay workflow

## Prerequisites

- Node.js 20+
- pnpm 10+
- Familiarity with Next.js App Router

## 1. Basic Setup (5 minutes)

### Install Dependencies

```bash
# In your Next.js app directory
pnpm add @ds/docs-renderer-next @ds/docs-content @ds/docs-core
```

### Configure Next.js

```typescript
// next.config.mjs
import { withDocsRenderer } from '@ds/docs-renderer-next/config';

export default withDocsRenderer({
  // Your existing Next.js config
});
```

### Create App Layout

```tsx
// app/layout.tsx
import { DocsLayout } from '@ds/docs-renderer-next/components';
import '@ds/docs-renderer-next/styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DocsLayout>{children}</DocsLayout>
      </body>
    </html>
  );
}
```

### Add Component Routes

```tsx
// app/components/[id]/page.tsx
export { ComponentPage as default, generateStaticParams, generateMetadata }
  from '@ds/docs-renderer-next/pages/component';
```

```tsx
// app/guides/[id]/page.tsx
export { GuidePage as default, generateStaticParams, generateMetadata }
  from '@ds/docs-renderer-next/pages/guide';
```

### Run the Site

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your docs site with default content.

## 2. Edition Filtering (5 minutes)

### Create Edition Config

```json
// edition-config.json (at project root)
{
  "$schema": "./node_modules/@ds/docs-core/schemas/edition-config.schema.json",
  "id": "my-docs",
  "name": "My Docs",
  "edition": "pro"
}
```

### Set Edition via Environment

```bash
# .env.local
DS_EDITION=pro
```

Components marked as "enterprise" will be hidden from navigation and show upgrade prompts.

### Configure Upgrade URL

```json
{
  "edition": "pro",
  "upgrade": {
    "url": "https://example.com/upgrade",
    "ctaText": "Upgrade to Enterprise",
    "message": "This component requires an Enterprise license."
  }
}
```

## 3. Tenant Branding (10 minutes)

### Configure Branding

```json
// edition-config.json
{
  "id": "acme-corp",
  "name": "ACME Design System",
  "edition": "enterprise",
  "branding": {
    "name": "ACME Design System",
    "logo": "/assets/acme-logo.svg",
    "primaryColor": "#E91E63"
  },
  "features": {
    "search": true,
    "darkMode": true,
    "feedback": true
  }
}
```

### Add Logo Asset

Place your logo at `public/assets/acme-logo.svg`.

### Apply Custom CSS (Optional)

```json
{
  "branding": {
    "customCss": "/styles/acme-custom.css"
  }
}
```

```css
/* public/styles/acme-custom.css */
@layer overrides {
  :root {
    --ds-font-family: 'ACME Sans', sans-serif;
  }
}
```

## 4. Content Overlay Workflow (15 minutes)

### Create Tenant Content Pack

```bash
mkdir packages/docs-content-acme
cd packages/docs-content-acme
pnpm init
```

### Configure Package

```json
// packages/docs-content-acme/package.json
{
  "name": "@acme/docs-content",
  "version": "0.0.0",
  "type": "module",
  "docsContent": {
    "type": "overlay",
    "extends": "@ds/docs-content"
  },
  "exports": {
    "./components/*": "./components/*.mdx",
    "./guides/*": "./guides/*.mdx",
    "./edition-config.json": "./edition-config.json"
  },
  "peerDependencies": {
    "@ds/docs-content": "workspace:*"
  }
}
```

### Override a Component Doc

```mdx
---
title: Button
description: ACME-branded button component
component: button
status: stable
---

# Button

Custom documentation for the Button component in ACME's design system.

## ACME Usage Guidelines

Use our button styles consistently across all ACME applications...
```

Place at `packages/docs-content-acme/components/button.mdx`.

### Add a Custom Guide

```mdx
---
title: ACME Brand Guidelines
description: How to use ACME branding in your applications
category: getting-started
order: 1
---

# ACME Brand Guidelines

This guide covers ACME-specific design patterns...
```

Place at `packages/docs-content-acme/guides/brand-guidelines.mdx`.

### Configure Content Packs

```json
// edition-config.json
{
  "id": "acme-corp",
  "name": "ACME Design System",
  "edition": "enterprise",
  "contentPacks": [
    { "package": "@acme/docs-content", "priority": 10 }
  ],
  "branding": {
    "name": "ACME Design System",
    "logo": "/assets/acme-logo.svg",
    "primaryColor": "#E91E63"
  }
}
```

### Install and Build

```bash
# From monorepo root
pnpm install
pnpm build
```

### Verify Overlay

1. Navigate to `/components/button` - should show ACME content
2. Navigate to `/guides/brand-guidelines` - should show new guide
3. Other components should show base content

## 5. Feature Toggles

### Disable Features

```json
{
  "features": {
    "search": false,
    "darkMode": false,
    "versionSwitcher": false,
    "feedback": false,
    "sourceLinks": false
  }
}
```

### Check Features in Components

```tsx
import { useFeatures } from '@ds/docs-renderer-next/hooks';

function MyComponent() {
  const { search, darkMode } = useFeatures();

  return (
    <>
      {search && <SearchInput />}
      {darkMode && <ThemeSwitcher />}
    </>
  );
}
```

## 6. Search Index (Stub)

Search index is generated at build time:

```bash
pnpm build
# Generates public/search-index.json
```

The search UI is a stub in v1. Index can be used with custom search implementation.

## Common Tasks

### Hide Specific Components

```json
{
  "visibility": {
    "hiddenComponents": ["internal-component", "deprecated-widget"]
  }
}
```

### Show Components Regardless of Edition

```json
{
  "visibility": {
    "shownComponents": ["special-component"]
  }
}
```

### Run Edition-Specific Dev Server

```bash
DS_EDITION=core pnpm dev    # Core edition
DS_EDITION=pro pnpm dev     # Pro edition
DS_EDITION=enterprise pnpm dev  # Enterprise edition
```

## Troubleshooting

### Content Not Updating

1. Clear `.next` cache: `rm -rf .next`
2. Rebuild content packs: `pnpm build`
3. Verify edition-config.json is valid

### Overlay Not Applied

1. Check package is installed: `pnpm ls @acme/docs-content`
2. Verify priority is set (higher = checked first)
3. Check file paths match exactly (case-sensitive)

### Branding Colors Not Applied

1. Verify hex format: `#RRGGBB` (6 digits)
2. Check CSS layers aren't being overridden
3. Inspect CSS custom properties in browser DevTools

## Next Steps

- Read the [Data Model](./data-model.md) for entity details
- Review [Contracts](./contracts/) for schema specifications
- Check [Research](./research.md) for technical decisions
