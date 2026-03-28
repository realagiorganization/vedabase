import { describe, expect, it } from 'vitest';

import {
  getFeaturedLocalHymns,
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
});
