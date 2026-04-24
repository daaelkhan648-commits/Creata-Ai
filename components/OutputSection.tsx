// components/OutputSection.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, TrendingUp } from 'lucide-react';
import { GeneratedContent, Platform, Niche } from '../lib/types';
import toast from 'react-hot-toast';

interface Props {
  content: GeneratedContent;
  platform: Platform;
  niche: Niche;
}

const CARDS = [
  {
    key: 'hook' as const,
    emoji: '🎣',
    label: 'Hook',
    desc: 'Opening line to stop the scroll',
    accent: '#00d4ff',
  },
  {
    key: 'script' as const,
    emoji: '📝',
    label: 'Script',
    desc: 'Full video script with cues',
    accent: '#a855f7',
  },
  {
    key: 'caption' as const,
    emoji: '✍️',
    label: 'Caption',
    desc: 'Post caption with emojis',
    accent: '#ff3cac',
  },
  {
    key: 'hashtags' as const,
    emoji: '#️⃣',
    label: 'Hashtags',
    desc: '20-25 trending hashtags',
    accent: '#00ff87',
  },
];

export default function OutputSection({ content, platform, niche }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Copied to clipboard!');
  };

  const handleCopyAll = () => {
    const all = `🎣 HOOK\n${content.hook}\n\n📝 SCRIPT\n${content.script}\n\n✍️ CAPTION\n${content.caption}\n\n#️⃣ HASHTAGS\n${content.hashtags}`;
    navigator.clipboard.writeText(all);
    toast.success('All content copied!');
  };

  const handleDownload = () => {
    const text = `CREATA AI — GENERATED CONTENT\n${'─'.repeat(40)}\nPlatform: ${platform}\nNiche: ${niche}\n${content.trendingTopic ? `Trending Topic: ${content.trendingTopic}\n` : ''}\n🎣 HOOK\n${content.hook}\n\n📝 SCRIPT\n${content.script}\n\n✍️ CAPTION\n${content.caption}\n\n#️⃣ HASHTAGS\n${content.hashtags}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creata-ai-${niche}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  return (
    <div className="space-y-4">
      {/* Trending topic badge */}
      {content.trendingTopic && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2.5 glass rounded-2xl border border-border text-sm"
        >
          <TrendingUp size={14} className="text-accent-cyan flex-shrink-0" />
          <span className="text-text-muted">Inspired by:</span>
          <span className="text-text-primary font-medium truncate">{content.trendingTopic}</span>
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        <button
          onClick={handleCopyAll}
          className="flex-1 glass rounded-2xl py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary border border-border hover:border-border-bright transition-all flex items-center justify-center gap-2"
        >
          <Copy size={14} />
          Copy All
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 glass rounded-2xl py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary border border-border hover:border-border-bright transition-all flex items-center justify-center gap-2"
        >
          <Download size={14} />
          Download
        </button>
      </motion.div>

      {/* Content cards */}
      {CARDS.map((card, i) => {
        const value = content[card.key];
        if (!value) return null;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="output-card glass rounded-3xl border border-border overflow-hidden group"
            style={{ borderColor: `${card.accent}10` }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: `${card.accent}15`, border: `1px solid ${card.accent}25` }}
                >
                  {card.emoji}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{card.label}</div>
                  <div className="text-xs text-text-muted">{card.desc}</div>
                </div>
              </div>
              <button
                onClick={() => handleCopy(value, card.key)}
                className="w-8 h-8 rounded-xl glass border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-all opacity-0 group-hover:opacity-100"
              >
                {copied === card.key
                  ? <Check size={13} className="text-accent-green" />
                  : <Copy size={13} />
                }
              </button>
            </div>

            {/* Card body */}
            <div className="px-5 py-4">
              {card.key === 'hashtags' ? (
                <div className="flex flex-wrap gap-1.5">
                  {value.split(/\s+/).filter(Boolean).map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium"
                      style={{
                        background: `${card.accent}12`,
                        color: card.accent,
                        border: `1px solid ${card.accent}20`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{value}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
