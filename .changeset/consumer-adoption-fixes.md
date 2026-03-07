---
"@hypoth-ui/react": patch
"@hypoth-ui/next": patch
"@hypoth-ui/wc": patch
"@hypoth-ui/css": patch
"@hypoth-ui/tokens": patch
"@hypoth-ui/cli": patch
"@hypoth-ui/primitives-dom": patch
"@hypoth-ui/docs-core": patch
"@hypoth-ui/docs-content": patch
"@hypoth-ui/docs-renderer-next": patch
"@hypoth-ui/test-utils": patch
"@hypoth-ui/a11y-audit": patch
---

Fix 20 consumer adoption issues: add Next.js 16 peer dep, remove "use client" from main entry (types-only), move all runtime components to /client entry, remove @deprecated from DsButton, remove Alpha badges and language, migrate OPEN/CLOSE to OPEN_CHANGE events, remove LightElement alias, make date-fns/lucide optional peer deps, fix all README examples.
