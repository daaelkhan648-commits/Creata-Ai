// pages/history.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ArrowLeft, History as HistoryIcon, Trash2,
  Instagram, Youtube, Search, ChevronDown, ChevronUp, Copy, Check
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { getUserHistory, deleteHistoryItem, HistoryItem } from '../lib/history';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      getUserHistory(user.uid)
        .then(setHistory)
        .catch(() => toast.error('Failed to load history'))
        .finally(() => setFetching(false));
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await deleteHistoryItem(id);
      setHistory((h) => h.filter((item) => item.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Copied!');
  };

  const filtered = history.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.niche.includes(q) ||
      item.platform.includes(q) ||
      item.hook?.toLowerCase().includes(q) ||
      item.trendingTopic?.toLowerCase().includes(q)
    );
  });

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head><title>History — Creata AI</title></Head>
      <div className="min-h-screen bg-bg-primary">
        <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />

        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-border glass-strong px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <Zap size={13} className="text-white" />
              </div>
              <span className="font-bold text-base gradient-text" style={{ fontFamily: 'Space Mono, monospace' }}>Creata AI</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <HistoryIcon size={15} />
            <span>History</span>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-1" style={{ fontFamily: 'Space Mono, monospace' }}>
              Content History <span className="text-accent-purple">✦</span>
            </h1>
            <p className="text-text-muted text-sm">{history.length} generations saved</p>
          </motion.div>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative mb-6">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by niche, platform, hook..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full glass rounded-2xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder-text-muted border border-border input-glow bg-transparent"
            />
          </motion.div>

          {/* List */}
          {fetching ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer rounded-3xl h-24" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-6xl mb-4">📭</div>
              <p className="text-text-secondary text-lg font-medium mb-2">
                {search ? 'No results found' : 'No history yet'}
              </p>
              <p className="text-text-muted text-sm mb-6">
                {search ? 'Try a different search term' : 'Generate your first viral content to see it here'}
              </p>
              {!search && (
                <Link href="/dashboard">
                  <button className="btn-glow px-6 py-3 rounded-2xl text-sm font-semibold text-white">
                    <span>Start Generating</span>
                  </button>
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass rounded-3xl border border-border overflow-hidden"
                  >
                    {/* Header row */}
                    <div className="flex items-center justify-between px-5 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          item.platform === 'instagram'
                            ? 'bg-gradient-to-br from-pink-500 to-purple-500'
                            : 'bg-gradient-to-br from-red-500 to-orange-500'
                        }`}>
                          {item.platform === 'instagram'
                            ? <Instagram size={15} className="text-white" />
                            : <Youtube size={15} className="text-white" />
                          }
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">
                              {item.platform} · {item.niche}
                            </span>
                          </div>
                          <p className="text-sm text-text-primary font-medium truncate max-w-xs sm:max-w-md">
                            {item.trendingTopic || item.hook?.slice(0, 60) || 'Generated content'}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {format(item.createdAt, 'MMM d, yyyy · h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="w-8 h-8 rounded-xl glass border border-border flex items-center justify-center text-text-muted hover:text-red-400 hover:border-red-400/30 transition-all disabled:opacity-50"
                        >
                          {deleting === item.id
                            ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                            : <Trash2 size={13} />
                          }
                        </button>
                        <button
                          onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                          className="w-8 h-8 rounded-xl glass border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-all"
                        >
                          {expanded === item.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expanded === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-border"
                        >
                          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { label: '🎣 Hook', key: 'hook', value: item.hook },
                              { label: '📝 Script', key: 'script', value: item.script },
                              { label: '✍️ Caption', key: 'caption', value: item.caption },
                              { label: '#️⃣ Hashtags', key: 'hashtags', value: item.hashtags },
                            ].map(({ label, key, value }) => (
                              <div key={key} className="bg-bg-secondary rounded-2xl p-4 border border-border relative group">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">{label}</span>
                                  <button
                                    onClick={() => handleCopy(value, `${item.id}-${key}`)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-muted hover:text-text-primary"
                                  >
                                    {copied === `${item.id}-${key}` ? <Check size={11} className="text-accent-green" /> : <Copy size={11} />}
                                  </button>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed line-clamp-4">{value}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
