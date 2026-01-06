# Data Model: CLI Tool for Component Installation

**Feature**: 015-cli-tool | **Date**: 2026-01-06

## Entities

### 1. Configuration (ds.config.json)

User's local configuration file, created during `init` and updated during `add` operations.

```typescript
interface DSConfig {
  /** Schema version for future migrations */
  $schema: string;

  /** Installation mode: copy sources or install packages */
  style: "copy" | "package";

  /** Detected or configured framework */
  framework: "react" | "next" | "wc" | "vanilla";

  /** Whether project uses TypeScript */
  typescript: boolean;

  /** Detected package manager */
  packageManager: "npm" | "pnpm" | "yarn" | "bun";

  /** Path configuration */
  paths: {
    /** Where to copy components (copy mode only) */
    components: string;
    /** Where to place utility files */
    utils: string;
  };

  /** Import alias configuration (for path mapping) */
  aliases: {
    /** Maps @/components to actual path */
    components: string;
    /** Maps @/lib to actual path */
    lib: string;
  };

  /** Installed components registry */
  components: InstalledComponent[];
}

interface InstalledComponent {
  /** Component identifier (e.g., "button") */
  name: string;
  /** Version installed */
  version: string;
  /** When installed */
  installedAt: string; // ISO date
  /** Installation mode used */
  mode: "copy" | "package";
}
```

**Example**:
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
  "components": [
    {
      "name": "button",
      "version": "1.0.0",
      "installedAt": "2026-01-06T10:00:00Z",
      "mode": "package"
    }
  ]
}
```

---

### 2. Component Registry (components.json)

Remote/bundled registry defining all available components.

```typescript
interface ComponentRegistry {
  /** Registry format version */
  version: string;

  /** Last updated timestamp */
  updatedAt: string;

  /** Available components */
  components: ComponentDefinition[];
}

interface ComponentDefinition {
  /** Unique identifier (kebab-case) */
  name: string;

  /** Display name */
  displayName: string;

  /** Short description */
  description: string;

  /** Semantic version */
  version: string;

  /** Component maturity */
  status: "alpha" | "beta" | "stable";

  /** Supported frameworks */
  frameworks: ("react" | "wc")[];

  /** npm package dependencies (always installed) */
  dependencies: string[];

  /** Other components this depends on */
  registryDependencies: string[];

  /** Files to copy (copy mode) */
  files: ComponentFile[];

  /** Accessibility metadata */
  a11y: {
    apgPattern: string;
    keyboardSupport: string[];
  };
}

interface ComponentFile {
  /** Relative path in source */
  path: string;
  /** Target filename (may differ per framework) */
  target: string;
  /** File type for syntax highlighting */
  type: "tsx" | "ts" | "css";
  /** Framework-specific (null = shared) */
  framework?: "react" | "wc";
}
```

**Example**:
```json
{
  "version": "1.0.0",
  "updatedAt": "2026-01-06T00:00:00Z",
  "components": [
    {
      "name": "button",
      "displayName": "Button",
      "description": "Accessible button with loading and disabled states",
      "version": "1.0.0",
      "status": "stable",
      "frameworks": ["react", "wc"],
      "dependencies": [
        "@hypoth-ui/tokens",
        "@hypoth-ui/primitives"
      ],
      "registryDependencies": [],
      "files": [
        {
          "path": "components/button/button.tsx",
          "target": "button.tsx",
          "type": "tsx",
          "framework": "react"
        },
        {
          "path": "components/button/ds-button.ts",
          "target": "ds-button.ts",
          "type": "ts",
          "framework": "wc"
        }
      ],
      "a11y": {
        "apgPattern": "button",
        "keyboardSupport": ["Enter", "Space"]
      }
    },
    {
      "name": "dialog",
      "displayName": "Dialog",
      "description": "Modal dialog with focus management",
      "version": "1.0.0",
      "status": "stable",
      "frameworks": ["react", "wc"],
      "dependencies": [
        "@hypoth-ui/tokens",
        "@hypoth-ui/primitives"
      ],
      "registryDependencies": ["button"],
      "files": [
        {
          "path": "components/dialog/",
          "target": "dialog/",
          "type": "tsx",
          "framework": "react"
        }
      ],
      "a11y": {
        "apgPattern": "dialog-modal",
        "keyboardSupport": ["Escape", "Tab"]
      }
    }
  ]
}
```

---

### 3. Detection Result

Internal model for framework/environment detection.

```typescript
interface DetectionResult {
  /** Detected framework */
  framework: "react" | "next" | "wc" | "vanilla" | "unknown";

  /** Detected package manager */
  packageManager: "npm" | "pnpm" | "yarn" | "bun";

  /** TypeScript detected */
  typescript: boolean;

  /** Path to tsconfig if exists */
  tsconfigPath?: string;

  /** Detected source directory */
  srcDir: string;

  /** Detection confidence */
  confidence: "high" | "medium" | "low";

  /** Signals used for detection */
  signals: string[];
}
```

---

## State Transitions

### Configuration Lifecycle

```
┌─────────────┐     init     ┌─────────────┐
│  No Config  │ ───────────► │  Configured │
└─────────────┘              └─────────────┘
                                   │
                                   │ add <component>
                                   ▼
                             ┌─────────────┐
                             │  Has Comps  │ ◄──┐
                             └─────────────┘    │
                                   │            │
                                   │ add more   │
                                   └────────────┘
```

### Component Installation Flow

```
┌──────────┐   resolve deps   ┌───────────┐   check exists   ┌──────────┐
│ Requested │ ───────────────► │ Resolved  │ ───────────────► │ Filtered │
└──────────┘                   └───────────┘                  └──────────┘
                                                                   │
                     ┌─────────────────────────────────────────────┘
                     │
                     ▼
              ┌────────────┐
              │ Copy/Pkg?  │
              └────────────┘
                    │
        ┌──────────┴──────────┐
        ▼                     ▼
  ┌───────────┐         ┌───────────┐
  │ Copy Mode │         │ Pkg Mode  │
  │ (files)   │         │ (npm)     │
  └───────────┘         └───────────┘
        │                     │
        └──────────┬──────────┘
                   ▼
            ┌────────────┐
            │ Update cfg │
            └────────────┘
```

---

## Validation Rules

### ds.config.json

| Field | Rule |
|-------|------|
| style | Must be "copy" or "package" |
| framework | Must be "react", "next", "wc", or "vanilla" |
| paths.components | Must be valid relative path |
| components[].version | Must be valid semver |

### Component Names

- Must be kebab-case
- Must exist in registry
- Case-insensitive matching (normalized to lowercase)

### Overwrite Protection

- Copy mode: Check file exists before writing
- Package mode: Check if already in package.json
- Both: Require `--overwrite` flag to replace
