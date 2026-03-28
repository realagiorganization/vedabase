import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { HymnCard } from '../components/HymnCard';
import { SearchBar } from '../components/SearchBar';
import { useHymns, useVedabaseSyncStatus, useYouTubeSearch } from '../hooks/useHymns';
import { getFeaturedHymns } from '../lib/api/vedabase';

interface HomePageProps {
  title?: string;
}

export function HomePage({ title = 'Vedabase' }: HomePageProps) {
  const [query, setQuery] = useState('');
  const featuredHymns = getFeaturedHymns();
  const suggestions = featuredHymns.map((hymn) => hymn.title);
  const { hymns, loading, error } = useHymns(query);
  const {
    status: syncStatus,
    loading: syncLoading,
    error: syncError,
  } = useVedabaseSyncStatus();
  const {
    results: youtubeResults,
    loading: youtubeLoading,
    error: youtubeError,
  } = useYouTubeSearch(query);
  const visibleHymns = query.trim() ? hymns : featuredHymns;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white" aria-label="Home page">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10 rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm">
          <h1 className="mb-3 text-4xl font-bold text-slate-900">{title}</h1>
          <p className="mx-auto mb-6 max-w-2xl text-base text-slate-600">
            Search the synchronized Vedabase corpus, inspect datasource freshness, and jump into cached reciter results.
          </p>
          <div className="mx-auto max-w-xl">
            <SearchBar value={query} onChange={setQuery} suggestions={suggestions} />
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Datasource status">
          <h2 className="mb-3 text-2xl font-semibold text-slate-900">Datasource Status</h2>
          {syncLoading ? (
            <p className="text-sm text-slate-500">Loading datasource status...</p>
          ) : syncError ? (
            <p className="text-sm text-rose-600">{syncError}</p>
          ) : syncStatus ? (
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4">
                <p className="text-sm font-semibold text-amber-900">Vedabase dump</p>
                <p className="mt-2 text-sm text-slate-700">
                  Status: {syncStatus.vedabase.status} / complete: {String(syncStatus.vedabase.complete)}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Hymns indexed: {syncStatus.vedabase.itemCount}
                </p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">YouTube search cache</p>
                <p className="mt-2 text-sm text-slate-700">
                  Status: {syncStatus.youtube.status} / complete: {String(syncStatus.youtube.complete)}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Cached results: {syncStatus.youtube.itemCount}
                </p>
              </article>
            </div>
          ) : null}
        </section>

        <section className="mb-10" aria-label="Featured hymns section">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">
            {query.trim() ? `Search Results for "${query}"` : 'Featured Hymns'}
          </h2>
          {loading ? (
            <p className="mb-4 text-sm text-slate-500">Searching synchronized hymns...</p>
          ) : null}
          {error ? (
            <p className="mb-4 text-sm text-rose-600">{error}</p>
          ) : null}
          {!loading && !error && query.trim() && visibleHymns.length === 0 ? (
            <p className="mb-4 text-sm text-slate-500">No hymns matched the synchronized corpus search.</p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleHymns.map((hymn) => (
              <HymnCard
                key={hymn.id}
                hymn={{
                  id: hymn.id,
                  title: hymn.title,
                  verseCount: hymn.verseCount ?? 1,
                  deity: hymn.deity ?? 'Unknown',
                }}
              />
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Cached YouTube reciter results">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Cached YouTube Reciter Search</h3>
          {!query.trim() ? (
            <p className="text-sm text-slate-500">Enter a hymn query to inspect cached YouTube reciter results.</p>
          ) : youtubeLoading ? (
            <p className="text-sm text-slate-500">Searching cached YouTube results...</p>
          ) : youtubeError ? (
            <p className="text-sm text-rose-600">{youtubeError}</p>
          ) : youtubeResults.length === 0 ? (
            <p className="text-sm text-slate-500">No cached YouTube results matched this hymn query.</p>
          ) : (
            <ul className="space-y-3">
              {youtubeResults.map((result) => (
                <li key={result.videoId} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">{result.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{result.channelTitle}</p>
                  <a
                    href={result.url}
                    className="mt-2 inline-block text-sm font-medium text-amber-800"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open cached reciter result
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Quick actions">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Access</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <Link to="/hymn" className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700" aria-label="Open hymn page">
              Go to Hymn Page
            </Link>
            <Link to="/murti" className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700" aria-label="Open murti page">
              Open Murti Gallery
            </Link>
            <Link to="/translator" className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700" aria-label="Open translator page">
              Launch Translator
            </Link>
            <Link to="/docs" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900" aria-label="Open documentation site">
              Open Functionality Docs
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
