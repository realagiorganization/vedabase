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
  metadata?: Metadata;
}

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

export interface Recording {
  sessionId: string;
  status: "idle" | "recording" | "stopped" | "failed";
  recordingUrl?: string;
  startedAt?: string;
  stoppedAt?: string;
}
