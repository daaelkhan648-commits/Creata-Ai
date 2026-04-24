// pages/api/trending.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const cache: Record<string, { data: any[]; ts: number }> = {};
const TTL = 30 * 60 * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { niche = 'tech' } = req.query;
  const key = String(niche);

  if (cache[key] && Date.now() - cache[key].ts < TTL) {
    return res.status(200).json({ videos: cache[key].data, cached: true });
  }

  const nicheMap: Record<string, string> = {
    money: 'make money online shorts',
    fitness: 'fitness shorts workout',
    motivation: 'motivation shorts',
    tech: 'tech shorts 2025',
    lifestyle: 'lifestyle shorts',
    food: 'food recipe shorts',
    travel: 'travel shorts',
    education: 'education shorts',
    entertainment: 'entertainment shorts',
    fashion: 'fashion shorts',
  };

  try {
    const res2 = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        q: nicheMap[key] || key,
        part: 'snippet',
        type: 'video',
        order: 'viewCount',
        maxResults: 6,
        videoDuration: 'short',
      },
    });

    const videos = res2.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.medium?.url,
      channelTitle: item.snippet.channelTitle,
    }));

    cache[key] = { data: videos, ts: Date.now() };
    return res.status(200).json({ videos, cached: false });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
