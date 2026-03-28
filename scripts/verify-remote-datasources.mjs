import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const requiredFiles = [
  "data/remote/vedabase-dump/metadata.json",
  "data/remote/youtube-search/metadata.json",
  "data/cache/vedabase-index.json",
  "data/cache/youtube-search-index.json",
  "data/cache/sync-report.json",
  "src/generated/remote-data.ts",
];

for (const relativePath of requiredFiles) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing remote datasource artifact: ${relativePath}`);
  }
}

const vedabaseMetadata = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "data/remote/vedabase-dump/metadata.json"), "utf8"),
);
const youtubeMetadata = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "data/remote/youtube-search/metadata.json"), "utf8"),
);
const vedabaseIndex = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "data/cache/vedabase-index.json"), "utf8"),
);
const youtubeIndex = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "data/cache/youtube-search-index.json"), "utf8"),
);

if (!vedabaseMetadata.complete || vedabaseMetadata.itemCount < 1) {
  throw new Error("Vedabase dump metadata is incomplete");
}

if (!youtubeMetadata.complete || youtubeMetadata.itemCount < 1) {
  throw new Error("YouTube search metadata is incomplete");
}

if (!Array.isArray(vedabaseIndex.hymns) || vedabaseIndex.hymns.length < 1) {
  throw new Error("Vedabase index contains no hymns");
}

if (!Array.isArray(youtubeIndex.queries) || youtubeIndex.queries.length < 1) {
  throw new Error("YouTube search index contains no query groups");
}

console.log("Remote datasource verification passed.");
