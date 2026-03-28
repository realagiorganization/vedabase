export function cycleIndex(current, delta, length) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error('length must be a positive integer');
  }
  return (current + delta % length + length) % length;
}

export function wrapText(text, width = 30) {
  if (!Number.isInteger(width) || width < 8) {
    throw new Error('width must be an integer greater than or equal to 8');
  }

  const normalized = text.split('\n').flatMap((line) => {
    if (line.trim().length === 0) {
      return [''];
    }

    const words = line.trim().split(/\s+/);
    const wrapped = [];
    let current = '';

    for (const word of words) {
      const next = current.length === 0 ? word : `${current} ${word}`;
      if (next.length <= width) {
        current = next;
        continue;
      }

      if (current.length > 0) {
        wrapped.push(current);
      }
      current = word;
    }

    if (current.length > 0) {
      wrapped.push(current);
    }

    return wrapped;
  });

  return normalized;
}

export function chunkLines(lines, pageSize = 8) {
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    throw new Error('pageSize must be a positive integer');
  }

  const pages = [];
  for (let index = 0; index < lines.length; index += pageSize) {
    pages.push(lines.slice(index, index + pageSize));
  }
  return pages;
}

export function buildDisplayModel(catalog, hymnIndex, languageIndex, options = {}) {
  const width = options.width ?? 30;
  const pageSize = options.pageSize ?? 8;
  const hymn = catalog.favorites[hymnIndex];
  const language = catalog.languages[languageIndex];

  if (!hymn) {
    throw new Error(`missing hymn at index ${hymnIndex}`);
  }

  if (!language) {
    throw new Error(`missing language at index ${languageIndex}`);
  }

  const transcriptionPages = chunkLines(wrapText(hymn.transcription.join('\n'), width), pageSize);
  const translationPages = chunkLines(wrapText(hymn.translations[language], width), pageSize);

  return {
    title: hymn.title,
    source: hymn.source,
    language,
    transcriptionPages,
    translationPages,
  };
}
