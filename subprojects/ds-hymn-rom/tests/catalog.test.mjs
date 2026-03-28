import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_INPUT,
  checkCatalogFiles,
  loadCatalog,
  toCatalogSnapshot,
  validateCatalog,
} from '../scripts/catalog.mjs';

describe('hymn catalog mocks', () => {
  it('cover every declared language for each favorite hymn', () => {
    const catalog = validateCatalog(loadCatalog(DEFAULT_INPUT));

    for (const favorite of catalog.favorites) {
      for (const language of catalog.languages) {
        expect(favorite.translations[language]).toBeTruthy();
      }
    }
  });

  it('matches the generated snapshot text after generation', () => {
    const catalog = validateCatalog(loadCatalog(DEFAULT_INPUT));
    const check = checkCatalogFiles();
    const snapshotPath = path.resolve('generated/hymn_catalog.snapshot.txt');
    const expected = toCatalogSnapshot(catalog);

    if (!fs.existsSync(snapshotPath)) {
      fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
      fs.writeFileSync(snapshotPath, expected);
    }

    expect(check.mismatches).toEqual([]);
    expect(fs.readFileSync(snapshotPath, 'utf8')).toBe(expected);
  });
});
