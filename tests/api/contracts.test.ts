import { describe, expect, it } from 'vitest';

import {
  ApiClientError,
  apiContracts,
} from '@/lib/api/contracts';
import { resolveContractPath } from '@/lib/api/http';

describe('api contracts', () => {
  it('builds canonical api paths for vedabase and translator routes', () => {
    const searchRequest = apiContracts.vedabase.searchHymns.validateRequest({
      query: 'gayatri mantra',
    });
    const hymnRequest = apiContracts.vedabase.hymnById.validateRequest({
      id: 'gayatri-mantra',
    });
    const translatorRequest = apiContracts.translator.translateVerse.validateRequest({
      sanskrit: 'om bhur bhuvah',
      targetLang: 'English',
    });

    expect(
      resolveContractPath(apiContracts.vedabase.searchHymns, searchRequest),
    ).toBe('/api/vedabase/hymns/search?query=gayatri+mantra');
    expect(
      resolveContractPath(apiContracts.vedabase.hymnById, hymnRequest),
    ).toBe('/api/vedabase/hymns/gayatri-mantra');
    expect(
      resolveContractPath(apiContracts.translator.translateVerse, translatorRequest),
    ).toBe('/api/translator/verse');
    expect(
      resolveContractPath(apiContracts.vedabase.syncStatus, {}),
    ).toBe('/api/vedabase/sync/status');
  });

  it('validates murti and youtube request shapes', () => {
    expect(
      apiContracts.murti.generateMurti.validateRequest({
        deity: 'Shiva',
        context: 'temple dawn',
      }),
    ).toEqual({
      deity: 'Shiva',
      context: 'temple dawn',
    });

    expect(
      resolveContractPath(
        apiContracts.youtube.streamInfo,
        apiContracts.youtube.streamInfo.validateRequest({
          hymnId: 'gayatri-mantra',
        }),
      ),
    ).toBe('/api/youtube/streams/gayatri-mantra');
    expect(
      resolveContractPath(
        apiContracts.youtube.searchVideos,
        apiContracts.youtube.searchVideos.validateRequest({
          query: 'Gayatri Mantra',
          hymnId: 'gayatri-mantra',
        }),
      ),
    ).toBe('/api/youtube/search?query=Gayatri+Mantra&hymnId=gayatri-mantra');
  });

  it('throws deterministic api errors for invalid requests', () => {
    expect(() =>
      apiContracts.translator.translateVerse.validateRequest({
        sanskrit: '',
        targetLang: 'English',
      }),
    ).toThrow(ApiClientError);

    try {
      apiContracts.murti.deityInfo.validateRequest({ deity: '   ' });
    } catch (error) {
      expect(error).toBeInstanceOf(ApiClientError);
      const apiError = error as ApiClientError;
      expect(apiError.shape).toEqual({
        status: 400,
        code: 'murti.deityInfo.invalid_request',
        message: 'deity must be a non-empty string',
        details: { field: 'deity' },
      });
    }
  });
});
