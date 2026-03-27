import { SearchBar } from './SearchBar';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🕉️</span>
              <span className="font-serif text-xl font-bold text-saffron-600">Vedabase</span>
            </a>
          </div>
          <div className="flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/hymns" className="text-slate-600 hover:text-saffron-600 transition-colors">Hymns</a>
            <a href="/translator" className="text-slate-600 hover:text-saffron-600 transition-colors">Translator</a>
            <a href="/murti" className="text-slate-600 hover:text-saffron-600 transition-colors">Murti Gallery</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
