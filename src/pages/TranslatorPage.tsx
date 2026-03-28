import { useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { TranslationPanel } from '../components/TranslationPanel';
import { getPronunciation, getUnderword, translateVerse } from '../lib/api/translator';
import type { Translation, Underword } from '../lib/api/types';

interface TranslatorPageProps {
  sourceLanguage?: string;
  targetLanguage?: string;
}

export function TranslatorPage({
  sourceLanguage = 'Sanskrit',
  targetLanguage = 'English',
}: TranslatorPageProps) {
  const sampleVerse = 'om bhur bhuvah svah tat savitur varenyam';
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [underwords, setUnderwords] = useState<Underword[]>([]);
  const [pronunciation, setPronunciation] = useState<string>('Loading pronunciation...');
  const [error, setError] = useState<string | null>(null);
  const confidenceLabel = translation?.confidence
    ? `${Math.round(translation.confidence * 100)}% confidence`
    : 'Mock confidence pending';

  useEffect(() => {
    let active = true;

    Promise.all([
      translateVerse(sampleVerse, targetLanguage),
      getUnderword(sampleVerse),
      getPronunciation(sampleVerse),
    ])
      .then(([translationResult, underwordResult, pronunciationResult]) => {
        if (!active) {
          return;
        }

        setTranslation(translationResult);
        setUnderwords(underwordResult);
        setPronunciation(pronunciationResult.ipa ?? pronunciationResult.text);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load translation tools');
        }
      });

    return () => {
      active = false;
    };
  }, [targetLanguage]);

  return (
    <div className="min-h-screen bg-slate-50" aria-label="Translator page">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Translation interface controls">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Translator Interface</h1>
          <p className="mb-4 text-sm text-slate-600">Typed mock translation, underword, and pronunciation flow.</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700" aria-label="Source language">
              Source: {sourceLanguage}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700" aria-label="Target language">
              Target: {targetLanguage}
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Pronunciation: {pronunciation}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Confidence: {confidenceLabel}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Underwords: {underwords.length}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              Pronunciation tokens: {sampleVerse.split(/\s+/).length}
            </div>
          </div>
          {error ? (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
          ) : null}
        </section>

        <section aria-label="Translation output section">
          <TranslationPanel
            verseLabel="Input Verse"
            sanskritText={sampleVerse}
            translationText={translation?.translatedText ?? 'Loading translation...'}
            underwords={underwords.map((item) => ({
              sanskrit: item.term,
              gloss: item.meaning,
            }))}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
