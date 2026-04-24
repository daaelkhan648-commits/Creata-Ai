// pages/api/generate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import axios from 'axios';
import { GenerateRequest, GeneratedContent, TrendingVideo } from '../../lib/types';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1"
});

// Simple in-memory cache (use Redis in prod)
const trendingCache: Record<string, { data: TrendingVideo[]; ts: number }> = {};
const CACHE_TTL = 30 * 60 * 1000; // 30 min

async function fetchTrendingYouTube(niche: string): Promise<TrendingVideo[]> {
  const cacheKey = `trending_${niche}`;
  const cached = trendingCache[cacheKey];
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const nicheKeywords: Record<string, string> = {
    money: 'make money online 2025',
    fitness: 'workout fitness transformation',
    motivation: 'motivational success mindset',
    tech: 'AI technology 2025',
    lifestyle: 'lifestyle vlog',
    food: 'viral food recipe',
    travel: 'travel vlog',
    education: 'learn study tips',
    entertainment: 'viral funny trending',
    fashion: 'fashion outfit style',
  };

  try {
    const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        q: nicheKeywords[niche] || niche,
        part: 'snippet',
        type: 'video',
        order: 'viewCount',
        maxResults: 5,
        videoDuration: 'short',
        publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    const videos: TrendingVideo[] = res.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.medium?.url || '',
      channelTitle: item.snippet.channelTitle,
      viewCount: '',
    }));

    trendingCache[cacheKey] = { data: videos, ts: Date.now() };
    return videos;
  } catch {
    // Return mock trending data if API fails
    return [
      { id: '1', title: `Top ${niche} trends 2025`, description: `Viral ${niche} content everyone is talking about`, thumbnail: '', channelTitle: 'TrendChannel', viewCount: '1M' },
    ];
  }
}

async function fetchYouTubeVideoInfo(url: string): Promise<{ title: string; description: string } | null> {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (!match) return null;
  const videoId = match[1];
  try {
    const res = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: { key: process.env.YOUTUBE_API_KEY, id: videoId, part: 'snippet' },
    });
    const item = res.data.items?.[0];
    if (!item) return null;
    return { title: item.snippet.title, description: item.snippet.description };
  } catch {
    return null;
  }
}

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  english: 'Write everything in clean English.',
  hindi_english: 'Write in Hindi TONE but using English words only. Think like a Bollywood-inspired motivational speaker but write in English. Use energy like "Bhai", "yaar", "suno", desi references — but ALL TEXT must be in English script only.',
  hinglish: 'Write in Hinglish — mix Hindi and English words naturally like Indian Gen-Z creators do. Example: "Bhai ye trick try karo, life change ho jayegi". Keep it natural and viral.',
  spanish: 'Write everything in Spanish. Use Latin American Gen-Z slang and viral tone.',
  french: 'Write everything in French. Use a trendy, engaging tone.',
  arabic: 'Write everything in Arabic. Use an engaging, viral tone suitable for Arab audiences.',
  portuguese: 'Write everything in Brazilian Portuguese. Use Gen-Z viral tone.',
  indonesian: 'Write everything in Indonesian (Bahasa Indonesia). Use Gen-Z viral tone.',
};

function buildPrompt(
  req: GenerateRequest,
  trendingTitle: string,
  trendingDesc: string
): string {
  const platformInstructions =
    req.platform === 'instagram'
      ? 'emotional, hook-heavy, personal, relatable'
      : 'informative, SEO-optimized, value-driven';

  const inspirationNote =
    req.inspiration === 'youtube_trending'
      ? 'Inspired by YouTube trending style'
      : 'Inspired by Instagram Reels style';

  // Language instruction
  const langKey = req.language || 'english';
  const languageInstruction = LANGUAGE_INSTRUCTIONS[langKey] || LANGUAGE_INSTRUCTIONS['english'];

  return `You are a viral content strategist. Generate content for a ${req.platform === 'instagram' ? 'Instagram Reel' : 'YouTube Short'}.

TOPIC: "${trendingTitle}"
CONTEXT: "${trendingDesc.slice(0, 200)}"
NICHE: ${req.niche}
STYLE: ${platformInstructions}
INSPIRATION: ${inspirationNote}
TONE: Gen-Z, viral, engaging, punchy

🌐 LANGUAGE INSTRUCTION (VERY IMPORTANT):
${languageInstruction}

Generate the following in JSON format ONLY (no markdown):
{
  "hook": "A powerful 1-2 sentence opening hook (max 20 words).",
  "script": "A complete short-form video script (150-250 words). Include [VISUAL] cues. End with a strong CTA.",
  "caption": "A compelling social media caption (50-80 words) with emojis.",
  "hashtags": "20-25 relevant hashtags separated by spaces starting with #"
}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { platform, inspiration, niche, youtubeLink, language } = req.body as GenerateRequest;
  if (!platform || !inspiration || !niche) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let trendingTitle = `Viral ${niche} content`;
    let trendingDesc = `Top trending ${niche} ideas`;
    let trendingTopic = trendingTitle;

    if (youtubeLink) {
      const info = await fetchYouTubeVideoInfo(youtubeLink);
      if (info) {
        trendingTitle = info.title;
        trendingDesc = info.description;
        trendingTopic = info.title;
      }
    } else {
      const videos = await fetchTrendingYouTube(niche);
      if (videos.length > 0) {
        const pick = videos[Math.floor(Math.random() * videos.length)];
        trendingTitle = pick.title;
        trendingDesc = pick.description;
        trendingTopic = pick.title;
      }
    }


    // And update buildPrompt call:
    const prompt = buildPrompt({ platform, inspiration, niche, language }, trendingTitle, trendingDesc);

    const completion = await openai.chat.completions.create({
      model: 'deepseek-ai/deepseek-v3.2',
      messages: [{ role: 'user', content: prompt }],
      temperature: 1,
      top_p: 0.95,
      max_tokens: 1024,
    });

    const rawText = completion.choices[0]?.message?.content || '{}';
    let parsed: GeneratedContent;

    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Fallback parse attempt
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { hook: '', script: '', caption: '', hashtags: '' };
    }

    return res.status(200).json({ ...parsed, trendingTopic });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Generation failed' });
  }
}
