import type { Recording, StreamInfo } from "./types";
import { apiContracts } from "./contracts";
import { API_BASE_URL, requestContractJson } from "./http";

const MOCK_STREAMS: Record<string, StreamInfo> = {
  "gayatri-mantra": {
    hymnId: "gayatri-mantra",
    streamUrl: "https://youtube.com/watch?v=gayatri-demo",
    platform: "YouTube",
    isLive: false,
    startedAt: "2026-03-27T06:00:00.000Z",
  },
  mahamrityunjaya: {
    hymnId: "mahamrityunjaya",
    streamUrl: "https://youtube.com/watch?v=mahamrityunjaya-demo",
    platform: "YouTube",
    isLive: true,
    startedAt: "2026-03-27T06:15:00.000Z",
  },
};

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
    return (
      MOCK_STREAMS[request.hymnId] ?? {
        hymnId: request.hymnId,
        streamUrl: `https://youtube.com/watch?v=${encodeURIComponent(request.hymnId)}-demo`,
        platform: "YouTube",
        isLive: false,
      }
    );
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
