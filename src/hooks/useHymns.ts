import { useState, useEffect, useCallback } from 'react';
import { searchHymns, getHymnById, getVedabaseSyncStatus } from '@/lib/api/vedabase';
import { searchYouTubeVideos } from '@/lib/api/youtube';
import type { Hymn, RemoteSyncStatus, YouTubeSearchResult } from '@/lib/api/types';

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
      void search();
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

export function useVedabaseSyncStatus() {
  const [status, setStatus] = useState<RemoteSyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getVedabaseSyncStatus()
      .then(setStatus)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load sync status'))
      .finally(() => setLoading(false));
  }, []);

  return { status, loading, error };
}

export function useYouTubeSearch(query: string, hymnId?: string | null) {
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await searchYouTubeVideos(query, hymnId ?? undefined);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'YouTube search failed');
    } finally {
      setLoading(false);
    }
  }, [query, hymnId]);

  useEffect(() => {
    void search();
  }, [search]);

  return { results, loading, error, refetch: search };
}
