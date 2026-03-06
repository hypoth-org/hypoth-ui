# @hypoth-ui/cli

![Alpha](https://img.shields.io/badge/status-alpha-orange)

CLI tool for scaffolding and managing hypoth-ui components in your project. Initialize configuration, browse available components, and add them with a single command.

## Installation

```bash
npm install -g @hypoth-ui/cli
```

Or use directly with `npx`:

```bash
npx @hypoth-ui/cli init
```

## Usage

### Initialize a Project

```bash
npx @hypoth-ui/cli init
```

Creates a `ds.config.json` with your project settings (framework, package manager, paths).

### Add Components

```bash
npx @hypoth-ui/cli add button dialog
```

Installs the component packages and any required dependencies.

### Copy Component Source

```bash
npx @hypoth-ui/cli add button --copy
```

Copies the component source files into your project instead of installing a package.

### List Available Components

```bash
npx @hypoth-ui/cli list
npx @hypoth-ui/cli list --installed
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
