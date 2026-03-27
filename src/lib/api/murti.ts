import type { DeityInfo, MurtiImage, Style } from "./types";

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
      `Murti API error (${response.status}): ${message || response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

/**
 * Generates a murti image using deity and contextual cues.
 */
export async function generateMurti(
  deity: string,
  context: string,
): Promise<MurtiImage> {
  return requestJson<MurtiImage>("/murti/generate", {
    method: "POST",
    body: JSON.stringify({ deity, context }),
  });
}

/**
 * Lists available artistic styles for murti generation.
 */
export async function getMurtiStyles(): Promise<Style[]> {
  return requestJson<Style[]>("/murti/styles");
}

/**
 * Fetches deity profile information used by the image flow.
 */
export async function getDeityInfo(deity: string): Promise<DeityInfo> {
  return requestJson<DeityInfo>(`/murti/deities/${encodeURIComponent(deity)}`);
}
