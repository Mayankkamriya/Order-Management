import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    root: path.resolve(import.meta.dirname),
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
});
