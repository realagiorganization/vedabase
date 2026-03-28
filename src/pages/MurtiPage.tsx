import { useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { MurtiViewer } from '../components/MurtiViewer';
import { generateMurti, getDeityInfo, getMurtiStyles } from '../lib/api/murti';
import type { DeityInfo, MurtiImage, Style } from '../lib/api/types';

interface MurtiPageProps {
  deityFilter?: string;
}

export function MurtiPage({ deityFilter = 'All Deities' }: MurtiPageProps) {
  const [styles, setStyles] = useState<Style[]>([]);
  const [deities, setDeities] = useState<DeityInfo[]>([]);
  const [featuredImage, setFeaturedImage] = useState<MurtiImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      getMurtiStyles(),
      getDeityInfo('Shiva'),
      getDeityInfo('Durga'),
      generateMurti('Shiva', 'temple dawn meditation'),
    ])
      .then(([styleResult, shiva, durga, imageResult]) => {
        if (!active) {
          return;
        }

        setStyles(styleResult);
        setDeities([shiva, durga]);
        setFeaturedImage(imageResult);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load murti data');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white" aria-label="Murti gallery page">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm" aria-label="Murti generation controls">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Murti Gallery</h1>
          <p className="mb-4 text-sm text-slate-600">Mock deity metadata and typed style presets are loaded below.</p>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" aria-label="Active deity filter">
            Filter: {deityFilter}
          </div>
          {featuredImage ? (
            <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Featured prompt: {featuredImage.prompt}
            </div>
          ) : null}
          {error ? (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}
        </section>

        <section className="grid gap-6 lg:grid-cols-2" aria-label="Murti viewer grid">
          <MurtiViewer deityName="Shiva" styles={styles.map((style) => ({ id: style.id, name: style.name }))} />
          <MurtiViewer deityName="Durga" styles={styles.map((style) => ({ id: style.id, name: style.name }))} />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2" aria-label="Deity metadata cards">
          {deities.map((deity) => (
            <article key={deity.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{deity.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{deity.description ?? 'Mock profile pending.'}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                {(deity.symbolism ?? []).join(' / ') || 'devotional context pending'}
              </p>
            </article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
