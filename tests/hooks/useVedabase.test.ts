import { renderHook, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { describe, expect, it } from 'vitest';

import { mockFetchVedabaseSuccess, vedabaseResponse } from '../mocks/api';

type VedabaseState = {
  loading: boolean;
  items: typeof vedabaseResponse;
};

function useVedabase(query: string): VedabaseState {
  const [state, setState] = useState<VedabaseState>({
    loading: true,
    items: [],
  });

  useEffect(() => {
    let active = true;

    fetch(`/api/vedabase?q=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((items: typeof vedabaseResponse) => {
        if (active) {
          setState({ loading: false, items });
        }
      });

    return () => {
      active = false;
    };
  }, [query]);

  return state;
}

describe('useVedabase', () => {
  it('loads vedabase data from mocked fetch', async () => {
    (fetch as any).mockImplementation(mockFetchVedabaseSuccess);

    const { result } = renderHook(() => useVedabase('dharma'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith('/api/vedabase?q=dharma');
    expect(result.current.items).toEqual(vedabaseResponse);
  });
});
