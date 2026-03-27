import type { Pronunciation, Translation, Underword } from "./types";

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
      `Translator API error (${response.status}): ${message || response.statusText}`,
    );
  }

  return (await response.json()) as T;
}

/**
 * Translates a Sanskrit verse into a target language.
 */
export async function translateVerse(
  sanskrit: string,
  targetLang: string,
): Promise<Translation> {
  return requestJson<Translation>("/translator/verse", {
    method: "POST",
    body: JSON.stringify({ sanskrit, targetLang }),
  });
}

/**
 * Returns segmented underword analysis for Sanskrit input.
 */
export async function getUnderword(sanskrit: string): Promise<Underword[]> {
  return requestJson<Underword[]>("/translator/underword", {
    method: "POST",
    body: JSON.stringify({ sanskrit }),
  });
}

/**
 * Gets pronunciation guidance for Sanskrit text.
 */
export async function getPronunciation(
  sanskrit: string,
): Promise<Pronunciation> {
  return requestJson<Pronunciation>("/translator/pronunciation", {
    method: "POST",
    body: JSON.stringify({ sanskrit }),
  });
}
