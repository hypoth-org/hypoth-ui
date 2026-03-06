# CLI `add` Command Contract

## Current Options

```
hypoth-ui add [components...] [options]

Options:
  -o, --overwrite    Overwrite existing components
  -a, --all          Add all available components
```

## Updated Options (post-implementation)

```
hypoth-ui add [components...] [options]

Options:
  -c, --copy         Copy component source files instead of installing package
  -o, --overwrite    Overwrite existing components
  -a, --all          Add all available components
```

## Behavior Matrix

| config.style | --copy flag | Result |
|-------------|-------------|--------|
| package | absent | Install as npm dependency (track in config) |
| package | present | Copy source files to project (override for this invocation) |
| copy | absent | Copy source files to project |
| copy | present | Copy source files to project (no change) |

## Error Cases

| Condition | Behavior |
|-----------|----------|
| Component not in registry | Error: "Component '{name}' not found in registry" |
| --copy used but no template files | Error: "No template files available for '{name}'. Copy mode supports: {list}" |
| File exists without --overwrite | Skip with warning: "Skipping {file} (already exists). Use --overwrite to replace." |
