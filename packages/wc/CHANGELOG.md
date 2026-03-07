# @hypoth-ui/wc

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

- Updated dependencies [[`3e5d40a`](https://github.com/hypoth-org/hypoth-ui/commit/3e5d40a8ba5711206d5c3b1bf506f5dd96c76194)]:
  - @hypoth-ui/css@1.0.0
  - @hypoth-ui/primitives-dom@1.0.0
  - @hypoth-ui/tokens@1.0.0

## 0.1.2

### Patch Changes

- Updated dependencies []:
  - @hypoth-ui/css@0.1.2
  - @hypoth-ui/primitives-dom@0.1.2
  - @hypoth-ui/tokens@0.1.2

## 0.1.1

### Patch Changes

- [`cf1a37b`](https://github.com/hypoth-org/hypoth-ui/commit/cf1a37bb76ab4e3df3ebdc2a27190e5ccf77eb61) Thanks [@JasonGrant](https://github.com/JasonGrant)! - Fix workspace protocol in peerDependencies preventing npm publish

- Updated dependencies []:
  - @hypoth-ui/css@0.1.1
  - @hypoth-ui/primitives-dom@0.1.1
  - @hypoth-ui/tokens@0.1.1

## 0.1.0

### Minor Changes

- [#27](https://github.com/hypoth-org/hypoth-ui/pull/27) [`a1ea90c`](https://github.com/hypoth-org/hypoth-ui/commit/a1ea90c544a626e79db4556c3e3f55b8366b623a) Thanks [@JasonGrant](https://github.com/JasonGrant)! - Initial alpha release (0.1.0)

### Patch Changes

- Updated dependencies [[`a1ea90c`](https://github.com/hypoth-org/hypoth-ui/commit/a1ea90c544a626e79db4556c3e3f55b8366b623a)]:
  - @hypoth-ui/tokens@0.1.0
  - @hypoth-ui/css@0.1.0
  - @hypoth-ui/primitives-dom@0.1.0
