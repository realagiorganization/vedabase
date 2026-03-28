import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useHymns } from '@/hooks/useHymns';

vi.mock('@/lib/api/vedabase', () => ({
  searchHymns: vi.fn(),
  getHymnById: vi.fn(),
}));

import { searchHymns, getHymnById } from '@/lib/api/vedabase';

const mockSearchHymns = searchHymns as ReturnType<typeof vi.fn>;
void getHymnById;

describe('useHymns', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchHymns', () => {
    it('returns loading state initially', () => {
      mockSearchHymns.mockImplementation(() => new Promise(() => {}));
      
      const { result } = renderHook(() => useHymns('test'));
      
      expect(result.current.loading).toBe(true);
      expect(result.current.hymns).toEqual([]);
    });

    it('returns hymns on successful search', async () => {
      const mockHymns = [{ id: '1', title: 'Gayatri' }];
      mockSearchHymns.mockResolvedValue(mockHymns);
      
      const { result } = renderHook(() => useHymns('gayatri'));
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.hymns).toEqual(mockHymns);
    });

    it('handles search error', async () => {
      mockSearchHymns.mockRejectedValue(new Error('Search failed'));
      
      const { result } = renderHook(() => useHymns('test'));
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      
      expect(result.current.error).toBe('Search failed');
    });
  });
});
