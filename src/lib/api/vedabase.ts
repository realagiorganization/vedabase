import type {
  Hymn,
  HymnSearchResponse,
  Metadata,
  RemoteCompletenessDiagnostics,
  RemoteDatasetName,
  RemoteFetchResponse,
  RemoteSyncStatus,
} from "./types";
import { apiContracts } from "./contracts";
import { API_BASE_URL, createApiError, requestContractJson } from "./http";
import {
  createLocalHymnSearchResponse,
  createLocalSyncFetchResponse,
  getFeaturedLocalHymns,
  getLocalCompletenessDiagnostics,
  getLocalHymnById,
  getLocalHymnsByChapter,
  getLocalSyncStatus,
} from "./localData";

/**
 * Searches Vedabase hymns matching the user query.
 */
export async function searchHymns(query: string): Promise<Hymn[]> {
  const response = await searchHymnCorpus(query);

  return response.items;
}

export async function searchHymnCorpus(query: string): Promise<HymnSearchResponse> {
  const request = apiContracts.vedabase.searchHymns.validateRequest({ query });

  if (!API_BASE_URL) {
    return createLocalHymnSearchResponse(request.query);
  }

  return requestContractJson(apiContracts.vedabase.searchHymns, request, {
    method: apiContracts.vedabase.searchHymns.method,
  });
}

/**
 * Fetches a single hymn by its identifier.
 */
export async function getHymnById(id: string): Promise<Hymn> {
  const request = apiContracts.vedabase.hymnById.validateRequest({ id });

  if (!API_BASE_URL) {
    const hymn = getLocalHymnById(request.id);

    if (!hymn) {
      throw createApiError({
        status: 404,
        code: "vedabase.hymnById.not_found",
        message: `Synchronized Vedabase hymn not found: ${request.id}`,
        details: { id: request.id },
      });
    }

    return hymn;
  }

  return requestContractJson(apiContracts.vedabase.hymnById, request, {
    method: apiContracts.vedabase.hymnById.method,
  });
}

/**
 * Lists all hymns inside a chapter.
 */
export async function getHymnsByChapter(chapterId: string): Promise<Hymn[]> {
  const request = apiContracts.vedabase.hymnsByChapter.validateRequest({
    chapterId,
  });

  if (!API_BASE_URL) {
    return getLocalHymnsByChapter(request.chapterId);
  }

  return requestContractJson(apiContracts.vedabase.hymnsByChapter, request, {
    method: apiContracts.vedabase.hymnsByChapter.method,
  });
}

/**
 * Retrieves metadata for a hymn.
 */
export async function getHymnMetadata(id: string): Promise<Metadata> {
  const request = apiContracts.vedabase.hymnMetadata.validateRequest({ id });

  if (!API_BASE_URL) {
    const hymn = await getHymnById(request.id);

    return hymn.metadata ?? {
      id: `meta-${hymn.id}`,
      chapterId: hymn.chapterId,
      title: hymn.title,
      source: "Synchronized Vedabase corpus",
    };
  }

  return requestContractJson(apiContracts.vedabase.hymnMetadata, request, {
    method: apiContracts.vedabase.hymnMetadata.method,
  });
}

export async function getVedabaseSyncStatus(): Promise<RemoteSyncStatus> {
  if (!API_BASE_URL) {
    return getLocalSyncStatus();
  }

  return requestContractJson(apiContracts.vedabase.syncStatus, {}, {
    method: apiContracts.vedabase.syncStatus.method,
  });
}

export async function fetchVedabaseRemoteDataset(
  dataset: RemoteDatasetName = "vedabase-dump",
): Promise<RemoteFetchResponse> {
  const request = apiContracts.vedabase.fetchRemoteDump.validateRequest({
    dataset,
  });

  if (!API_BASE_URL) {
    return createLocalSyncFetchResponse(request);
  }

  return requestContractJson(apiContracts.vedabase.fetchRemoteDump, request, {
    method: apiContracts.vedabase.fetchRemoteDump.method,
    body: JSON.stringify(request),
  });
}

export async function getVedabaseCompletenessDiagnostics(
  dataset: RemoteDatasetName = "vedabase-dump",
): Promise<RemoteCompletenessDiagnostics> {
  const request = apiContracts.vedabase.completenessDiagnostics.validateRequest({
    dataset,
  });

  if (!API_BASE_URL) {
    return getLocalCompletenessDiagnostics(request.dataset);
  }

  return requestContractJson(apiContracts.vedabase.completenessDiagnostics, request, {
    method: apiContracts.vedabase.completenessDiagnostics.method,
  });
}

export function getFeaturedHymns(limit = 3): Hymn[] {
  return getFeaturedLocalHymns(limit);
}
