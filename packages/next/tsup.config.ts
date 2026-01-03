import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/loader/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "next", "@ds/wc", "@ds/react"],
  sourcemap: true,
  banner: {
    // Preserve "use client" directive for Next.js App Router
    js: '"use client";',
  },
});
