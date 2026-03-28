export function splitIntoWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

export function normalizeDiacritics(text: string): string {
  const iastToDevanagari: Record<string, string> = {
    'ā': 'आ',
    'ī': 'ई',
    'ū': 'ऊ',
    'ṛ': 'ऋ',
    'ṝ': 'ॠ',
    'ḷ': 'ऌ',
    'ṅ': 'ङ',
    'ñ': 'ञ',
    'ṭ': 'ट',
    'ḍ': 'ड',
    'ṇ': 'ण',
    'ś': 'श',
    'ṣ': 'ष',
  };

  return text.replace(/[a-zA-Zāīūṛṝḷṅñṭḍṇśṣ]/g, (char) => 
    iastToDevanagari[char] || char
  );
}

export interface ParsedSanskrit {
  original: string;
  words: string[];
  syllables: number;
}

export function parseSanskrit(text: string): ParsedSanskrit {
  const words = splitIntoWords(text);
  const syllables = text.split('').filter((char) => 
    /[\u0900-\u097F]/.test(char)
  ).length;

  return {
    original: text,
    words,
    syllables,
  };
}
