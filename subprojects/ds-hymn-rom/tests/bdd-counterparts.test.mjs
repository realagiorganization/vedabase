import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkCatalogFiles, loadCatalog, validateCatalog } from '../scripts/catalog.mjs';
import { buildDisplayModel } from '../scripts/presentation.mjs';

function readFeature(name) {
  return fs.readFileSync(path.resolve('features', name), 'utf8');
}

describe('BDD counterparts', () => {
  it('keeps the catalog-generation feature aligned with generated outputs', () => {
    const feature = readFeature('catalog-generation.feature');
    const check = checkCatalogFiles();

    expect(feature).toContain('Scenario: Build ARM9 catalog sources from hymn JSON mocks');
    expect(check.mismatches).toEqual([]);
  });

  it('keeps the ROM navigation feature aligned with the mocked presentation model', () => {
    const feature = readFeature('rom-navigation.feature');
    const catalog = validateCatalog(loadCatalog());
    const model = buildDisplayModel(catalog, 1, 3, { width: 24, pageSize: 4 });

    expect(feature).toContain('Scenario: Switch to a selected hymn and translation language');
    expect(model.title).toBe('Gurv-astaka Refrain');
    expect(model.language).toBe('es');
    expect(model.translationPages.flat().join(' ')).toContain('refugio');
    expect(model.translationPages.every((page) => page.length <= 4)).toBe(true);
  });
});
