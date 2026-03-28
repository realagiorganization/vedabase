import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  suggestions?: string[];
}

const PLACEHOLDER_SUGGESTIONS = [
  'Gayatri Mantra',
  'Mahamrityunjaya',
  'Shiva stotram',
  'Durga suktam',
];

export function SearchBar({
  placeholder = 'Search hymns, deities, and verses',
  suggestions = PLACEHOLDER_SUGGESTIONS,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const filteredSuggestions = suggestions.filter((suggestion) =>
    query.trim()
      ? suggestion.toLowerCase().includes(query.trim().toLowerCase())
      : true,
  );

  return (
    <div className="relative" aria-label="Search hymns with autocomplete">
      <input
        type="search"
        value={query}
        onChange={(event: { target: { value: string } }) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700"
        aria-label="Search hymns"
      />
      <svg
        className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-2" aria-label="Autocomplete suggestions">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Suggestions</p>
        <div className="flex flex-wrap gap-2">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuery(suggestion)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
              aria-label={`Use suggestion ${suggestion}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
