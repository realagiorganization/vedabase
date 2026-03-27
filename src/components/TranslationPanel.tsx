export interface UnderwordItem {
  sanskrit: string;
  gloss: string;
}

interface TranslationPanelProps {
  verseLabel?: string;
  sanskritText?: string;
  translationText?: string;
  underwords?: UnderwordItem[];
}

const PLACEHOLDER_UNDERWORDS: UnderwordItem[] = [
  { sanskrit: 'tat', gloss: 'that' },
  { sanskrit: 'savitur', gloss: 'of the sun deity' },
  { sanskrit: 'varenyam', gloss: 'worthy of reverence' },
];

export function TranslationPanel({
  verseLabel = 'Verse 1',
  sanskritText = 'tat savitur varenyam',
  translationText = 'May we meditate upon that divine radiance.',
  underwords = PLACEHOLDER_UNDERWORDS,
}: TranslationPanelProps) {

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="Sanskrit translation panel"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Translation Panel</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600" aria-label="Current verse">
          {verseLabel}
        </span>
      </div>

      <div className="mb-5 rounded-lg bg-amber-50 p-4" aria-label="Sanskrit source verse">
        <p className="text-base text-slate-900">{sanskritText}</p>
      </div>

      <div className="mb-5 rounded-lg border border-slate-200 p-4" aria-label="Verse translation">
        <p className="text-sm leading-relaxed text-slate-700">{translationText}</p>
      </div>

      <div aria-label="Underword translation list">
        <p className="mb-2 text-sm font-medium text-slate-700">Underword</p>
        <div className="space-y-2">
          {underwords.map((item) => (
            <div key={item.sanskrit} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-sm font-medium text-amber-700">{item.sanskrit}</span>
              <span className="text-sm text-slate-600">{item.gloss}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 animate-pulse" aria-label="Translation panel loading placeholder">
        <div className="mb-2 h-2 w-full rounded bg-slate-200" />
        <div className="h-2 w-4/5 rounded bg-slate-200" />
      </div>
    </section>
  );
}
