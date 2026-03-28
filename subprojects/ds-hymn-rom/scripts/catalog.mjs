import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_INPUT = path.resolve('data/hymn-catalog.mock.json');
export const DEFAULT_OUTPUT_DIR = path.resolve('source/generated');
export const DEFAULT_SNAPSHOT_DIR = path.resolve('generated');

function ensureString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function sanitizeIdentifier(value) {
  return value.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '').toUpperCase();
}

function escapeCString(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}

export function loadCatalog(inputFile = DEFAULT_INPUT) {
  const raw = fs.readFileSync(inputFile, 'utf8');
  return JSON.parse(raw);
}

export function validateCatalog(catalog) {
  ensureString(catalog.catalogTitle, 'catalogTitle');

  if (!Array.isArray(catalog.languages) || catalog.languages.length === 0) {
    throw new Error('languages must be a non-empty array');
  }

  if (!Array.isArray(catalog.favorites) || catalog.favorites.length === 0) {
    throw new Error('favorites must be a non-empty array');
  }

  const uniqueLanguages = new Set();
  for (const language of catalog.languages) {
    ensureString(language, 'language');
    uniqueLanguages.add(language);
  }

  if (uniqueLanguages.size !== catalog.languages.length) {
    throw new Error('languages must be unique');
  }

  const ids = new Set();
  for (const favorite of catalog.favorites) {
    ensureString(favorite.id, 'favorite.id');
    ensureString(favorite.title, `favorite.title for ${favorite.id}`);
    ensureString(favorite.source, `favorite.source for ${favorite.id}`);

    if (ids.has(favorite.id)) {
      throw new Error(`duplicate favorite.id: ${favorite.id}`);
    }
    ids.add(favorite.id);

    if (!Array.isArray(favorite.transcription) || favorite.transcription.length === 0) {
      throw new Error(`favorite.transcription for ${favorite.id} must be a non-empty array`);
    }

    for (const line of favorite.transcription) {
      ensureString(line, `transcription line for ${favorite.id}`);
    }

    if (!favorite.translations || typeof favorite.translations !== 'object') {
      throw new Error(`favorite.translations for ${favorite.id} must be an object`);
    }

    for (const language of catalog.languages) {
      ensureString(
        favorite.translations[language],
        `translation ${language} for ${favorite.id}`,
      );
    }
  }

  return catalog;
}

export function toCatalogSnapshot(catalog) {
  const lines = [
    `Catalog: ${catalog.catalogTitle}`,
    `Languages: ${catalog.languages.join(', ')}`,
    '',
  ];

  for (const favorite of catalog.favorites) {
    lines.push(`${favorite.title} [${favorite.id}]`);
    lines.push(`Source: ${favorite.source}`);
    lines.push('Transcription:');
    for (const line of favorite.transcription) {
      lines.push(`- ${line}`);
    }
    lines.push('Translations:');
    for (const language of catalog.languages) {
      lines.push(`${language}: ${favorite.translations[language]}`);
    }
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}

function renderStringArray(name, values) {
  const body = values.map((value) => `    "${escapeCString(value)}"`).join(',\n');
  return `const char *const ${name}[] = {\n${body}\n};\n`;
}

function renderEntryBlock(catalog) {
  return catalog.favorites
    .map((favorite) => {
      const transcription = favorite.transcription.join('\\n');
      const translations = catalog.languages
        .map((language) => `        "${escapeCString(favorite.translations[language])}"`)
        .join(',\n');
      return [
        '    {',
        `        "${escapeCString(favorite.id)}",`,
        `        "${escapeCString(favorite.title)}",`,
        `        "${escapeCString(favorite.source)}",`,
        `        "${escapeCString(transcription)}",`,
        '        {',
        `${translations}`,
        '        }',
        '    }',
      ].join('\n');
    })
    .join(',\n');
}

export function renderHeader(catalog) {
  return `#ifndef VEDABASE_HYMN_CATALOG_H
#define VEDABASE_HYMN_CATALOG_H

#define VEDABASE_LANGUAGE_COUNT ${catalog.languages.length}
#define VEDABASE_HYMN_COUNT ${catalog.favorites.length}

typedef struct {
    const char *id;
    const char *title;
    const char *source;
    const char *transcription;
    const char *translations[VEDABASE_LANGUAGE_COUNT];
} VedabaseHymnEntry;

extern const char *const vedabase_languages[VEDABASE_LANGUAGE_COUNT];
extern const VedabaseHymnEntry vedabase_hymns[VEDABASE_HYMN_COUNT];
extern const char *const vedabase_catalog_title;

#endif
`;
}

export function renderSource(catalog) {
  const languageArray = renderStringArray('vedabase_languages', catalog.languages);
  const hymns = renderEntryBlock(catalog);

  return `#include "hymn_catalog.h"

const char *const vedabase_catalog_title = "${escapeCString(catalog.catalogTitle)}";

${languageArray}

const VedabaseHymnEntry vedabase_hymns[VEDABASE_HYMN_COUNT] = {
${hymns}
};
`;
}

export function generateCatalogFiles({
  inputFile = DEFAULT_INPUT,
  outputDir = DEFAULT_OUTPUT_DIR,
  snapshotDir = DEFAULT_SNAPSHOT_DIR,
} = {}) {
  const catalog = validateCatalog(loadCatalog(inputFile));
  const header = renderHeader(catalog);
  const source = renderSource(catalog);
  const snapshot = toCatalogSnapshot(catalog);

  return {
    catalog,
    files: [
      {
        path: path.join(outputDir, 'hymn_catalog.h'),
        contents: header,
      },
      {
        path: path.join(outputDir, 'hymn_catalog.c'),
        contents: source,
      },
      {
        path: path.join(snapshotDir, 'hymn_catalog.snapshot.txt'),
        contents: snapshot,
      },
    ],
  };
}

export function writeCatalogFiles(options = {}) {
  const result = generateCatalogFiles(options);
  for (const file of result.files) {
    fs.mkdirSync(path.dirname(file.path), { recursive: true });
    fs.writeFileSync(file.path, file.contents);
  }
  return result;
}

export function checkCatalogFiles(options = {}) {
  const result = generateCatalogFiles(options);
  const mismatches = [];

  for (const file of result.files) {
    const current = fs.existsSync(file.path) ? fs.readFileSync(file.path, 'utf8') : null;
    if (current !== file.contents) {
      mismatches.push(file.path);
    }
  }

  return {
    ...result,
    mismatches,
  };
}

export function outputSummary(result) {
  return [
    `catalog: ${result.catalog.catalogTitle}`,
    `languages: ${result.catalog.languages.join(', ')}`,
    `favorites: ${result.catalog.favorites.length}`,
  ].join('\n');
}

export { sanitizeIdentifier };
