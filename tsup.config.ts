import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "bin/index.ts"],
  format: ["cjs"], // CommonJS para CLI
  dts: true,
  clean: true,
  minify: false,
  target: "node18",
});
