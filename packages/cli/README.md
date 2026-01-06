# @hypoth-ui/cli

CLI tool for adding hypoth-ui components to your project.

## Installation

```bash
npx @hypoth-ui/cli init
```

Or install globally:

```bash
npm install -g @hypoth-ui/cli
```

## Quick Start

1. Initialize hypoth-ui in your project:

```bash
npx @hypoth-ui/cli init
```

2. Add components:

```bash
npx @hypoth-ui/cli add button
npx @hypoth-ui/cli add dialog menu
```

3. List available components:

```bash
npx @hypoth-ui/cli list
```

## Commands

### `init`

Initialize hypoth-ui in your project. Creates `ds.config.json` and installs core dependencies.

```bash
npx @hypoth-ui/cli init [options]
```

Options:
- `-s, --style <style>` - Installation style: `copy` (source files) or `package` (npm packages)
- `-f, --framework <framework>` - Framework: `react`, `next`, `wc`, or `vanilla`
- `-y, --yes` - Skip prompts and use defaults

### `add`

Add components to your project.

```bash
npx @hypoth-ui/cli add <components...> [options]
```

Options:
- `-o, --overwrite` - Overwrite existing components
- `-a, --all` - Add all available components

Examples:
```bash
npx @hypoth-ui/cli add button          # Add single component
npx @hypoth-ui/cli add button dialog   # Add multiple components
npx @hypoth-ui/cli add --all           # Add all components
npx @hypoth-ui/cli add button -o       # Overwrite existing
```

### `list`

List all available components.

```bash
npx @hypoth-ui/cli list [options]
```

Options:
- `-j, --json` - Output as JSON

### `diff`

Check for component updates.

```bash
npx @hypoth-ui/cli diff [options]
```

Options:
- `-j, --json` - Output as JSON

## Installation Modes

### Package Mode (Recommended)

Components are installed as npm packages. Easier to update, tree-shakeable.

```bash
npx @hypoth-ui/cli init --style package
```

### Copy Mode

Component source files are copied to your project. Full customization, you own the code.

```bash
npx @hypoth-ui/cli init --style copy
```

## Configuration

Configuration is stored in `ds.config.json`:

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

## Supported Frameworks

- **React** - Standard React applications
- **Next.js** - Next.js App Router projects
- **Web Components** - Lit-based Web Components
- **Vanilla** - Vanilla JS using Web Components

## Supported Package Managers

- npm
- pnpm
- yarn
- bun

The CLI automatically detects your package manager from lock files.

## License

MIT
