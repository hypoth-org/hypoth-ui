# Implementation Plan: CLI Tool for Component Installation

**Branch**: `015-cli-tool` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-cli-tool/spec.md`

## Summary

Create a CLI tool (`@hypoth-ui/cli`) for zero-friction component installation, supporting both copy mode (shadcn-ui style source ownership) and package mode (npm dependencies with tree-shaking). The CLI provides `init`, `add`, `list`, and `diff` commands with automatic framework detection (React/Next.js/Web Components) and package manager detection (npm/pnpm/yarn/bun).

## Technical Context

**Language/Version**: TypeScript 5.3+ (strict mode, ES2022 target)
**Primary Dependencies**: Commander.js (CLI framework), prompts (interactive prompts), picocolors (terminal colors), execa (subprocess execution)
**Storage**: File-based (ds.config.json local config, remote JSON registry)
**Testing**: Vitest (unit tests), mock filesystem for integration tests
**Target Platform**: Node.js 18+ (cross-platform: macOS, Linux, Windows)
**Project Type**: Single CLI package (`packages/cli`)
**Performance Goals**: `add` command completes in <30s excluding network; `list` renders in <1s
**Constraints**: Zero runtime dependencies in installed components; CLI itself may have dev dependencies
**Scale/Scope**: ~10-20 components initially; registry <100KB JSON

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with Hypoth UI Design System Constitution:

- [x] **Performance**: N/A for CLI tool (not a runtime component); installed components maintain zero runtime CSS-in-JS
- [x] **Accessibility**: N/A for CLI tool; installed components retain full a11y compliance
- [x] **Customizability**: CLI installs DTCG tokens as package; copy mode enables full customization of component source
- [x] **Zero-dep Core**: CLI ensures @hypoth-ui/tokens, @hypoth-ui/primitives remain as packages (never copied); core packages stay zero-dep
- [x] **Web Components**: CLI supports WC installation via framework detection; Light DOM preserved
- [x] **Dependency Management**: CLI uses pnpm detection; respects user's package manager; versions pinned in registry

## Project Structure

### Documentation (this feature)

```text
specs/015-cli-tool/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (registry schema)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
packages/cli/
├── package.json         # @hypoth-ui/cli package
├── tsconfig.json
├── src/
│   ├── index.ts         # CLI entry point (bin)
│   ├── commands/
│   │   ├── init.ts      # init command
│   │   ├── add.ts       # add command
│   │   ├── list.ts      # list command
│   │   └── diff.ts      # diff command
│   ├── utils/
│   │   ├── detect.ts    # Framework/PM detection
│   │   ├── config.ts    # ds.config.json management
│   │   ├── registry.ts  # Remote registry fetching
│   │   ├── install.ts   # Package installation helpers
│   │   └── copy.ts      # File copying for copy mode
│   └── types/
│       └── index.ts     # Shared types
└── tests/
    ├── unit/
    │   ├── detect.test.ts
    │   ├── config.test.ts
    │   └── registry.test.ts
    └── integration/
        ├── init.test.ts
        └── add.test.ts

# Registry (static JSON, hosted or bundled)
packages/cli/registry/
└── components.json      # Component registry metadata
```

**Structure Decision**: Single CLI package in monorepo (`packages/cli`). The CLI is a standalone tool with no runtime integration into user projects - it only installs files or dependencies. Registry metadata is bundled with CLI for offline `list` support, with optional remote fetch for updates.

## Complexity Tracking

No constitution violations - all gates pass.
