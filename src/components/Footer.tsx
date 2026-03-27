export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕉️</span>
            <span className="font-serif text-lg text-white">Vedabase</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/about" className="hover:text-white transition-colors">About</a>
            <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
            <a href="/contribute" className="hover:text-white transition-colors">Contribute</a>
            <a href="https://github.com/realagiorganization/vedabase" className="hover:text-white transition-colors">GitHub</a>
          </nav>
          <p className="text-sm text-slate-500">
            Preserving Vedic wisdom through technology
          </p>
        </div>
      </div>
    </footer>
  );
}
