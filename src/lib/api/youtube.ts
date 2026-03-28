import type { Recording, StreamInfo, YouTubeSearchResult } from "./types";
import { apiContracts } from "./contracts";
import { API_BASE_URL, requestContractJson } from "./http";
import {
  getLocalYouTubeResultForHymn,
  getLocalYouTubeResults,
} from "./localData";

function createMockRecording(
  sessionId: string,
  status: Recording["status"],
): Recording {
  return {
    sessionId,
    status,
    recordingUrl:
      status === "stopped"
        ? `https://example.test/recordings/${encodeURIComponent(sessionId)}.mp3`
        : undefined,
    startedAt: "2026-03-27T06:30:00.000Z",
    stoppedAt: status === "stopped" ? "2026-03-27T06:34:12.000Z" : undefined,
  };
}

/**
 * Returns stream metadata for a hymn on YouTube.
 */
export async function getYouTubeStream(hymnId: string): Promise<StreamInfo> {
  const request = apiContracts.youtube.streamInfo.validateRequest({ hymnId });

  if (!API_BASE_URL) {
    const result = getLocalYouTubeResultForHymn(request.hymnId);

    return {
      hymnId: request.hymnId,
      streamUrl:
        result?.url ??
        `https://youtube.com/watch?v=${encodeURIComponent(request.hymnId)}-demo`,
      platform: "YouTube",
      isLive: false,
      startedAt: result?.publishedAt,
    };
  }

  return requestContractJson(apiContracts.youtube.streamInfo, request, {
    method: apiContracts.youtube.streamInfo.method,
  });
}

/**
 * Starts a recording session for a hymn stream.
 */
export async function startRecording(sessionId: string): Promise<Recording> {
  const request = apiContracts.youtube.startRecording.validateRequest({
    sessionId,
  });

  if (!API_BASE_URL) {
    return createMockRecording(request.sessionId, "recording");
  }

  return requestContractJson(apiContracts.youtube.startRecording, request, {
    method: apiContracts.youtube.startRecording.method,
    body: JSON.stringify(request),
  });
}

/**
 * Stops a recording session and returns the latest state.
 */
export async function stopRecording(sessionId: string): Promise<Recording> {
  const request = apiContracts.youtube.stopRecording.validateRequest({
    sessionId,
  });

  if (!API_BASE_URL) {
    return createMockRecording(request.sessionId, "stopped");
  }

  return requestContractJson(apiContracts.youtube.stopRecording, request, {
    method: apiContracts.youtube.stopRecording.method,
    body: JSON.stringify(request),
  });
}

export async function searchYouTubeVideos(
  query: string,
  hymnId?: string,
): Promise<YouTubeSearchResult[]> {
  const request = apiContracts.youtube.searchVideos.validateRequest({
    query,
    ...(hymnId ? { hymnId } : {}),
  });

  if (!API_BASE_URL) {
    return getLocalYouTubeResults(request.query, request.hymnId);
  }

  return requestContractJson(apiContracts.youtube.searchVideos, request, {
    method: apiContracts.youtube.searchVideos.method,
  });
}
