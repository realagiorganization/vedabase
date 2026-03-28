import type {
  DeityInfo,
  Hymn,
  Metadata,
  MurtiImage,
  Pronunciation,
  Recording,
  StreamInfo,
  Style,
  Translation,
  Underword,
} from './types';

export type ApiMethod = 'GET' | 'POST';

export interface ApiErrorShape {
  status: number;
  code: string;
  message: string;
  details?: Record<string, string>;
}

export class ApiClientError extends Error {
  readonly shape: ApiErrorShape;

  constructor(shape: ApiErrorShape) {
    super(shape.message);
    this.name = 'ApiClientError';
    this.shape = shape;
  }
}

export interface ApiContract<Request, Response> {
  key: string;
  method: ApiMethod;
  path: string | ((request: Request) => string);
  validateRequest: (request: Request) => Request;
  responseExample: Response;
}

export interface SearchHymnsRequest {
  query: string;
}

export interface HymnByIdRequest {
  id: string;
}

export interface HymnsByChapterRequest {
  chapterId: string;
}

export interface TranslateVerseRequest {
  sanskrit: string;
  targetLang: string;
}

export interface UnderwordRequest {
  sanskrit: string;
}

export interface PronunciationRequest {
  sanskrit: string;
}

export interface GenerateMurtiRequest {
  deity: string;
  context: string;
}

export interface DeityInfoRequest {
  deity: string;
}

export interface YouTubeStreamRequest {
  hymnId: string;
}

export interface RecordingRequest {
  sessionId: string;
}

function requireNonEmptyString(
  value: string,
  field: string,
  contractKey: string,
): string {
  if (!value.trim()) {
    throw new ApiClientError({
      status: 400,
      code: `${contractKey}.invalid_request`,
      message: `${field} must be a non-empty string`,
      details: { field },
    });
  }

  return value.trim();
}

export const apiContracts = {
  vedabase: {
    searchHymns: {
      key: 'vedabase.searchHymns',
      method: 'GET',
      path: ({ query }: SearchHymnsRequest) =>
        `/api/vedabase/hymns/search?${new URLSearchParams({
          query: requireNonEmptyString(
            query,
            'query',
            'vedabase.searchHymns',
          ),
        }).toString()}`,
      validateRequest: ({ query }: SearchHymnsRequest) => ({
        query: requireNonEmptyString(query, 'query', 'vedabase.searchHymns'),
      }),
      responseExample: [] as Hymn[],
    } satisfies ApiContract<SearchHymnsRequest, Hymn[]>,
    hymnById: {
      key: 'vedabase.hymnById',
      method: 'GET',
      path: ({ id }: HymnByIdRequest) =>
        `/api/vedabase/hymns/${encodeURIComponent(
          requireNonEmptyString(id, 'id', 'vedabase.hymnById'),
        )}`,
      validateRequest: ({ id }: HymnByIdRequest) => ({
        id: requireNonEmptyString(id, 'id', 'vedabase.hymnById'),
      }),
      responseExample: {} as Hymn,
    } satisfies ApiContract<HymnByIdRequest, Hymn>,
    hymnsByChapter: {
      key: 'vedabase.hymnsByChapter',
      method: 'GET',
      path: ({ chapterId }: HymnsByChapterRequest) =>
        `/api/vedabase/chapters/${encodeURIComponent(
          requireNonEmptyString(
            chapterId,
            'chapterId',
            'vedabase.hymnsByChapter',
          ),
        )}/hymns`,
      validateRequest: ({ chapterId }: HymnsByChapterRequest) => ({
        chapterId: requireNonEmptyString(
          chapterId,
          'chapterId',
          'vedabase.hymnsByChapter',
        ),
      }),
      responseExample: [] as Hymn[],
    } satisfies ApiContract<HymnsByChapterRequest, Hymn[]>,
    hymnMetadata: {
      key: 'vedabase.hymnMetadata',
      method: 'GET',
      path: ({ id }: HymnByIdRequest) =>
        `/api/vedabase/hymns/${encodeURIComponent(
          requireNonEmptyString(id, 'id', 'vedabase.hymnMetadata'),
        )}/metadata`,
      validateRequest: ({ id }: HymnByIdRequest) => ({
        id: requireNonEmptyString(id, 'id', 'vedabase.hymnMetadata'),
      }),
      responseExample: {} as Metadata,
    } satisfies ApiContract<HymnByIdRequest, Metadata>,
  },
  translator: {
    translateVerse: {
      key: 'translator.translateVerse',
      method: 'POST',
      path: '/api/translator/verse',
      validateRequest: ({ sanskrit, targetLang }: TranslateVerseRequest) => ({
        sanskrit: requireNonEmptyString(
          sanskrit,
          'sanskrit',
          'translator.translateVerse',
        ),
        targetLang: requireNonEmptyString(
          targetLang,
          'targetLang',
          'translator.translateVerse',
        ),
      }),
      responseExample: {} as Translation,
    } satisfies ApiContract<TranslateVerseRequest, Translation>,
    underword: {
      key: 'translator.underword',
      method: 'POST',
      path: '/api/translator/underword',
      validateRequest: ({ sanskrit }: UnderwordRequest) => ({
        sanskrit: requireNonEmptyString(
          sanskrit,
          'sanskrit',
          'translator.underword',
        ),
      }),
      responseExample: [] as Underword[],
    } satisfies ApiContract<UnderwordRequest, Underword[]>,
    pronunciation: {
      key: 'translator.pronunciation',
      method: 'POST',
      path: '/api/translator/pronunciation',
      validateRequest: ({ sanskrit }: PronunciationRequest) => ({
        sanskrit: requireNonEmptyString(
          sanskrit,
          'sanskrit',
          'translator.pronunciation',
        ),
      }),
      responseExample: {} as Pronunciation,
    } satisfies ApiContract<PronunciationRequest, Pronunciation>,
  },
  murti: {
    generateMurti: {
      key: 'murti.generateMurti',
      method: 'POST',
      path: '/api/murti/generate',
      validateRequest: ({ deity, context }: GenerateMurtiRequest) => ({
        deity: requireNonEmptyString(deity, 'deity', 'murti.generateMurti'),
        context: requireNonEmptyString(
          context,
          'context',
          'murti.generateMurti',
        ),
      }),
      responseExample: {} as MurtiImage,
    } satisfies ApiContract<GenerateMurtiRequest, MurtiImage>,
    getStyles: {
      key: 'murti.getStyles',
      method: 'GET',
      path: '/api/murti/styles',
      validateRequest: () => ({}),
      responseExample: [] as Style[],
    } satisfies ApiContract<Record<string, never>, Style[]>,
    deityInfo: {
      key: 'murti.deityInfo',
      method: 'GET',
      path: ({ deity }: DeityInfoRequest) =>
        `/api/murti/deities/${encodeURIComponent(
          requireNonEmptyString(deity, 'deity', 'murti.deityInfo'),
        )}`,
      validateRequest: ({ deity }: DeityInfoRequest) => ({
        deity: requireNonEmptyString(deity, 'deity', 'murti.deityInfo'),
      }),
      responseExample: {} as DeityInfo,
    } satisfies ApiContract<DeityInfoRequest, DeityInfo>,
  },
  youtube: {
    streamInfo: {
      key: 'youtube.streamInfo',
      method: 'GET',
      path: ({ hymnId }: YouTubeStreamRequest) =>
        `/api/youtube/streams/${encodeURIComponent(
          requireNonEmptyString(hymnId, 'hymnId', 'youtube.streamInfo'),
        )}`,
      validateRequest: ({ hymnId }: YouTubeStreamRequest) => ({
        hymnId: requireNonEmptyString(hymnId, 'hymnId', 'youtube.streamInfo'),
      }),
      responseExample: {} as StreamInfo,
    } satisfies ApiContract<YouTubeStreamRequest, StreamInfo>,
    startRecording: {
      key: 'youtube.startRecording',
      method: 'POST',
      path: '/api/youtube/recording/start',
      validateRequest: ({ sessionId }: RecordingRequest) => ({
        sessionId: requireNonEmptyString(
          sessionId,
          'sessionId',
          'youtube.startRecording',
        ),
      }),
      responseExample: {} as Recording,
    } satisfies ApiContract<RecordingRequest, Recording>,
    stopRecording: {
      key: 'youtube.stopRecording',
      method: 'POST',
      path: '/api/youtube/recording/stop',
      validateRequest: ({ sessionId }: RecordingRequest) => ({
        sessionId: requireNonEmptyString(
          sessionId,
          'sessionId',
          'youtube.stopRecording',
        ),
      }),
      responseExample: {} as Recording,
    } satisfies ApiContract<RecordingRequest, Recording>,
  },
};
