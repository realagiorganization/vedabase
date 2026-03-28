import { describe, expect, it } from 'vitest';

import {
  createLocalHymnSearchResponse,
  createLocalSyncFetchResponse,
  getFeaturedLocalHymns,
  getLocalCompletenessDiagnostics,
  getLocalSyncStatus,
  getLocalYouTubeResults,
  searchLocalHymns,
} from '@/lib/api/localData';

describe('local synchronized data helpers', () => {
  it('searches the synchronized vedabase corpus', () => {
    const results = searchLocalHymns('guru');

    expect(results.map((item) => item.id)).toContain('sri-gurvastakam');
  });

  it('returns featured hymns and sync status', () => {
    const featured = getFeaturedLocalHymns();
    const status = getLocalSyncStatus();

    expect(featured).toHaveLength(3);
    expect(status.vedabase.status).toBe('fresh');
    expect(status.youtube.status).toBe('fresh');
  });

  it('filters cached youtube results by query', () => {
    const results = getLocalYouTubeResults('Mahamrityunjaya');

    expect(results).toHaveLength(1);
    expect(results[0]?.videoId).toBe('mahamrityunjaya-demo');
  });

  it('builds typed local hymn search and fetch responses', () => {
    const searchResponse = createLocalHymnSearchResponse('guru');
    const fetchResponse = createLocalSyncFetchResponse({
      dataset: 'vedabase-dump',
    });

    expect(searchResponse.query).toBe('guru');
    expect(searchResponse.total).toBeGreaterThan(0);
    expect(searchResponse.items[0]?.id).toBe('sri-gurvastakam');
    expect(searchResponse.source).toBe('local-cache');
    expect(fetchResponse.dataset).toBe('vedabase-dump');
    expect(fetchResponse.complete).toBe(true);
  });

  it('returns completeness diagnostics for synchronized datasets', () => {
    const diagnostics = getLocalCompletenessDiagnostics('vedabase-dump');

    expect(diagnostics.dataset).toBe('vedabase-dump');
    expect(diagnostics.complete).toBe(true);
    expect(diagnostics.checks.every((check) => check.passed)).toBe(true);
  });
});
