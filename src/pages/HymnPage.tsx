import { useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { KaraokeViewer } from '../components/KaraokeViewer';
import { MurtiViewer } from '../components/MurtiViewer';
import { TranslationPanel } from '../components/TranslationPanel';
import { YouTubeRecorder } from '../components/YouTubeRecorder';
import { getHymnById } from '../lib/api/vedabase';
import type { Hymn } from '../lib/api/types';

interface HymnPageProps {
  hymnId?: string;
}

export function HymnPage({ hymnId = 'gayatri-mantra' }: HymnPageProps) {
  const [hymn, setHymn] = useState<Hymn | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getHymnById(hymnId)
      .then((result) => {
        if (active) {
          setHymn(result);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load hymn');
        }
      });

    return () => {
      active = false;
    };
  }, [hymnId]);

  const displayTitle = hymn?.title ?? 'Loading hymn...';
  const displayVerse = hymn?.transliteration ?? hymn?.sanskrit ?? 'Loading transliteration...';
  const translation = hymn?.translation ?? 'Waiting for hymn translation.';
  const activeWordIndex = 2;
  const karaokeWords = displayVerse.split(/\s+/).filter(Boolean).map((word, index) => ({
    id: `${word}-${index}`,
    text: word,
    isActive: index === activeWordIndex,
  }));

  return (
    <div className="min-h-screen bg-slate-50" aria-label="Hymn page">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Hymn details">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">{displayTitle}</h1>
          <p className="text-sm text-slate-600">
            {hymn?.metadata?.title ?? 'Typed hymn data is loading from the deterministic mock contract.'}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Source</p>
              <p className="mt-2 text-sm text-slate-900">{hymn?.metadata?.source ?? 'Mock Vedabase corpus'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tag focus</p>
              <p className="mt-2 text-sm text-slate-900">{hymn?.metadata?.tags?.join(', ') ?? 'featured, karaoke'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Verse tokens</p>
              <p className="mt-2 text-sm text-slate-900">{karaokeWords.length}</p>
            </div>
          </div>
          {error ? (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}
        </section>

        <section className="mb-6">
          <YouTubeRecorder hymnId={hymnId} title={`${displayTitle} Reciter`} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2" aria-label="Karaoke and translation content">
          <KaraokeViewer
            title="Karaoke Recitation"
            audioLabel={`${displayTitle} playback progress`}
            words={karaokeWords}
          />
          <TranslationPanel
            verseLabel={hymn?.metadata?.title ?? 'Verse 1'}
            sanskritText={displayVerse}
            translationText={translation}
            underwords={karaokeWords.slice(0, 4).map((word) => ({
              sanskrit: word.text,
              gloss: `mock gloss for ${word.text}`,
            }))}
          />
        </section>

        <section className="mt-6" aria-label="Murti companion viewer">
          <MurtiViewer deityName={hymn?.metadata?.tags?.[2] ?? 'Savitar'} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
