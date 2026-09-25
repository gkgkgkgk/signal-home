import { defineConfig } from "vite";
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "signal-home.js",
    },
    target: "es2022",
    sourcemap: false,
  },
});
