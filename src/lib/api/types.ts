export interface Metadata {
  id: string;
  chapterId?: string;
  title: string;
  source?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Hymn {
  id: string;
  chapterId: string;
  title: string;
  sanskrit: string;
  transliteration?: string;
  translation?: string;
  deity?: string;
  verseCount?: number;
  tags?: string[];
  sourceUrl?: string;
  metadata?: Metadata;
}

export type RemoteDatasetName = 'vedabase-dump' | 'youtube-search';

export interface Underword {
  term: string;
  root?: string;
  meaning: string;
  grammar?: string;
}

export interface Translation {
  original: string;
  targetLang: string;
  translatedText: string;
  confidence?: number;
}

export interface Pronunciation {
  text: string;
  ipa?: string;
  audioUrl?: string;
  syllables?: string[];
}

export interface Style {
  id: string;
  name: string;
  description?: string;
  previewUrl?: string;
}

export interface MurtiImage {
  id: string;
  deity: string;
  context: string;
  style?: Style;
  imageUrl: string;
  prompt?: string;
  createdAt?: string;
}

export interface DeityInfo {
  name: string;
  aliases?: string[];
  symbolism?: string[];
  iconography?: string[];
  description?: string;
}

export interface StreamInfo {
  hymnId: string;
  streamUrl: string;
  platform?: string;
  isLive?: boolean;
  startedAt?: string;
}

export interface YouTubeSearchResult {
  query: string;
  hymnId?: string;
  videoId: string;
  title: string;
  channelTitle: string;
  description?: string;
  publishedAt?: string;
  thumbnailUrl?: string;
  url: string;
}

export type RemoteDatasetStatus =
  | 'idle'
  | 'fresh'
  | 'stale'
  | 'incomplete'
  | 'failed';

export interface RemoteDatasetMeta {
  dataset: RemoteDatasetName | string;
  sourceUrl?: string;
  fetchedAt?: string;
  checksumSha256?: string;
  bytes?: number;
  itemCount: number;
  complete: boolean;
  status: RemoteDatasetStatus;
  notes?: readonly string[];
}

export interface RemoteSyncReport {
  generatedAt: string;
  datasets: Array<{
    dataset: RemoteDatasetName | string;
    status: RemoteDatasetStatus;
    complete: boolean;
    itemCount: number;
  }>;
}

export interface RemoteSyncStatus {
  vedabase: RemoteDatasetMeta;
  youtube: RemoteDatasetMeta;
  report: RemoteSyncReport;
}

export interface HymnSearchResponse {
  query: string;
  total: number;
  items: Hymn[];
  source: 'local-cache' | 'remote-api';
  status: RemoteDatasetStatus;
}

export interface RemoteFetchRequest {
  dataset: RemoteDatasetName;
  force?: boolean;
  sourceUrl?: string;
}

export interface RemoteFetchResponse {
  dataset: RemoteDatasetName;
  status: RemoteDatasetStatus;
  complete: boolean;
  itemCount: number;
  fetchedAt?: string;
  sourceUrl?: string;
  notes?: readonly string[];
}

export interface RemoteDiagnosticsRequest {
  dataset: RemoteDatasetName;
}

export interface RemoteCompletenessCheck {
  id: string;
  passed: boolean;
  message: string;
}

export interface RemoteCompletenessDiagnostics {
  dataset: RemoteDatasetName;
  status: RemoteDatasetStatus;
  complete: boolean;
  itemCount: number;
  fetchedAt?: string;
  sourceUrl?: string;
  checks: RemoteCompletenessCheck[];
  notes?: readonly string[];
}

export interface Recording {
  sessionId: string;
  status: "idle" | "recording" | "stopped" | "failed";
  recordingUrl?: string;
  startedAt?: string;
  stoppedAt?: string;
}
