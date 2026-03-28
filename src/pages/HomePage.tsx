import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { HymnCard } from '../components/HymnCard';
import { SearchBar } from '../components/SearchBar';

interface HomePageProps {
  title?: string;
}

const FEATURED_HYMNS = [
  { id: 'h1', title: 'Gayatri Mantra', verseCount: 24, deity: 'Savitar' },
  { id: 'h2', title: 'Mahamrityunjaya', verseCount: 33, deity: 'Shiva' },
  { id: 'h3', title: 'Durga Suktam', verseCount: 18, deity: 'Durga' },
];

export function HomePage({ title = 'Vedabase' }: HomePageProps) {

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white" aria-label="Home page">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10 rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm">
          <h1 className="mb-3 text-4xl font-bold text-slate-900">{title}</h1>
          <p className="mx-auto mb-6 max-w-2xl text-base text-slate-600">
            Landing page scaffold with featured hymns and quick search.
          </p>
          <div className="mx-auto max-w-xl">
            <SearchBar />
          </div>
        </section>

        <section className="mb-10" aria-label="Featured hymns section">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">Featured Hymns</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_HYMNS.map((hymn) => (
              <HymnCard key={hymn.id} hymn={hymn} />
            ))}
          </div>
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
