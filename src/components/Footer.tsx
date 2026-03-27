interface FooterProps {
  links?: Array<{ label: string; href: string }>;
}

const DEFAULT_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Docs', href: '/docs' },
  { label: 'Contribute', href: '/contribute' },
  { label: 'GitHub', href: 'https://github.com/realagiorganization/vedabase' },
];

export function Footer({ links = DEFAULT_LINKS }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 py-8 text-slate-300" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2" aria-label="Brand identity">
            <span className="text-xl">🕉️</span>
            <span className="text-lg font-semibold text-white">Vedabase</span>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm" aria-label="Footer links">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="transition hover:text-white" aria-label={`Open ${link.label}`}>
                {link.label}
              </a>
            ))}
          </nav>

          <p className="text-sm text-slate-500" aria-label="Footer description">
            Preserving Vedic wisdom through technology
          </p>
        </div>
      </div>
    </footer>
  );
}
