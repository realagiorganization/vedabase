import {
  buildMetadata,
  ensureDataDirectories,
  normalizeVedabaseDump,
  readSourceTextResumable,
  resolveSourceUrl,
  writeJson,
  writeSyncReport,
} from "./lib/remote-datasource.mjs";

const sourceUrl = resolveSourceUrl(process.argv[2] ?? process.env.VEDABASE_DUMP_URL);
const paths = ensureDataDirectories();
const { text, resumed } = await readSourceTextResumable(sourceUrl, paths.vedabaseRawPath);
const json = JSON.parse(text);
const hymns = normalizeVedabaseDump(json);

writeJson(paths.vedabaseCachePath, {
  generatedAt: new Date().toISOString(),
  dataset: "vedabase-dump",
  hymns,
});

const metadata = buildMetadata({
  dataset: "vedabase-dump",
  sourceUrl,
  text,
  itemCount: hymns.length,
  complete: hymns.length > 0,
  status: hymns.length > 0 ? "fresh" : "incomplete",
  notes: [resumed ? "Immediate fetch resumed from a partial download." : "Immediate fetch completed."],
});

writeJson(paths.vedabaseMetadataPath, metadata);

let youtubeStatus = {
  dataset: "youtube-search",
  status: "stale",
  complete: false,
  itemCount: 0,
};

try {
  const existing = JSON.parse(
    await import("node:fs/promises").then(({ readFile }) =>
      readFile(paths.youtubeMetadataPath, "utf8"),
    ),
  );
  youtubeStatus = {
    dataset: "youtube-search",
    status: existing.status ?? "stale",
    complete: Boolean(existing.complete),
    itemCount: existing.itemCount ?? 0,
  };
} catch {
  // Preserve deterministic report output when only one dataset has been synced.
}

writeSyncReport([
  {
    dataset: "vedabase-dump",
    status: metadata.status,
    complete: metadata.complete,
    itemCount: metadata.itemCount,
  },
  youtubeStatus,
]);

console.log(`Synced Vedabase dump from ${sourceUrl}`);
console.log(resumed ? "Resumed partial Vedabase download" : "Fetched Vedabase dump from byte zero");
console.log(`Validated ${hymns.length} hymns`);
