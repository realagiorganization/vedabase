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

  it('keeps the ROM compilation feature aligned with the Docker and Makefile build path', () => {
    const feature = readFeature('rom-compilation.feature');
    const makefile = fs.readFileSync(path.resolve('Makefile'), 'utf8');
    const dockerfile = fs.readFileSync(path.resolve('Dockerfile'), 'utf8');
    const arm9Source = fs.readFileSync(path.resolve('source/main.c'), 'utf8');

    expect(feature).toContain('Scenario: Build the ARM9 hymn ROM with the BlocksDS container toolchain');
    expect(makefile).toContain('docker-build-rom: generate');
    expect(makefile).toContain('skylyrac/blocksds:slim-latest');
    expect(makefile).toContain('ROM := $(NAME).nds');
    expect(dockerfile).toContain('FROM skylyrac/blocksds:slim-latest');
    expect(dockerfile).toContain('CMD ["make", "nds-build"]');
    expect(arm9Source).toContain('Vedabase Favorites');
  });

  it('keeps the emulator launch feature aligned with capture and navigation behavior', () => {
    const feature = readFeature('emulator-launch.feature');
    const smokeScript = fs.readFileSync(path.resolve('scripts/emulator-smoke.sh'), 'utf8');
    const arm9Source = fs.readFileSync(path.resolve('source/main.c'), 'utf8');

    expect(feature).toContain('Scenario: Launch the compiled hymn ROM under melonDS and record media');
    expect(smokeScript).toContain('boot-frame.png');
    expect(smokeScript).toContain('steady-frame.png');
    expect(smokeScript).toContain('smoke.mp4');
    expect(smokeScript).toContain('smoke.gif');
    expect(smokeScript).toContain('Xvfb');
    expect(smokeScript).toContain('"$EMULATOR_BIN" --boot never "$ROM_PATH"');
    expect(arm9Source).toContain('Use Left/Right for hymn');
    expect(arm9Source).toContain('Use Up/Down for language');
  });
});
