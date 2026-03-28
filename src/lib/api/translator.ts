import type { Pronunciation, Translation, Underword } from "./types";
import { apiContracts } from "./contracts";
import { API_BASE_URL, requestContractJson } from "./http";

function splitTerms(sanskrit: string): string[] {
  return sanskrit.split(/\s+/).filter(Boolean);
}

/**
 * Translates a Sanskrit verse into a target language.
 */
export async function translateVerse(
  sanskrit: string,
  targetLang: string,
): Promise<Translation> {
  const request = apiContracts.translator.translateVerse.validateRequest({
    sanskrit,
    targetLang,
  });

  if (!API_BASE_URL) {
    return {
      original: request.sanskrit,
      targetLang: request.targetLang,
      translatedText:
        request.targetLang.toLowerCase() === "english"
          ? "May we meditate on the divine radiance that illuminates understanding."
          : `[${request.targetLang}] Mock translation for: ${request.sanskrit}`,
      confidence: 0.92,
    };
  }

  return requestContractJson(apiContracts.translator.translateVerse, request, {
    method: apiContracts.translator.translateVerse.method,
    body: JSON.stringify(request),
  });
}

/**
 * Returns segmented underword analysis for Sanskrit input.
 */
export async function getUnderword(sanskrit: string): Promise<Underword[]> {
  const request = apiContracts.translator.underword.validateRequest({ sanskrit });

  if (!API_BASE_URL) {
    return splitTerms(request.sanskrit).map((term, index) => ({
      term,
      root: term,
      meaning:
        index === 0
          ? "sacred invocation"
          : `mock gloss ${index + 1} for ${term}`,
      grammar: index === 0 ? "particle" : "nominal segment",
    }));
  }

  return requestContractJson(apiContracts.translator.underword, request, {
    method: apiContracts.translator.underword.method,
    body: JSON.stringify(request),
  });
}

/**
 * Gets pronunciation guidance for Sanskrit text.
 */
export async function getPronunciation(
  sanskrit: string,
): Promise<Pronunciation> {
  const request = apiContracts.translator.pronunciation.validateRequest({
    sanskrit,
  });

  if (!API_BASE_URL) {
    const syllables = splitTerms(request.sanskrit);

    return {
      text: request.sanskrit,
      ipa: "/oːm bʱuːr bʱuʋəɦ/",
      syllables,
    };
  }

  return requestContractJson(apiContracts.translator.pronunciation, request, {
    method: apiContracts.translator.pronunciation.method,
    body: JSON.stringify(request),
  });
}
