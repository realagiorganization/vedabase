import type { Hymn, Metadata } from "./types";

const API_BASE_URL = (
  import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  }
).env?.VITE_API_BASE_URL;

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not configured");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(
      `Vedabase API error (${response.status}): ${message || response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

/**
 * Searches Vedabase hymns matching the user query.
 */
export async function searchHymns(query: string): Promise<Hymn[]> {
  const params = new URLSearchParams({ query });
  return requestJson<Hymn[]>(`/vedabase/hymns/search?${params.toString()}`);
}

/**
 * Fetches a single hymn by its identifier.
 */
export async function getHymnById(id: string): Promise<Hymn> {
  return requestJson<Hymn>(`/vedabase/hymns/${encodeURIComponent(id)}`);
}

/**
 * Lists all hymns inside a chapter.
 */
export async function getHymnsByChapter(chapterId: string): Promise<Hymn[]> {
  return requestJson<Hymn[]>(
    `/vedabase/chapters/${encodeURIComponent(chapterId)}/hymns`,
  );
}

/**
 * Retrieves metadata for a hymn.
 */
export async function getHymnMetadata(id: string): Promise<Metadata> {
  return requestJson<Metadata>(
    `/vedabase/hymns/${encodeURIComponent(id)}/metadata`,
  );
}
