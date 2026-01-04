# @ds/docs-renderer-next

Next.js 14+ documentation renderer with white-label support, edition filtering, and tenant branding.

## Quickstart

### Installation

```bash
pnpm add @ds/docs-renderer-next @ds/docs-core
```

### Basic Setup

1. Create an `edition-config.json` in your project root:

```json
{
  "id": "my-docs",
  "name": "My Documentation",
  "edition": "enterprise",
  "branding": {
    "name": "My Design System",
    "primaryColor": "#0066cc"
  },
  "features": {
    "search": true,
    "darkMode": true,
    "feedback": false
  }
}
```

2. Add content to your project:

```
my-docs/
├── edition-config.json
├── components/
│   └── button.mdx
└── guides/
    └── getting-started.mdx
```

3. Start the development server:

```bash
pnpm dev
```

## Features

### Edition Filtering

Filter components and content by edition tier:

- `core` - Basic components available to all users
- `pro` - Advanced components for paid users
- `enterprise` - Full feature set for enterprise customers

### Tenant Branding

Customize the documentation appearance:

```json
{
  "branding": {
    "name": "Acme Design System",
    "logo": "/acme-logo.svg",
    "primaryColor": "#7c3aed",
    "favicon": "/acme-favicon.ico"
  }
}
```

### Content Overlay

Override base documentation with tenant-specific content:

```json
{
  "contentPacks": [
    {
      "package": "@acme/docs-content",
      "priority": 10
    }
  ]
}
```

Higher priority packs override lower priority content.

### Feature Toggles

Enable or disable documentation features:

```json
{
  "features": {
    "search": true,
    "darkMode": true,
    "versionSwitcher": false,
    "feedback": false,
    "sourceLinks": true
  }
}
```

### Search Index

Generate a search index at build time:

```bash
pnpm build:search-index
```

## Configuration Reference

### EditionConfigExtended

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for this edition config |
| `name` | string | Display name for the documentation |
| `edition` | "core" \| "pro" \| "enterprise" | Edition tier |
| `branding` | BrandingConfig | Branding customization |
| `features` | FeatureConfig | Feature toggles |
| `contentPacks` | ContentPackConfig[] | Content overlay packs |
| `visibility` | VisibilityConfig | Content visibility rules |
| `upgrade` | UpgradeConfig | Upgrade prompt configuration |

### BrandingConfig

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Brand name displayed in header |
| `logo` | string | URL to logo image |
| `primaryColor` | string | Primary brand color (CSS color) |
| `favicon` | string | URL to favicon |

### FeatureConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `search` | boolean | true | Enable search functionality |
| `darkMode` | boolean | true | Enable dark mode toggle |
| `versionSwitcher` | boolean | false | Enable version switcher |
| `feedback` | boolean | false | Enable feedback widget |
| `sourceLinks` | boolean | true | Enable links to source code |

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Generate search index
pnpm build:search-index

# Type check
pnpm typecheck
```

## Architecture

```
docs-renderer-next/
├── app/                    # Next.js App Router pages
│   ├── components/[id]/    # Component documentation pages
│   ├── guides/[id]/        # Guide pages
│   └── layout.tsx          # Root layout with branding
├── components/             # React components
│   ├── branding/           # Branding components (logo, header)
│   ├── feedback/           # Feedback widget
│   ├── search/             # Search components
│   └── upgrade/            # Upgrade prompt
├── lib/                    # Shared utilities
│   ├── branding-context.tsx # React context for branding
│   └── content-resolver.ts  # Content resolution utilities
└── styles/                 # Global styles
```

## License

MIT
