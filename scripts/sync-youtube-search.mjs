import fs from "node:fs";
import { URL } from "node:url";

import {
  buildMetadata,
  ensureDataDirectories,
  normalizeYouTubeSearchResponse,
  readSourceJson,
  resolveSourceUrl,
  writeJson,
  writeSyncReport,
} from "./lib/remote-datasource.mjs";

function parseQueries(argv) {
  const raw = argv.filter(Boolean);
  const queries = [];

  for (const value of raw) {
    if (value.startsWith("--query=")) {
      queries.push(value.slice("--query=".length));
    } else if (!value.startsWith("--")) {
      queries.push(value);
    }
  }

  return queries;
}

function inferHymnId(query) {
  return query.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function fetchQueryResult(query, hymnId) {
  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  const endpointTemplate = process.env.YOUTUBE_SEARCH_SOURCE_TEMPLATE;

  if (apiKey) {
    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "10");
    url.searchParams.set("q", query);
    url.searchParams.set("key", apiKey);

    const { text, json } = await readSourceJson(url.toString());
    return {
      sourceUrl: url.toString(),
      text,
      results: normalizeYouTubeSearchResponse(json, query, hymnId),
      raw: json,
    };
  }

  if (endpointTemplate) {
    const sourceUrl = resolveSourceUrl(
      endpointTemplate.replace("{query}", encodeURIComponent(query)),
    );
    const { text, json } = await readSourceJson(sourceUrl);

    return {
      sourceUrl,
      text,
      results: normalizeYouTubeSearchResponse(json, query, hymnId),
      raw: json,
    };
  }

  throw new Error(
    "YouTube search sync requires YOUTUBE_DATA_API_KEY or YOUTUBE_SEARCH_SOURCE_TEMPLATE",
  );
}

const queries = parseQueries(process.argv.slice(2));
if (queries.length === 0) {
  throw new Error("Provide one or more queries via positional args or --query=...");
}

const paths = ensureDataDirectories();
const normalizedQueries = [];
const rawQueries = [];
let rawTextForChecksum = "";

for (const query of queries) {
  const hymnId = inferHymnId(query);
  const payload = await fetchQueryResult(query, hymnId);

  normalizedQueries.push({
    query,
    hymnId,
    results: payload.results,
  });
  rawQueries.push({
    query,
    hymnId,
    sourceUrl: payload.sourceUrl,
    payload: payload.raw,
  });
  rawTextForChecksum += payload.text;
}

writeJson(paths.youtubeRawPath, {
  generatedAt: new Date().toISOString(),
  queries: rawQueries,
});

writeJson(paths.youtubeCachePath, {
  generatedAt: new Date().toISOString(),
  dataset: "youtube-search",
  queries: normalizedQueries,
});

const metadata = buildMetadata({
  dataset: "youtube-search",
  sourceUrl: rawQueries.map((entry) => entry.sourceUrl).join(", "),
  text: rawTextForChecksum,
  itemCount: normalizedQueries.reduce((count, item) => count + item.results.length, 0),
  complete: normalizedQueries.every((item) => item.results.length > 0),
  status: "fresh",
  notes: ["Immediate fetch completed."],
});

writeJson(paths.youtubeMetadataPath, metadata);

let vedabaseStatus = {
  dataset: "vedabase-dump",
  status: "stale",
  complete: false,
  itemCount: 0,
};

try {
  const existing = JSON.parse(fs.readFileSync(paths.vedabaseMetadataPath, "utf8"));
  vedabaseStatus = {
    dataset: "vedabase-dump",
    status: existing.status ?? "stale",
    complete: Boolean(existing.complete),
    itemCount: existing.itemCount ?? 0,
  };
} catch {
  // Preserve deterministic report output when only one dataset has been synced.
}

writeSyncReport([
  vedabaseStatus,
  {
    dataset: "youtube-search",
    status: metadata.status,
    complete: metadata.complete,
    itemCount: metadata.itemCount,
  },
]);

console.log(`Synced YouTube search queries: ${queries.join(", ")}`);
console.log(`Validated ${metadata.itemCount} normalized results`);
