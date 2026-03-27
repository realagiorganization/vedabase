import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { HymnCard } from '../components/HymnCard';
import type { Hymn } from '../types';

const FEATURED_HYMNS: Hymn[] = [
  {
    id: '1',
    title: 'Gayatri Mantra',
    sanskritTitle: 'गायत्री मंत्र',
    chapter: 'Rigveda 3.62.10',
    verses: [],
    deity: 'Savitar',
    meter: 'Gayatri',
  },
  {
    id: '2',
    title: 'Mahamrityunjaya Mantra',
    sanskritTitle: 'महामृत्युञ्जय मंत्र',
    chapter: 'Rigveda 7.59.12',
    verses: [],
    deity: 'Shiva',
    meter: 'Anushtubh',
  },
  {
    id: '3',
    title: 'Shiva Tandava Stotram',
    sanskritTitle: 'शिव तांडव स्तोत्रम्',
    chapter: 'Unknown',
    verses: [],
    deity: 'Shiva',
    meter: 'Shardula Vikridita',
  },
];

export function HomePage() {
  const [searchResults, setSearchResults] = useState<Hymn[] | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="text-center mb-16">
        <h1 className="font-serif text-5xl font-bold text-slate-900 mb-4">
          🕉️ Vedabase
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          YouTube reciter, karaoke viewer for Vedic hymns with underword translator 
          and generative murti viewer
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Featured Hymns</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_HYMNS.map((hymn) => (
            <HymnCard key={hymn.id} hymn={hymn} onClick={() => console.log('Navigate to hymn', hymn.id)} />
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="card text-center">
          <div className="text-4xl mb-4">🎤</div>
          <h3 className="font-semibold text-lg mb-2">YouTube Reciter</h3>
          <p className="text-slate-600 text-sm">
            Record and compare your recitation with authentic Vedic recitations
          </p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🎵</div>
          <h3 className="font-semibold text-lg mb-2">Karaoke Viewer</h3>
          <p className="text-slate-600 text-sm">
            Follow along with highlighted text synced to audio playback
          </p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🖼️</div>
          <h3 className="font-semibold text-lg mb-2">Generative Murti</h3>
          <p className="text-slate-600 text-sm">
            Generate artistic depictions of Vedic deities with AI
          </p>
        </div>
      </section>
    </div>
  );
}
