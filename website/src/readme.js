import { marked } from "marked";
import readme from "../../README.md?raw";
import contributing from "../../CONTRIBUTING.md?raw";
import license from "../../LICENSE?raw";
import poster from "../../assets/design-xagents-sf-2026-09-29.png";

const documents = { "README.md": readme, "CONTRIBUTING.md": contributing };
const sources = import.meta.glob([
  "../../resources/*.md",
  "../../events/*.md",
  "../../workflows/*.md",
  "../../skills/**/*.md",
  "../../agents/README.md",
  "../../assets/README.md",
], { query: "?raw", import: "default", eager: true });

for (const [path, source] of Object.entries(sources)) {
  documents[path.replace("../../", "")] = source;
}

const requested = new URLSearchParams(location.search).get("doc") || "README.md";
const content = document.querySelector("#content");
const base = new URL(requested, "https://dxa.local/");

if (requested === "LICENSE") {
  const heading = document.createElement("h1");
  heading.textContent = "License";
  const text = document.createElement("pre");
  text.textContent = license;
  content.append(heading, text);
} else if (Object.hasOwn(documents, requested)) {
  // Only authored repository documents enter this renderer; URL input selects a key.
  const source = documents[requested].replace(/^---\n[\s\S]*?\n---\n/, "");
  content.innerHTML = marked.parse(source);
} else {
  const heading = document.createElement("h1");
  heading.textContent = "Page not found";
  const link = document.createElement("a");
  link.href = "./readme.html";
  link.textContent = "Return to Design xAgents";
  content.append(heading, link);
}

const headings = new Map();
for (const heading of content.querySelectorAll("h1, h2, h3, h4")) {
  const slug = heading.textContent.toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");
  const count = headings.get(slug) || 0;
  headings.set(slug, count + 1);
  heading.id = count ? `${slug}-${count}` : slug;
}

for (const link of content.querySelectorAll("a[href]")) {
  const raw = link.getAttribute("href");
  if (/^(?:https?:|mailto:|#)/i.test(raw)) continue;
  const target = new URL(raw, base);
  const path = decodeURIComponent(target.pathname.slice(1));
  if (Object.hasOwn(documents, path) || path === "LICENSE") {
    link.href = `./readme.html?doc=${encodeURIComponent(path)}${target.hash}`;
  } else {
    link.href = `https://github.com/jasonfesta/dxa/blob/main/${path}${target.hash}`;
  }
}

for (const image of content.querySelectorAll("img")) {
  const path = new URL(image.getAttribute("src"), base).pathname;
  if (path === "/assets/design-xagents-sf-2026-09-29.png") {
    image.src = poster;
    image.width = 3860;
    image.height = 2838;
  }
}

document.title = `${content.querySelector("h1")?.textContent || "Guide"} | DxA`;
if (location.hash) {
  requestAnimationFrame(() => {
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  });
}
