import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false, // CLI tool doesn't need type declarations
  clean: true,
  target: "node18",
  shims: true,
  // Note: shebang comes from src/index.ts, no need for banner
});
