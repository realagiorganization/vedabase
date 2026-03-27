import { useState, useEffect, useCallback } from 'react';
import { searchHymns, getHymnById } from '@/lib/api/vedabase';
import type { Hymn } from '@/types';

interface UseHymnsOptions {
  immediate?: boolean;
}

export function useHymns(query: string, options: UseHymnsOptions = {}) {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!query.trim()) {
      setHymns([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchHymns(query);
      setHymns(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (options.immediate !== false) {
      search();
    }
  }, [search, options.immediate]);

  return { hymns, loading, error, refetch: search };
}

export function useHymn(id: string | null) {
  const [hymn, setHymn] = useState<Hymn | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setHymn(null);
      return;
    }

    setLoading(true);
    setError(null);

    getHymnById(id)
      .then(setHymn)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load hymn'))
      .finally(() => setLoading(false));
  }, [id]);

  return { hymn, loading, error };
}
