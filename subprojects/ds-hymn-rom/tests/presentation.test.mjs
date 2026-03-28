import { describe, expect, it } from 'vitest';
import { loadCatalog, validateCatalog } from '../scripts/catalog.mjs';
import {
  buildDisplayModel,
  chunkLines,
  cycleIndex,
  wrapText,
} from '../scripts/presentation.mjs';

const catalog = validateCatalog(loadCatalog());

describe('mocked presentation model', () => {
  it('cycles hymn and language indexes predictably', () => {
    expect(cycleIndex(0, 1, catalog.favorites.length)).toBe(1);
    expect(cycleIndex(0, -1, catalog.favorites.length)).toBe(catalog.favorites.length - 1);
    expect(cycleIndex(3, 2, 4)).toBe(1);
  });

  it('wraps translations into DS-friendly pages', () => {
    const model = buildDisplayModel(catalog, 2, 3, { width: 24, pageSize: 3 });

    expect(model.language).toBe('es');
    expect(model.title).toBe('Nama-sankirtana Chorus');
    expect(model.translationPages.length).toBeGreaterThan(0);
    expect(model.translationPages[0].join(' ')).toContain('Krishna');
    expect(model.translationPages.every((page) => page.length <= 3)).toBe(true);
  });

  it('keeps wrapped lines below the target width', () => {
    const lines = wrapText(
      'Una invocacion congregacional para recordar a Krishna y Rama por medio del maha-mantra.',
      18,
    );
    const pages = chunkLines(lines, 2);

    expect(lines.every((line) => line.length <= 18)).toBe(true);
    expect(pages).toHaveLength(3);
  });
});
