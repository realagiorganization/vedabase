import { translatorResponse } from '../mocks/api';
import { describe, expect, it } from 'vitest';

type TranslationPayload = {
  sourceLanguage: string;
  targetLanguage: string;
  translatedText: string;
};

function translateText(payload: TranslationPayload) {
  return `[${payload.sourceLanguage}->${payload.targetLanguage}] ${payload.translatedText}`;
}

describe('translateText', () => {
  it('formats translator response data', () => {
    const message = translateText(translatorResponse);

    expect(message).toBe(
      '[en->es] Siempre que haya un declive del dharma...',
    );
  });
});
