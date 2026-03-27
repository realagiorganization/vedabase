import { useState } from 'react';

interface YouTubeRecorderProps {
  initialVideoUrl?: string;
  recordingState?: 'idle' | 'recording' | 'playback';
}

export function YouTubeRecorder({
  initialVideoUrl = 'https://youtube.com/watch?v=placeholder',
  recordingState = 'idle',
}: YouTubeRecorderProps) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="YouTube reciter recorder"
    >
      <h2 className="mb-4 text-xl font-semibold text-slate-900">YouTube Recorder</h2>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="youtube-url-input">
          YouTube URL
        </label>
        <input
          id="youtube-url-input"
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste a recitation video URL"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
          aria-label="YouTube video URL"
        />
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-5" aria-label="Recorder visualization placeholder">
        <div className="flex items-center justify-center">
          <div className="h-20 w-20 rounded-full border-4 border-slate-200 bg-white" />
        </div>
        <p className="mt-3 text-center text-sm text-slate-600">State: {recordingState}</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" aria-label="Recorder actions">
        <button
          type="button"
          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white"
          aria-label="Start recitation recording"
        >
          Start
        </button>
        <button
          type="button"
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white"
          aria-label="Stop recitation recording"
        >
          Stop
        </button>
        <button
          type="button"
          className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white"
          aria-label="Playback recitation"
        >
          Playback
        </button>
      </div>

      <div className="mt-4 animate-pulse" aria-label="Recorder loading placeholder">
        <div className="mb-2 h-2 w-full rounded bg-slate-200" />
        <div className="h-2 w-3/5 rounded bg-slate-200" />
      </div>
    </section>
  );
}
