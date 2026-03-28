import { remoteDataIndex } from '@/generated/remote-data';
import type {
  Hymn,
  HymnSearchResponse,
  RemoteCompletenessDiagnostics,
  RemoteDatasetMeta,
  RemoteDatasetName,
  RemoteFetchRequest,
  RemoteFetchResponse,
  RemoteSyncStatus,
  YouTubeSearchResult,
} from './types';

function normalizeValue(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

function createSearchHaystack(hymn: Hymn): string {
  return [
    hymn.title,
    hymn.sanskrit,
    hymn.transliteration,
    hymn.translation,
    hymn.deity,
    hymn.chapterId,
    ...(hymn.tags ?? []),
    hymn.metadata?.title,
    ...(hymn.metadata?.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function getLocalHymns(): Hymn[] {
  return remoteDataIndex.vedabase.hymns.map((hymn) => ({
    ...hymn,
    tags: hymn.tags ? [...hymn.tags] : undefined,
    metadata: hymn.metadata
      ? {
          ...hymn.metadata,
          tags: hymn.metadata.tags ? [...hymn.metadata.tags] : undefined,
        }
      : undefined,
  }));
}

export function searchLocalHymns(query: string): Hymn[] {
  const normalizedQuery = normalizeValue(query);
  if (!normalizedQuery) {
    return [];
  }

  return getLocalHymns().filter((hymn) =>
    createSearchHaystack(hymn).includes(normalizedQuery),
  );
}

function getLocalDatasetMeta(dataset: RemoteDatasetName): RemoteDatasetMeta {
  return dataset === 'vedabase-dump'
    ? remoteDataIndex.vedabaseMetadata
    : remoteDataIndex.youtubeMetadata;
}

export function createLocalHymnSearchResponse(query: string): HymnSearchResponse {
  const items = searchLocalHymns(query);

  return {
    query: normalizeValue(query),
    total: items.length,
    items,
    source: 'local-cache',
    status: remoteDataIndex.vedabaseMetadata.status,
  };
}

export function getFeaturedLocalHymns(limit = 3): Hymn[] {
  return getLocalHymns()
    .filter((hymn) => hymn.tags?.includes('featured'))
    .slice(0, limit);
}

export function getLocalHymnById(id: string): Hymn | undefined {
  return getLocalHymns().find((hymn) => hymn.id === id);
}

export function getLocalHymnsByChapter(chapterId: string): Hymn[] {
  return getLocalHymns().filter((hymn) => hymn.chapterId === chapterId);
}

export function getLocalYouTubeResults(query: string, hymnId?: string): YouTubeSearchResult[] {
  const normalizedQuery = normalizeValue(query);
  if (!normalizedQuery) {
    return [];
  }

  return remoteDataIndex.youtube.queries
    .filter((entry) => {
      const queryMatches =
        normalizeValue(entry.query).includes(normalizedQuery) ||
        normalizedQuery.includes(normalizeValue(entry.query));
      const hymnMatches = hymnId ? entry.hymnId === hymnId : true;

      return queryMatches && hymnMatches;
    })
    .flatMap((entry) => entry.results.map((result) => ({ ...result })));
}

export function getLocalSyncStatus(): RemoteSyncStatus {
  return {
    vedabase: {
      ...remoteDataIndex.vedabaseMetadata,
      notes: remoteDataIndex.vedabaseMetadata.notes
        ? [...remoteDataIndex.vedabaseMetadata.notes]
        : undefined,
    },
    youtube: {
      ...remoteDataIndex.youtubeMetadata,
      notes: remoteDataIndex.youtubeMetadata.notes
        ? [...remoteDataIndex.youtubeMetadata.notes]
        : undefined,
    },
    report: {
      generatedAt: remoteDataIndex.syncReport.generatedAt,
      datasets: remoteDataIndex.syncReport.datasets.map((dataset) => ({
        ...dataset,
      })),
    },
  };
}

export function createLocalSyncFetchResponse(
  request: RemoteFetchRequest,
): RemoteFetchResponse {
  const metadata = getLocalDatasetMeta(request.dataset);

  return {
    dataset: request.dataset,
    status: metadata.status,
    complete: metadata.complete,
    itemCount: metadata.itemCount,
    fetchedAt: metadata.fetchedAt,
    sourceUrl: request.sourceUrl ?? metadata.sourceUrl,
    notes: [
      ...(metadata.notes ?? []),
      'Local fallback returned synchronized metadata without executing a live fetch.',
    ],
  };
}

export function getLocalCompletenessDiagnostics(
  dataset: RemoteDatasetName,
): RemoteCompletenessDiagnostics {
  const metadata = getLocalDatasetMeta(dataset);

  return {
    dataset,
    status: metadata.status,
    complete: metadata.complete,
    itemCount: metadata.itemCount,
    fetchedAt: metadata.fetchedAt,
    sourceUrl: metadata.sourceUrl,
    checks: [
      {
        id: 'fetched-at-present',
        passed: Boolean(metadata.fetchedAt),
        message: metadata.fetchedAt
          ? 'Fetch timestamp is present.'
          : 'Fetch timestamp is missing.',
      },
      {
        id: 'nonzero-item-count',
        passed: metadata.itemCount > 0,
        message:
          metadata.itemCount > 0
            ? 'Dataset contains synchronized items.'
            : 'Dataset item count is zero.',
      },
      {
        id: 'complete-flag',
        passed: metadata.complete,
        message: metadata.complete
          ? 'Dataset is marked complete.'
          : 'Dataset is marked incomplete.',
      },
      {
        id: 'checksum-or-source',
        passed: Boolean(metadata.checksumSha256 || metadata.sourceUrl),
        message:
          metadata.checksumSha256 || metadata.sourceUrl
            ? 'Dataset provenance metadata is present.'
            : 'Dataset provenance metadata is missing.',
      },
    ],
    notes: metadata.notes ? [...metadata.notes] : [],
  };
}

export function getLocalYouTubeResultForHymn(hymnId: string): YouTubeSearchResult | undefined {
  return remoteDataIndex.youtube.queries.find((entry) => entry.hymnId === hymnId)?.results[0];
}
