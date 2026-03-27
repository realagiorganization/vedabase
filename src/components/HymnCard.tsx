export interface HymnCardData {
  id: string;
  title: string;
  verseCount: number;
  deity: string;
}

interface HymnCardProps {
  hymn?: HymnCardData;
  onSelect?: (id: string) => void;
}

const PLACEHOLDER_HYMN: HymnCardData = {
  id: 'hymn-001',
  title: 'Gayatri Mantra',
  verseCount: 24,
  deity: 'Savitar',
};

export function HymnCard({ hymn = PLACEHOLDER_HYMN, onSelect }: HymnCardProps) {
  return (
    <article
      onClick={() => onSelect?.(hymn.id)}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => event.key === 'Enter' && onSelect?.(hymn.id)}
      aria-label={`Open hymn ${hymn.title}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {hymn.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">Scaffold hymn card</p>
        </div>
        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
          {hymn.deity}
        </span>
      </div>
      <div className="mb-4 flex items-center gap-3 text-sm text-slate-600">
        <span aria-label="Verse count">{hymn.verseCount} verses</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span aria-label="Deity association">{hymn.deity} association</span>
      </div>

      <div className="animate-pulse" aria-label="Hymn card placeholder lines">
        <div className="mb-2 h-2 w-full rounded bg-slate-200" />
        <div className="h-2 w-2/3 rounded bg-slate-200" />
      </div>
    </article>
  );
}
