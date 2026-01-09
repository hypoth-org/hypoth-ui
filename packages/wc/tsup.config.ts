import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/core.ts",
    "src/primitives.ts",
    "src/form-controls.ts",
    "src/overlays.ts",
    "src/navigation.ts",
    "src/data-display.ts",
    "src/feedback.ts",
    "src/layout.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["lit"],
  sourcemap: true,
});
