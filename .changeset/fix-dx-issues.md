---
"@hypoth-ui/react": patch
"@hypoth-ui/next": patch
"@hypoth-ui/cli": patch
---

Fix DX issues found during real-world testing:

- Widen React peer dependency to `^18.0.0 || ^19.0.0` (react, next packages)
- Widen Next.js peer dependency to `^14.0.0 || ^15.0.0`
- Fix CLI copy-mode templates with broken relative imports by bundling shared utilities in `_shared/` directory
- Auto-copy shared utilities when installing components in copy mode
