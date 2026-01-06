# Research: CLI Tool for Component Installation

**Feature**: 015-cli-tool | **Date**: 2026-01-06

## Research Topics

### 1. CLI Framework Selection

**Decision**: Commander.js

**Rationale**:
- 238M weekly downloads, industry standard for Node.js CLIs
- Powers Vue CLI, Create React App - proven at scale
- Lightweight (174 KB) with minimal learning curve
- Git-style subcommand support matches our command pattern (init, add, list, diff)
- Fully supported on Node.js 18+

**Alternatives Considered**:

| Framework | Downloads | Trade-offs |
|-----------|-----------|------------|
| Yargs | 138M | Larger (290 KB), callback-heavy syntax |
| Oclif | ~173K | Plugin architecture overkill for this use case |
| Citty | Emerging | Newer ecosystem, less community support |

---

### 2. Interactive Prompts Library

**Decision**: @clack/prompts

**Rationale**:
- 80% smaller than alternatives (critical for npx install performance)
- UX-first design with intro/outro, isCancel detection, spinners
- Promise-based API matching modern JavaScript patterns
- Supports all needed types: text, select, multiselect, confirm, spinner

**Alternatives Considered**:

| Library | Downloads | Trade-offs |
|---------|-----------|------------|
| Inquirer | 39.4M | Larger bundle, complex for our needs |
| Prompts | 33.9M | Less polished UX |
| Enquirer | 21.7M | Smaller community |

---

### 3. Registry Architecture

**Decision**: Bundled JSON registry with optional remote fetch

**Rationale**:
- Enables offline `list` command (critical for DX)
- Static JSON is simple to maintain and version
- Remote fetch for update checking without blocking basic operations
- Follows shadcn-ui pattern of flat-file registry

**Implementation**:
```json
// components.json structure
{
  "version": "1.0.0",
  "components": [
    {
      "name": "button",
      "description": "Accessible button with loading state",
      "version": "1.0.0",
      "files": ["button.tsx"],
      "dependencies": ["@hypoth-ui/tokens"],
      "registryDependencies": ["primitives"],
      "frameworks": ["react", "wc"]
    }
  ]
}
```

**Alternatives Considered**:
- Remote-only registry: Fails offline, slower DX
- npm package metadata: More complex, less control

---

### 4. Behavior Utilities (primitives-dom) in Copy Mode

**Decision**: Always installed as npm package, never copied

**Rationale**:
- Behavior utilities are foundational abstractions (focus-trap, roving-focus, type-ahead)
- Rarely need customization - designed as stable primitives
- Bug fixes and accessibility improvements should propagate automatically
- Matches token handling (also always package)
- Reduces copy-mode file count significantly

**Pattern**: In copy mode, the dependency graph is:
- Tokens: npm package (@hypoth-ui/tokens)
- Primitives: npm package (@hypoth-ui/primitives)
- Components: copied source files (user ownership)

---

### 5. File Copying Strategy

**Decision**: Native fs.promises.cp() with gray-matter for template metadata

**Rationale**:
- Native to Node.js 16.7+ (our target is 18+)
- Zero extra dependencies for file operations
- Recursive directory support built-in
- gray-matter extracts metadata from template frontmatter

**Implementation Pattern**:
```typescript
import { cp, readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';

// For direct copies (no transformation needed)
await cp(source, destination, { recursive: true });

// For templates requiring transformation
const template = await readFile(templatePath, 'utf-8');
const { data: metadata, content } = matter(template);
const transformed = transformImports(content, userConfig.aliases);
await writeFile(destPath, transformed);
```

**Alternatives Considered**:
- fs-extra: Extra dependency not needed for our Node.js version
- cpy: Adds ~200KB for features we don't need

---

### 6. Package Manager Detection

**Decision**: Lock file detection with fallback to npm

**Rationale**:
- Lock files are reliable indicators of package manager choice
- Respects existing project setup
- Falls back to npm (universal compatibility)

**Detection Priority**:
1. `pnpm-lock.yaml` → pnpm
2. `yarn.lock` → yarn
3. `bun.lockb` → bun
4. `package-lock.json` or default → npm

---

### 7. Framework Detection

**Decision**: package.json dependency analysis + file structure heuristics

**Rationale**:
- Dependencies reveal framework: `next`, `react`, custom elements
- File structure provides additional signals (pages/, app/, etc.)
- Allows override via config for edge cases

**Detection Logic**:
1. Check package.json for `next` → Next.js (implies React)
2. Check for `react` without `next` → React
3. Check for `lit` → Web Components
4. No framework deps → vanilla/Web Components

---

### 8. npx Optimization

**Decision**: Sub-500KB total CLI size, lazy loading commands

**Rationale**:
- npx downloads fresh on first run; small size = fast first experience
- Lazy loading means unused commands don't impact startup
- Bundled registry enables offline operations after first download

**Dependency Budget**:
| Package | Size |
|---------|------|
| commander | ~175 KB |
| @clack/prompts | ~50 KB |
| gray-matter | ~30 KB |
| picocolors | ~5 KB |
| execa | ~100 KB |
| **Total** | **~360 KB** |

---

## Resolved Clarifications

| Question | Resolution |
|----------|------------|
| Tokens in copy mode | Always npm package (never copied) |
| Primitives in copy mode | Always npm package (never copied) |
| Registry hosting | Bundled JSON + optional remote |
| CLI framework | Commander.js |
| Prompts library | @clack/prompts |

## Sources

- [shadcn-ui CLI Documentation](https://ui.shadcn.com/docs/cli)
- [shadcn-ui Architecture - DeepWiki](https://deepwiki.com/shadcn-ui/ui/2-architecture)
- [Commander.js vs Yargs vs Oclif Comparison](https://npm-compare.com/commander,oclif,vorpal,yargs)
- [Node.js CLI Apps Best Practices](https://github.com/lirantal/nodejs-cli-apps-best-practices)
- [@clack/prompts Documentation](https://www.npmjs.com/package/@clack/prompts)
