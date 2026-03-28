import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  appName?: string;
  navItems?: Array<{ label: string; href: string }>;
}

const DEFAULT_NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
  { label: 'Hymns', href: '/hymn' },
  { label: 'Murti', href: '/murti' },
  { label: 'Translator', href: '/translator' },
];

export function Header({ appName = 'Vedabase', navItems = DEFAULT_NAV_ITEMS }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur" aria-label="Main header">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2" aria-label="Go to home page">
              <span className="text-2xl" aria-hidden="true">🕉</span>
              <span className="text-xl font-bold text-amber-700">{appName}</span>
            </Link>
          </div>

          <div className="w-full lg:max-w-md">
            <SearchBar />
          </div>

          <nav className="flex flex-wrap items-center gap-3" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-md px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100"
                aria-label={`Navigate to ${item.label}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
