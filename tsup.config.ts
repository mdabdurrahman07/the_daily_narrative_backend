import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts", "api/index.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node18",
  platform: "node",
  clean: true,
  shims: true,
  sourcemap: true,
});
