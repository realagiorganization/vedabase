import { describe, expect, it } from 'vitest';

import {
  getHymnById,
  getHymnMetadata,
  getHymnsByChapter,
  searchHymns,
} from '@/lib/api/vedabase';

describe('vedabase api client', () => {
  it('returns deterministic mock search results when no api base url is configured', async () => {
    const results = await searchHymns('gayatri');

    expect(results).toHaveLength(1);
    expect(results[0]?.id).toBe('gayatri-mantra');
    expect(results[0]?.metadata?.title).toBe('Rigveda 3.62.10');
  });

  it('loads hymn detail and metadata from the real module', async () => {
    const hymn = await getHymnById('mahamrityunjaya');
    const metadata = await getHymnMetadata('mahamrityunjaya');
    const chapterHymns = await getHymnsByChapter('rigveda-7-59-12');

    expect(hymn.title).toBe('Mahamrityunjaya');
    expect(hymn.translation).toContain('Three-eyed One');
    expect(metadata.source).toBe('Mock Vedabase corpus');
    expect(chapterHymns.map((entry) => entry.id)).toEqual(['mahamrityunjaya']);
  });

  it('throws for unknown hymn ids in mock mode', async () => {
    await expect(getHymnById('missing-hymn')).rejects.toThrow(
      'Mock Vedabase hymn not found: missing-hymn',
    );
  });
});
