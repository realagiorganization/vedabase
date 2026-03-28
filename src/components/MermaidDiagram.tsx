import { useEffect, useId, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  title: string;
}

declare global {
  interface Window {
    __vedabaseMermaidLoaded?: boolean;
    mermaid?: {
      initialize: (config: {
        startOnLoad: boolean;
        theme: string;
        securityLevel: string;
      }) => void;
      render: (id: string, chart: string) => Promise<{ svg: string }>;
    };
  }
}

const MERMAID_SCRIPT_ID = 'vedabase-mermaid-script';
const MERMAID_SCRIPT_SRC =
  'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';

async function ensureMermaidLoaded() {
  if (window.mermaid) {
    return window.mermaid;
  }

  const existingScript = document.getElementById(MERMAID_SCRIPT_ID);

  if (existingScript) {
    await new Promise<void>((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Unable to load Mermaid')),
        { once: true },
      );
    });
  } else {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.id = MERMAID_SCRIPT_ID;
      script.src = MERMAID_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Unable to load Mermaid'));
      document.head.appendChild(script);
    });
  }

  if (!window.mermaid) {
    throw new Error('Mermaid did not initialize');
  }

  return window.mermaid;
}

export function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const elementId = useId().replace(/:/g, '-');
  const [renderMode, setRenderMode] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = await ensureMermaidLoaded();

        if (!window.__vedabaseMermaidLoaded) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'neutral',
            securityLevel: 'loose',
          });
          window.__vedabaseMermaidLoaded = true;
        }

        if (cancelled) {
          return;
        }

        const { svg } = await mermaid.render(`mermaid-${elementId}`, chart);

        if (cancelled) {
          return;
        }

        const container = document.getElementById(elementId);
        if (container) {
          container.innerHTML = svg;
          setRenderMode('ready');
        }
      } catch {
        if (!cancelled) {
          setRenderMode('fallback');
        }
      }
    }

    void renderChart();

    return () => {
      cancelled = true;
    };
  }, [chart, elementId]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Mermaid
        </span>
      </div>

      <div
        id={elementId}
        className="overflow-x-auto rounded-xl bg-slate-50 p-4 text-sm text-slate-700"
        aria-label={`${title} mermaid diagram`}
      />

      {renderMode !== 'ready' ? (
        <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {renderMode === 'loading' ? 'Rendering fallback available' : 'Fallback source'}
          </p>
          <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-slate-700">
            <code>{chart}</code>
          </pre>
        </div>
      ) : null}
    </div>
  );
}
