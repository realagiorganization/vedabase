import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { generateCatalogFiles, writeCatalogFiles } from '../scripts/catalog.mjs';

const tempRoots = [];

afterEach(() => {
  while (tempRoots.length > 0) {
    fs.rmSync(tempRoots.pop(), { recursive: true, force: true });
  }
});

describe('static source generation', () => {
  it('emits ARM9 catalog header, source, and text snapshot', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-hymn-rom-'));
    tempRoots.push(root);

    const outputDir = path.join(root, 'source/generated');
    const snapshotDir = path.join(root, 'generated');
    const result = writeCatalogFiles({ outputDir, snapshotDir });

    expect(result.catalog.favorites).toHaveLength(3);

    const header = fs.readFileSync(path.join(outputDir, 'hymn_catalog.h'), 'utf8');
    const source = fs.readFileSync(path.join(outputDir, 'hymn_catalog.c'), 'utf8');
    const snapshot = fs.readFileSync(path.join(snapshotDir, 'hymn_catalog.snapshot.txt'), 'utf8');

    expect(header).toContain('#define VEDABASE_LANGUAGE_COUNT 4');
    expect(source).toContain('const VedabaseHymnEntry vedabase_hymns[VEDABASE_HYMN_COUNT]');
    expect(snapshot).toContain('Sri Gurvastakam [sri-gurvastakam]');
  });

  it('returns deterministic file paths for the current project layout', () => {
    const result = generateCatalogFiles();
    expect(result.files.map((file) => path.normalize(file.path))).toEqual([
      path.resolve('source/generated/hymn_catalog.h'),
      path.resolve('source/generated/hymn_catalog.c'),
      path.resolve('generated/hymn_catalog.snapshot.txt'),
    ]);
  });
});
