# @hypoth-ui/cli

## 1.0.0

### Patch Changes

- [#31](https://github.com/hypoth-org/hypoth-ui/pull/31) [`3e5d40a`](https://github.com/hypoth-org/hypoth-ui/commit/3e5d40a8ba5711206d5c3b1bf506f5dd96c76194) Thanks [@JasonGrant](https://github.com/JasonGrant)! - Fix DX deficiencies for adoption readiness

  **Breaking Changes (alpha):**

  - `Button` from `@hypoth-ui/react/client` has been renamed to `DsButton`
  - `LegacyButton` alias removed from `@hypoth-ui/react`

  **Migration:**

  | Before                                             | After                                                |
  | -------------------------------------------------- | ---------------------------------------------------- |
  | `import { Button } from "@hypoth-ui/react/client"` | `import { DsButton } from "@hypoth-ui/react/client"` |
  | `import { LegacyButton } from "@hypoth-ui/react"`  | `import { DsButton } from "@hypoth-ui/react/client"` |

  The headless `Button` from `@hypoth-ui/react` is unchanged.

  **Fixes:**

  - Fix `workspace:*` in peerDependencies (publish blocker)
  - Add `"use client"` directive to main React entry (Server Component fix)
  - Widen React peer deps to `^18.0.0 || ^19.0.0`
  - Move `@hypoth-ui/wc` from CSS dependencies to devDependencies (circular dep fix)

  **New:**

  - `EmptyState` compound component (WC, React, CSS, CLI template)
  - Event naming convention documented in CONTRIBUTING.md
  - `DsLoader` selective loading (`include`/`exclude`) documented in READMEs

## 0.1.2

### Patch Changes

- [`6175dd9`](https://github.com/hypoth-org/hypoth-ui/commit/6175dd9d937aba5f5128ba65db002f3feab8a5b6) Thanks [@JasonGrant](https://github.com/JasonGrant)! - Fix DX issues found during real-world testing:

  - Widen React peer dependency to `^18.0.0 || ^19.0.0` (react, next packages)
  - Widen Next.js peer dependency to `^14.0.0 || ^15.0.0`
  - Fix CLI copy-mode templates with broken relative imports by bundling shared utilities in `_shared/` directory
  - Auto-copy shared utilities when installing components in copy mode

## 0.1.1

## 0.1.0

### Minor Changes

- [#27](https://github.com/hypoth-org/hypoth-ui/pull/27) [`a1ea90c`](https://github.com/hypoth-org/hypoth-ui/commit/a1ea90c544a626e79db4556c3e3f55b8366b623a) Thanks [@JasonGrant](https://github.com/JasonGrant)! - Initial alpha release (0.1.0)
