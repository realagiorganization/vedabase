import { useEffect, useState } from 'react';
import { getYouTubeStream, startRecording, stopRecording } from '../lib/api/youtube';

interface YouTubeRecorderProps {
  hymnId?: string;
  initialVideoUrl?: string;
  title?: string;
}

export function YouTubeRecorder({
  hymnId = 'gayatri-mantra',
  initialVideoUrl = 'https://youtube.com/watch?v=placeholder',
  title = 'YouTube Reciter',
}: YouTubeRecorderProps) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'playback'>('idle');
  const [streamLabel, setStreamLabel] = useState('Loading stream metadata...');
  const [recordingSummary, setRecordingSummary] = useState('Ready to capture a guided chanting session.');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getYouTubeStream(hymnId)
      .then((stream) => {
        if (!active) {
          return;
        }

        setVideoUrl(stream.streamUrl);
        setStreamLabel(
          `${stream.platform ?? 'YouTube'} ${stream.isLive ? 'live session' : 'guided recitation'}`,
        );
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load stream metadata');
        }
      });

    return () => {
      active = false;
    };
  }, [hymnId]);

  async function handleStart() {
    const recording = await startRecording(`${hymnId}-session`);
    setRecordingState('recording');
    setRecordingSummary(`Recording started at ${recording.startedAt ?? 'unknown time'}.`);
  }

  async function handleStop() {
    const recording = await stopRecording(`${hymnId}-session`);
    setRecordingState('playback');
    setRecordingSummary(
      recording.recordingUrl
        ? `Recording ready: ${recording.recordingUrl}`
        : 'Recording stopped and is ready for playback.',
    );
  }

  function handlePlayback() {
    setRecordingState('playback');
    setRecordingSummary('Playback mode enabled for recitation review.');
  }

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      aria-label="YouTube reciter recorder"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
          {streamLabel}
        </span>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="youtube-url-input">
          YouTube URL
        </label>
        <input
          id="youtube-url-input"
          type="url"
          value={videoUrl}
          onChange={(event: { target: { value: string } }) => setVideoUrl(event.target.value)}
          placeholder="Paste a recitation video URL"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
          aria-label="YouTube video URL"
        />
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-5" aria-label="Recorder visualization placeholder">
        <div className="flex items-center justify-center">
          <div
            className={`h-20 w-20 rounded-full border-4 ${
              recordingState === 'recording'
                ? 'border-red-500 bg-red-50'
                : recordingState === 'playback'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 bg-white'
            }`}
          />
        </div>
        <p className="mt-3 text-center text-sm text-slate-600">State: {recordingState}</p>
        <p className="mt-2 text-center text-xs text-slate-500">{recordingSummary}</p>
        {error ? <p className="mt-2 text-center text-xs text-rose-700">{error}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" aria-label="Recorder actions">
        <button
          type="button"
          onClick={() => {
            void handleStart();
          }}
          disabled={recordingState === 'recording'}
          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white"
          aria-label="Start recitation recording"
        >
          Start
        </button>
        <button
          type="button"
          onClick={() => {
            void handleStop();
          }}
          disabled={recordingState !== 'recording'}
          className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white"
          aria-label="Stop recitation recording"
        >
          Stop
        </button>
        <button
          type="button"
          onClick={handlePlayback}
          disabled={recordingState === 'idle'}
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
