export interface KaraokeWord {
  id: string;
  text: string;
  isActive?: boolean;
}

interface KaraokeViewerProps {
  title?: string;
  audioLabel?: string;
  words?: KaraokeWord[];
}

const PLACEHOLDER_WORDS: KaraokeWord[] = [
  { id: 'w1', text: 'Om' },
  { id: 'w2', text: 'bhur' },
  { id: 'w3', text: 'bhuvah', isActive: true },
  { id: 'w4', text: 'svaha' },
  { id: 'w5', text: 'tat' },
  { id: 'w6', text: 'savitur' },
  { id: 'w7', text: 'varenyam' },
];

export function KaraokeViewer({
  title = 'Karaoke Recitation',
  audioLabel = 'Hymn playback progress',
  words = PLACEHOLDER_WORDS,
}: KaraokeViewerProps) {
  return (
    <section
      className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm"
      aria-label="Karaoke hymn viewer"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <button
          type="button"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white"
          aria-label="Toggle karaoke audio playback"
        >
          Play
        </button>
      </div>

      <div className="mb-5" aria-label={audioLabel}>
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div className="h-2 w-1/3 rounded-full bg-amber-500" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Word by word highlighted hymn text">
        {words.map((word) => (
          <span
            key={word.id}
            className={
              word.isActive
                ? 'rounded-md bg-amber-100 px-3 py-2 text-sm font-medium text-amber-900'
                : 'rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600'
            }
          >
            {word.text}
          </span>
        ))}
      </div>

      <div className="mt-5 animate-pulse" aria-label="Karaoke loading placeholder">
        <div className="mb-2 h-3 w-5/6 rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-200" />
      </div>
    </section>
  );
}
