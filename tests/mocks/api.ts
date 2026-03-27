export type VedabaseEntry = {
  id: string;
  title: string;
  text: string;
};

export const vedabaseResponse: VedabaseEntry[] = [
  {
    id: 'sb-1.1.1',
    title: 'Srimad Bhagavatam 1.1.1',
    text: 'Om namo bhagavate vasudevaya.',
  },
  {
    id: 'bg-4.7',
    title: 'Bhagavad-gita 4.7',
    text: 'Whenever there is decline in dharma...',
  },
];

export const translatorResponse = {
  sourceLanguage: 'en',
  targetLanguage: 'es',
  translatedText: 'Siempre que haya un declive del dharma...',
};

export const murtiResponse = {
  id: 'murti-krishna-01',
  name: 'Sri Krishna Murti',
  imageUrl: 'https://example.test/murtis/krishna.jpg',
};

export const mockFetchVedabaseSuccess = () =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => vedabaseResponse,
  });

export const mockFetchTranslatorSuccess = () =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => translatorResponse,
  });

export const mockFetchMurtiSuccess = () =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: async () => murtiResponse,
  });
