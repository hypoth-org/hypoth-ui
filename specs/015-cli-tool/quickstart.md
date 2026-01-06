# Quickstart: @hypoth-ui/cli

## Installation

The CLI is designed for npx usage (no global install required):

```bash
npx @hypoth-ui/cli init
```

Or install globally for frequent use:

```bash
npm install -g @hypoth-ui/cli
```

## Basic Usage

### 1. Initialize a Project

```bash
# Auto-detect framework and package manager
npx @hypoth-ui/cli init

# The CLI will:
# - Detect your framework (React, Next.js, or Web Components)
# - Detect your package manager (npm, pnpm, yarn, bun)
# - Create ds.config.json
# - Install @hypoth-ui/tokens
# - Configure CSS imports
```

### 2. Add Components

```bash
# Add a single component
npx @hypoth-ui/cli add button

# Add multiple components
npx @hypoth-ui/cli add button dialog menu

# Add all available components
npx @hypoth-ui/cli add --all
```

### 3. List Available Components

```bash
# See all components (works without init)
npx @hypoth-ui/cli list
```

### 4. Check for Updates

```bash
# See which components have newer versions
npx @hypoth-ui/cli diff
```

## Configuration

After running `init`, a `ds.config.json` file is created:

```json
{
  "$schema": "https://hypoth-ui.dev/schema/ds.config.json",
  "style": "package",
  "framework": "next",
  "typescript": true,
  "packageManager": "pnpm",
  "paths": {
    "components": "src/components/ui",
    "utils": "src/lib"
  },
  "aliases": {
    "components": "@/components/ui",
    "lib": "@/lib"
  },
  "components": []
}
```

### Installation Modes

**Package Mode (default)**: Components installed as npm dependencies
- Easier updates via package manager
- Automatic security patches
- Smaller git repository

```bash
npx @hypoth-ui/cli init --style package
```

**Copy Mode**: Component source copied to your project
- Full ownership and customization
- No version conflicts
- Works offline after copy

```bash
npx @hypoth-ui/cli init --style copy
```

## Examples

### Next.js Project

```bash
# Create new Next.js app
npx create-next-app@latest my-app
cd my-app

# Initialize hypoth-ui
npx @hypoth-ui/cli init

# Add button component
npx @hypoth-ui/cli add button

# Use in your code
```

```tsx
// app/page.tsx
import { Button } from "@hypoth-ui/react";

export default function Home() {
  return (
    <Button onPress={() => console.log("clicked")}>
      Click me
    </Button>
  );
}
```

### Web Components Project

```bash
# Initialize for WC
npx @hypoth-ui/cli init --framework wc

# Add button
npx @hypoth-ui/cli add button

# Use in HTML
```

```html
<script type="module">
  import "@hypoth-ui/wc/button";
</script>

<ds-button>Click me</ds-button>
```

## Command Reference

| Command | Description |
|---------|-------------|
| `init` | Initialize project configuration |
| `add <components...>` | Add one or more components |
| `add --all` | Add all available components |
| `list` | List available components |
| `diff` | Check for component updates |

### Flags

| Flag | Description |
|------|-------------|
| `--style <mode>` | Installation mode: `copy` or `package` |
| `--framework <fw>` | Force framework: `react`, `next`, `wc`, `vanilla` |
| `--overwrite` | Overwrite existing components |
| `--help` | Show help |
| `--version` | Show version |

## Troubleshooting

### "No package.json found"

The CLI requires a JavaScript/TypeScript project. Initialize with:

```bash
npm init -y
```

### "Component already exists"

Use `--overwrite` to replace:

```bash
npx @hypoth-ui/cli add button --overwrite
```

### "Framework not detected"

Specify manually:

```bash
npx @hypoth-ui/cli init --framework react
```
