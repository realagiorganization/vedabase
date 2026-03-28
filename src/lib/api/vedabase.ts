import type { Hymn, Metadata } from "./types";
import { apiContracts } from "./contracts";
import { API_BASE_URL, createApiError, requestContractJson } from "./http";

const MOCK_HYMNS: Hymn[] = [
  {
    id: "gayatri-mantra",
    chapterId: "rigveda-3-62-10",
    title: "Gayatri Mantra",
    sanskrit: "ॐ भूर् भुवः स्वः तत् सवितुर्वरेण्यं",
    transliteration: "om bhur bhuvah svah tat savitur varenyam",
    translation: "We meditate on the adorable radiance of Savitar.",
    metadata: {
      id: "meta-gayatri-mantra",
      chapterId: "rigveda-3-62-10",
      title: "Rigveda 3.62.10",
      source: "Mock Vedabase corpus",
      tags: ["featured", "karaoke", "savitar"],
    },
  },
  {
    id: "mahamrityunjaya",
    chapterId: "rigveda-7-59-12",
    title: "Mahamrityunjaya",
    sanskrit: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्",
    transliteration: "om tryambakam yajamahe sugandhim pustivardhanam",
    translation: "We worship the fragrant Three-eyed One who nourishes all beings.",
    metadata: {
      id: "meta-mahamrityunjaya",
      chapterId: "rigveda-7-59-12",
      title: "Rigveda 7.59.12",
      source: "Mock Vedabase corpus",
      tags: ["featured", "shiva", "healing"],
    },
  },
  {
    id: "durga-suktam",
    chapterId: "taittiriya-aranyaka-4",
    title: "Durga Suktam",
    sanskrit: "ॐ जातवेदसे सुनवाम सोमम्",
    transliteration: "om jatavedase sunavama somam",
    translation: "We invoke the all-knowing fire to guide us through difficulty.",
    metadata: {
      id: "meta-durga-suktam",
      chapterId: "taittiriya-aranyaka-4",
      title: "Taittiriya Aranyaka 4",
      source: "Mock Vedabase corpus",
      tags: ["featured", "durga", "protection"],
    },
  },
];

/**
 * Searches Vedabase hymns matching the user query.
 */
export async function searchHymns(query: string): Promise<Hymn[]> {
  const request = apiContracts.vedabase.searchHymns.validateRequest({ query });

  if (!API_BASE_URL) {
    const normalizedQuery = request.query.toLowerCase();

    return MOCK_HYMNS.filter((hymn) =>
      [hymn.title, hymn.sanskrit, hymn.transliteration, hymn.metadata?.title]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery)),
    );
  }

  return requestContractJson(apiContracts.vedabase.searchHymns, request, {
    method: apiContracts.vedabase.searchHymns.method,
  });
}

/**
 * Fetches a single hymn by its identifier.
 */
export async function getHymnById(id: string): Promise<Hymn> {
  const request = apiContracts.vedabase.hymnById.validateRequest({ id });

  if (!API_BASE_URL) {
    const hymn = MOCK_HYMNS.find((entry) => entry.id === request.id);

    if (!hymn) {
      throw createApiError({
        status: 404,
        code: "vedabase.hymnById.not_found",
        message: `Mock Vedabase hymn not found: ${request.id}`,
        details: { id: request.id },
      });
    }

    return hymn;
  }

  return requestContractJson(apiContracts.vedabase.hymnById, request, {
    method: apiContracts.vedabase.hymnById.method,
  });
}

/**
 * Lists all hymns inside a chapter.
 */
export async function getHymnsByChapter(chapterId: string): Promise<Hymn[]> {
  const request = apiContracts.vedabase.hymnsByChapter.validateRequest({
    chapterId,
  });

  if (!API_BASE_URL) {
    return MOCK_HYMNS.filter((hymn) => hymn.chapterId === request.chapterId);
  }

  return requestContractJson(apiContracts.vedabase.hymnsByChapter, request, {
    method: apiContracts.vedabase.hymnsByChapter.method,
  });
}

/**
 * Retrieves metadata for a hymn.
 */
export async function getHymnMetadata(id: string): Promise<Metadata> {
  const request = apiContracts.vedabase.hymnMetadata.validateRequest({ id });

  if (!API_BASE_URL) {
    const hymn = await getHymnById(request.id);

    return hymn.metadata ?? {
      id: `meta-${hymn.id}`,
      chapterId: hymn.chapterId,
      title: hymn.title,
      source: "Mock Vedabase corpus",
    };
  }

  return requestContractJson(apiContracts.vedabase.hymnMetadata, request, {
    method: apiContracts.vedabase.hymnMetadata.method,
  });
}
