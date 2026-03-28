import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_DATA_ROOT = path.join(process.cwd(), "data");

function toSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ensureString(value, field, dataset) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${dataset}: ${field} must be a non-empty string`);
  }

  return value.trim();
}

function ensureArray(value, field, dataset) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${dataset}: ${field} must be a non-empty array`);
  }

  return value;
}

export function getDataRoot() {
  return process.env.VEDABASE_DATA_ROOT
    ? path.resolve(process.env.VEDABASE_DATA_ROOT)
    : DEFAULT_DATA_ROOT;
}

export function getDataPaths() {
  const root = getDataRoot();

  return {
    root,
    remoteVedabaseDir: path.join(root, "remote", "vedabase-dump"),
    remoteYoutubeDir: path.join(root, "remote", "youtube-search"),
    cacheDir: path.join(root, "cache"),
    vedabaseMetadataPath: path.join(root, "remote", "vedabase-dump", "metadata.json"),
    youtubeMetadataPath: path.join(root, "remote", "youtube-search", "metadata.json"),
    vedabaseRawPath: path.join(root, "remote", "vedabase-dump", "latest.json"),
    youtubeRawPath: path.join(root, "remote", "youtube-search", "latest.json"),
    vedabaseCachePath: path.join(root, "cache", "vedabase-index.json"),
    youtubeCachePath: path.join(root, "cache", "youtube-search-index.json"),
    syncReportPath: path.join(root, "cache", "sync-report.json"),
  };
}

export function ensureDataDirectories() {
  const paths = getDataPaths();

  fs.mkdirSync(paths.remoteVedabaseDir, { recursive: true });
  fs.mkdirSync(paths.remoteYoutubeDir, { recursive: true });
  fs.mkdirSync(paths.cacheDir, { recursive: true });

  return paths;
}

export async function readSourceText(sourceUrl) {
  if (sourceUrl.startsWith("file://")) {
    return fs.readFileSync(new URL(sourceUrl), "utf8");
  }

  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Fetch failed for ${sourceUrl}: ${response.status} ${response.statusText}`);
  }

  return await response.text();
}

export async function readSourceTextResumable(sourceUrl, destinationPath) {
  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

  if (sourceUrl.startsWith("file://")) {
    const text = fs.readFileSync(new URL(sourceUrl), "utf8");
    fs.writeFileSync(destinationPath, text);
    return {
      text,
      resumed: false,
      bytesDownloaded: Buffer.byteLength(text, "utf8"),
    };
  }

  const partialPath = `${destinationPath}.part`;
  const existingBytes = fs.existsSync(partialPath) ? fs.statSync(partialPath).size : 0;
  const headers = existingBytes > 0 ? { Range: `bytes=${existingBytes}-` } : {};
  const response = await fetch(sourceUrl, { headers });

  if (existingBytes > 0 && response.status === 206) {
    const body = await response.arrayBuffer();
    fs.appendFileSync(partialPath, Buffer.from(body));
  } else {
    if (!response.ok) {
      throw new Error(`Fetch failed for ${sourceUrl}: ${response.status} ${response.statusText}`);
    }

    const body = await response.arrayBuffer();
    fs.writeFileSync(partialPath, Buffer.from(body));
  }

  const text = fs.readFileSync(partialPath, "utf8");
  fs.renameSync(partialPath, destinationPath);

  return {
    text,
    resumed: existingBytes > 0 && response.status === 206,
    bytesDownloaded: Buffer.byteLength(text, "utf8"),
  };
}

export async function readSourceJson(sourceUrl) {
  const text = await readSourceText(sourceUrl);
  return {
    text,
    json: JSON.parse(text),
  };
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

export function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function normalizeVedabaseDump(payload) {
  const dataset = "vedabase-dump";
  const records = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.hymns)
      ? payload.hymns
      : null;

  const hymns = ensureArray(records, "hymns", dataset).map((item, index) => {
    const title = ensureString(item.title ?? item.name, `hymns[${index}].title`, dataset);
    const id = ensureString(item.id ?? toSlug(title), `hymns[${index}].id`, dataset);
    const chapterId = ensureString(
      item.chapterId ?? item.chapter ?? item.reference ?? `chapter-${index + 1}`,
      `hymns[${index}].chapterId`,
      dataset,
    );
    const sanskrit = ensureString(
      item.sanskrit ?? item.text ?? item.verse ?? title,
      `hymns[${index}].sanskrit`,
      dataset,
    );

    return {
      id,
      chapterId,
      title,
      sanskrit,
      transliteration: typeof item.transliteration === "string" ? item.transliteration.trim() : undefined,
      translation: typeof item.translation === "string" ? item.translation.trim() : undefined,
      deity: typeof item.deity === "string" && item.deity.trim() ? item.deity.trim() : "Unknown",
      verseCount: Number.isFinite(item.verseCount) ? item.verseCount : 1,
      tags: Array.isArray(item.tags) ? item.tags.filter((tag) => typeof tag === "string") : [],
      metadata: {
        id: typeof item.metadata?.id === "string" ? item.metadata.id : `meta-${id}`,
        chapterId,
        title: typeof item.metadata?.title === "string" ? item.metadata.title : title,
        source:
          typeof item.metadata?.source === "string"
            ? item.metadata.source
            : "Synchronized Vedabase corpus",
        tags: Array.isArray(item.metadata?.tags)
          ? item.metadata.tags.filter((tag) => typeof tag === "string")
          : Array.isArray(item.tags)
            ? item.tags.filter((tag) => typeof tag === "string")
            : [],
      },
    };
  });

  const duplicateIds = hymns
    .map((hymn) => hymn.id)
    .filter((id, index, items) => items.indexOf(id) !== index);

  if (duplicateIds.length > 0) {
    throw new Error(`${dataset}: duplicate hymn ids detected: ${duplicateIds.join(", ")}`);
  }

  return hymns;
}

export function normalizeYouTubeSearchResponse(payload, query, hymnId) {
  const dataset = "youtube-search";
  const records = Array.isArray(payload?.items)
    ? payload.items
    : Array.isArray(payload?.results)
      ? payload.results
      : Array.isArray(payload)
        ? payload
        : null;

  const items = ensureArray(records, "results", dataset)
    .map((item, index) => {
      const videoId = ensureString(
        item.videoId ?? item.id?.videoId ?? item.id,
        `results[${index}].videoId`,
        dataset,
      );
      const title = ensureString(
        item.title ?? item.snippet?.title,
        `results[${index}].title`,
        dataset,
      );
      const channelTitle = ensureString(
        item.channelTitle ?? item.snippet?.channelTitle ?? "Unknown channel",
        `results[${index}].channelTitle`,
        dataset,
      );

      return {
        query,
        hymnId,
        videoId,
        title,
        channelTitle,
        description:
          typeof item.description === "string"
            ? item.description
            : typeof item.snippet?.description === "string"
              ? item.snippet.description
              : "",
        publishedAt:
          typeof item.publishedAt === "string"
            ? item.publishedAt
            : typeof item.snippet?.publishedAt === "string"
              ? item.snippet.publishedAt
              : undefined,
        thumbnailUrl:
          typeof item.thumbnailUrl === "string"
            ? item.thumbnailUrl
            : item.snippet?.thumbnails?.default?.url,
        url:
          typeof item.url === "string"
            ? item.url
            : `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
      };
    })
    .filter((item, index, items) => items.findIndex((entry) => entry.videoId === item.videoId) === index);

  if (items.length === 0) {
    throw new Error(`${dataset}: query "${query}" returned no usable results`);
  }

  return items;
}

export function buildMetadata({
  dataset,
  sourceUrl,
  text,
  itemCount,
  complete,
  status,
  notes = [],
}) {
  return {
    dataset,
    sourceUrl,
    fetchedAt: new Date().toISOString(),
    checksumSha256: sha256(text),
    bytes: Buffer.byteLength(text, "utf8"),
    itemCount,
    complete,
    status,
    notes,
  };
}

export function writeSyncReport(entries) {
  const paths = ensureDataDirectories();
  writeJson(paths.syncReportPath, {
    generatedAt: new Date().toISOString(),
    datasets: entries,
  });
}

export function resolveSourceUrl(rawValue) {
  if (!rawValue) {
    throw new Error("A remote source URL is required");
  }

  if (
    rawValue.startsWith("http://") ||
    rawValue.startsWith("https://") ||
    rawValue.startsWith("file://")
  ) {
    return rawValue;
  }

  return pathToFileURL(path.resolve(rawValue)).href;
}
