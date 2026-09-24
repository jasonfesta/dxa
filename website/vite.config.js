import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [glsl()],
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        indexB: resolve(__dirname, "index-b.html"),
        indexC: resolve(__dirname, "index-c.html"),
        dxa: resolve(__dirname, "dxa.html"),
      },
      output: {
        manualChunks: {
          three: ["three"],
          text: ["three-text", "three-msdf-text-utils"],
        },
      },
    },
  },
});
