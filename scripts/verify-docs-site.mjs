import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const requiredFiles = [
  "dist/index.html",
  "dist/404.html",
  "src/generated/docs-content.ts",
  "public/generated/functionality-bdd.md",
];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Required docs artifact is missing: ${relativePath}`);
  }
}

const generatedModule = fs.readFileSync(
  path.join(repoRoot, "src/generated/docs-content.ts"),
  "utf8",
);
const generatedMarkdown = fs.readFileSync(
  path.join(repoRoot, "public/generated/functionality-bdd.md"),
  "utf8",
);

const requiredSnippets = [
  "Vedabase",
  "BDD",
  "flowchart TD",
  "YouTube Reciter",
  "Karaoke Hymn Viewer",
  "Underword Translator",
  "Generative Murti Viewer",
  "Nintendo DS",
  "Pseudographic Screenshots",
  "Datasource Status",
  "Vedabase dump",
];

for (const snippet of requiredSnippets) {
  if (!generatedModule.includes(snippet) && !generatedMarkdown.includes(snippet)) {
    throw new Error(`Required docs content is missing: ${snippet}`);
  }
}

console.log("Docs site verification passed.");
