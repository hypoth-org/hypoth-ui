import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    include: ["tests/a11y/**/*.test.ts"],
    setupFiles: ["tests/a11y/setup.ts"],
    deps: {
      inline: [/lit/],
    },
  },
});
