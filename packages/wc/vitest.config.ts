import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["tests/**/*.test.ts", "src/components/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    deps: {
      inline: [/lit/],
    },
  },
});
