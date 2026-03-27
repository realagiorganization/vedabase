import type { Recording, StreamInfo } from "./types";

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
      `YouTube API error (${response.status}): ${message || response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

/**
 * Returns stream metadata for a hymn on YouTube.
 */
export async function getYouTubeStream(hymnId: string): Promise<StreamInfo> {
  return requestJson<StreamInfo>(
    `/youtube/streams/${encodeURIComponent(hymnId)}`,
  );
}

/**
 * Starts a recording session for a hymn stream.
 */
export async function startRecording(sessionId: string): Promise<Recording> {
  return requestJson<Recording>("/youtube/recording/start", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}

/**
 * Stops a recording session and returns the latest state.
 */
export async function stopRecording(sessionId: string): Promise<Recording> {
  return requestJson<Recording>("/youtube/recording/stop", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}
