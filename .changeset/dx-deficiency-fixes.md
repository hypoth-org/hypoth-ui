---
"@hypoth-ui/react": minor
"@hypoth-ui/css": patch
"@hypoth-ui/wc": patch
"@hypoth-ui/next": patch
"@hypoth-ui/cli": patch
---

Fix DX deficiencies for adoption readiness

**Breaking Changes (alpha):**

- `Button` from `@hypoth-ui/react/client` has been renamed to `DsButton`
- `LegacyButton` alias removed from `@hypoth-ui/react`

**Migration:**

| Before | After |
|--------|-------|
| `import { Button } from "@hypoth-ui/react/client"` | `import { DsButton } from "@hypoth-ui/react/client"` |
| `import { LegacyButton } from "@hypoth-ui/react"` | `import { DsButton } from "@hypoth-ui/react/client"` |

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
