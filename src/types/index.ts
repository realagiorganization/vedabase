export interface Hymn {
  id: string;
  title: string;
  sanskritTitle: string;
  chapter: string;
  verses: Verse[];
  deity: string;
  meter: string;
  audioUrl?: string;
  youtubeId?: string;
}

export interface Verse {
  id: string;
  number: number;
  text: string;
  translation: string;
  underwords: Underword[];
}

export interface Underword {
  word: string;
  meaning: string;
  position: { start: number; end: number };
}

export interface Translation {
  verseId: string;
  targetLanguage: string;
  text: string;
  accuracy: number;
}

export interface MurtiImage {
  id: string;
  deity: string;
  imageUrl: string;
  style: string;
  prompt: string;
  createdAt: string;
}

export interface Deity {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  associatedHymns: string[];
  iconUrl?: string;
}

export interface StreamInfo {
  hymnId: string;
  youtubeId: string;
  startTime?: number;
  duration?: number;
}

export interface Recording {
  id: string;
  sessionId: string;
  hymnId: string;
  audioBlob?: Blob;
  duration: number;
  createdAt: string;
}

export interface Metadata {
  views: number;
  recitations: number;
  lastUpdated?: string;
}
