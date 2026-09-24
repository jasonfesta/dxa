import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const guideMarkdownPath = resolve(__dirname, "../README.md");
const guideMarkdownFileName = "design-xagents.md";

export default defineConfig({
  plugins: [
    glsl(),
    {
      name: "dxa-guide-markdown",
      configureServer(server) {
        server.middlewares.use(`/${guideMarkdownFileName}`, (_request, response) => {
          response.setHeader("Content-Type", "text/markdown; charset=utf-8");
          response.end(readFileSync(guideMarkdownPath, "utf8"));
        });
      },
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: guideMarkdownFileName,
          source: readFileSync(guideMarkdownPath, "utf8"),
        });
      },
    },
  ],
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
        readme: resolve(__dirname, "readme.html"),
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
