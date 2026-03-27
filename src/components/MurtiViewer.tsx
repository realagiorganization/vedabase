import { useState } from 'react';

export interface MurtiStyleOption {
  id: string;
  name: string;
}

interface MurtiViewerProps {
  deityName?: string;
  styles?: MurtiStyleOption[];
}

const PLACEHOLDER_STYLES: MurtiStyleOption[] = [
  { id: 'temple', name: 'Temple Fresco' },
  { id: 'bronze', name: 'Bronze Iconic' },
  { id: 'minimal', name: 'Minimal Line Art' },
];

export function MurtiViewer({ deityName = 'Shiva', styles = PLACEHOLDER_STYLES }: MurtiViewerProps) {
  const [selectedStyle, setSelectedStyle] = useState(styles[0]?.id ?? 'temple');

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="Murti image viewer"
    >
      <h2 className="mb-4 text-xl font-semibold text-slate-900">Murti Viewer: {deityName}</h2>

      <div className="relative mb-5 aspect-square overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50 to-slate-100">
        <div className="absolute inset-0 flex items-center justify-center" aria-label="Generated deity image placeholder">
          <div className="text-center text-slate-500">
            <div className="mx-auto mb-3 h-20 w-20 rounded-full border-2 border-dashed border-amber-400" />
            <p className="text-sm">Generated deity image appears here</p>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-medium text-slate-700">Style options</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              type="button"
              className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                selectedStyle === style.id
                  ? 'border-amber-500 bg-amber-50 text-amber-800'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
              aria-label={`Select ${style.name} style`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white"
        aria-label="Generate murti image"
      >
        Generate Murti (Scaffold)
      </button>
    </section>
  );
}
