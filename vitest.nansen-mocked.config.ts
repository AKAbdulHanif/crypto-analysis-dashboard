import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@shared": path.resolve(import.meta.dirname, "shared") },
  },
  test: {
    environment: "node",
    include: ["server/nansen-retirement.mocked.test.ts"],
    exclude: ["**/nansen.validate.test.ts", "**/node_modules/**"],
  },
});
