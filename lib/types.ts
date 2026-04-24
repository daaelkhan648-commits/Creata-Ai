// lib/types.ts
export type Platform = 'instagram' | 'youtube';
export type InspirationSource = 'youtube_trending' | 'instagram_style';
export type Niche = 'money' | 'fitness' | 'motivation' | 'tech' | 'lifestyle' | 'food' | 'travel' | 'education' | 'entertainment' | 'fashion';


// ADD THIS 👇
export type Language =
  | 'english'
  | 'hindi_english'   // Hindi tone, English text (Hinglish)
  | 'hinglish'        // Mix of Hindi + English words
  | 'spanish'
  | 'french'
  | 'arabic'
  | 'portuguese'
  | 'indonesian';

export interface TrendingVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: string;
}
export interface GenerateRequest {
  platform: Platform;
  inspiration: InspirationSource;
  niche: Niche;
  youtubeLink?: string;
  language?: Language;
}

export interface GeneratedContent {
  hook: string;
  script: string;
  caption: string;
  hashtags: string;
  trendingTopic?: string;
}

