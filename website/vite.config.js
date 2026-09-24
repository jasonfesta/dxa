import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { readFileSync } from "fs";
import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const markdownFiles = [
  { fileName: "design-xagents.md", path: resolve(__dirname, "../README.md") },
  { fileName: "agent.md", path: resolve(__dirname, "../agent.md") },
];

export default defineConfig({
  plugins: [
    glsl(),
    {
      name: "dxa-guide-markdown",
      configureServer(server) {
        for (const file of markdownFiles) {
          server.middlewares.use(`/${file.fileName}`, (_request, response) => {
            response.setHeader("Content-Type", "text/markdown; charset=utf-8");
            response.end(readFileSync(file.path, "utf8"));
          });
        }
      },
      generateBundle() {
        for (const file of markdownFiles) {
          this.emitFile({
            type: "asset",
            fileName: file.fileName,
            source: readFileSync(file.path, "utf8"),
          });
        }
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
