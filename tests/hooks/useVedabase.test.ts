import { describe, expect, it } from 'vitest';

import {
  getFeaturedHymns,
  getHymnById,
  getHymnMetadata,
  getHymnsByChapter,
  getVedabaseSyncStatus,
  searchHymns,
} from '@/lib/api/vedabase';
import { searchYouTubeVideos } from '@/lib/api/youtube';

describe('vedabase api client', () => {
  it('returns deterministic mock search results when no api base url is configured', async () => {
    const results = await searchHymns('gayatri');

    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('gayatri-mantra');
    expect(results[0]?.metadata?.title).toBe('Rigveda 3.62.10');
    expect(results[0]?.deity).toBe('Savitar');
  });

  it('loads hymn detail and metadata from the real module', async () => {
    const hymn = await getHymnById('mahamrityunjaya');
    const metadata = await getHymnMetadata('mahamrityunjaya');
    const chapterHymns = await getHymnsByChapter('rigveda-7-59-12');

    expect(hymn.title).toBe('Mahamrityunjaya');
    expect(hymn.translation).toContain('Three-eyed One');
    expect(metadata.source).toBe('Seed synchronized Vedabase corpus');
    expect(chapterHymns.map((entry) => entry.id)).toEqual(['mahamrityunjaya']);
  });

  it('throws for unknown hymn ids in mock mode', async () => {
    await expect(getHymnById('missing-hymn')).rejects.toThrow(
      'Synchronized Vedabase hymn not found: missing-hymn',
    );
  });

  it('returns sync status, featured hymns, and cached youtube results', async () => {
    const status = await getVedabaseSyncStatus();
    const featured = getFeaturedHymns();
    const youtubeResults = await searchYouTubeVideos('Gayatri Mantra');

    expect(status.vedabase.complete).toBe(true);
    expect(status.youtube.complete).toBe(true);
    expect(featured.map((item) => item.id)).toContain('gayatri-mantra');
    expect(youtubeResults[0]?.videoId).toBe('gayatri-demo');
  });
});
