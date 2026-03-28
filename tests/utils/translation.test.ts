import { describe, expect, it } from 'vitest';

import {
  normalizeDiacritics,
  parseSanskrit,
  splitIntoWords,
} from '@/utils/translation';

describe('translation utils', () => {
  it('splits Sanskrit text into normalized word tokens', () => {
    expect(splitIntoWords('om   bhur  bhuvah')).toEqual([
      'om',
      'bhur',
      'bhuvah',
    ]);
  });

  it('normalizes supported diacritics to deterministic display glyphs', () => {
    expect(normalizeDiacritics('ā ṛ ś')).toBe('आ ऋ श');
  });

  it('parses Sanskrit text using the real utility functions', () => {
    expect(parseSanskrit('ॐ भूर् भुवः')).toEqual({
      original: 'ॐ भूर् भुवः',
      words: ['ॐ', 'भूर्', 'भुवः'],
      syllables: 9,
    });
  });
});
