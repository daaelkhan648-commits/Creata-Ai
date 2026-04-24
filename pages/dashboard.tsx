// pages/dashboard.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, LogOut, History, User as UserIcon, ChevronDown,
  Sparkles, Youtube, Instagram, TrendingUp, BookOpen,
  Dumbbell, DollarSign, Cpu, Heart, Plane, UtensilsCrossed,
  GraduationCap, Shirt, Smile, Link as LinkIcon, X,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { saveToHistory } from '../lib/history';
import { GeneratedContent, Platform, InspirationSource, Niche, Language } from '../lib/types';
import OutputSection from '../components/OutputSection';
import ShimmerLoader from '../components/ShimmerLoader';
import toast from 'react-hot-toast';
import Link from 'next/link';

const LANGUAGES = [
  { id: 'english', label: 'English', flag: '🇺🇸', desc: 'Standard English' },
  { id: 'hindi_english', label: 'Hindi Tone (English text)', flag: '🇮🇳', desc: 'Desi energy, English words' },
  { id: 'hinglish', label: 'Hinglish', flag: '🇮🇳', desc: 'Mix of Hindi + English' },
  { id: 'spanish', label: 'Spanish', flag: '🇪🇸', desc: 'Español' },
  { id: 'french', label: 'French', flag: '🇫🇷', desc: 'Français' },
  { id: 'arabic', label: 'Arabic', flag: '🇸🇦', desc: 'العربية' },
  { id: 'portuguese', label: 'Portuguese', flag: '🇧🇷', desc: 'Português' },
  { id: 'indonesian', label: 'Indonesian', flag: '🇮🇩', desc: 'Bahasa Indonesia' },
];

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram Reels', icon: Instagram, color: 'from-pink-500 to-purple-500' },
  { id: 'youtube', label: 'YouTube Shorts', icon: Youtube, color: 'from-red-500 to-orange-500' },
];

const INSPIRATION_SOURCES = [
  { id: 'youtube_trending', label: 'YouTube Trending', icon: TrendingUp, desc: 'Pull from top trending YouTube videos' },
  { id: 'instagram_style', label: 'Instagram Style', icon: Sparkles, desc: 'Optimized for IG Reels engagement' },
];

const NICHES = [
  { id: 'money', label: 'Money', icon: DollarSign, color: '#00ff87' },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: '#ff6b35' },
  { id: 'motivation', label: 'Motivation', icon: Heart, color: '#ff3cac' },
  { id: 'tech', label: 'Tech', icon: Cpu, color: '#00d4ff' },
  { id: 'lifestyle', label: 'Lifestyle', icon: Smile, color: '#a855f7' },
  { id: 'food', label: 'Food', icon: UtensilsCrossed, color: '#ffd700' },
  { id: 'travel', label: 'Travel', icon: Plane, color: '#00e5ff' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: '#7fff00' },
  { id: 'entertainment', label: 'Entertainment', icon: Smile, color: '#ff6b9d' },
  { id: 'fashion', label: 'Fashion', icon: Shirt, color: '#c084fc' },
];

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('english');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [inspiration, setInspiration] = useState<InspirationSource>('youtube_trending');
  const [niche, setNiche] = useState<Niche>('money');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth');
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleGenerate = async () => {
    setGenerating(true);
    setResult(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, inspiration, niche, youtubeLink: youtubeLink || undefined, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data);
      // Save to Firestore history
      if (user) {
        await saveToHistory(user.uid, {
          platform,
          niche,
          inspiration,
          youtubeLink: youtubeLink || undefined,
          hook: data.hook,
          script: data.script,
          caption: data.caption,
          hashtags: data.hashtags,
          trendingTopic: data.trendingTopic,
        }).catch(() => { }); // silent fail
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Head><title>Dashboard — Creata AI</title></Head>
      <div className="min-h-screen bg-bg-primary">
        {/* Background */}
        <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="orb orb-cyan w-80 h-80 -top-40 right-1/4 opacity-5 fixed pointer-events-none" />

        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-border glass-strong px-5 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-base gradient-text" style={{ fontFamily: 'Space Mono, monospace' }}>Creata AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/history">
              <button className="glass px-3.5 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary border border-border transition-all flex items-center gap-2">
                <History size={15} />
                <span className="hidden sm:block">History</span>
              </button>
            </Link>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="glass px-3.5 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary border border-border transition-all flex items-center gap-2"
              >
                <UserIcon size={15} />
                <span className="hidden sm:block max-w-24 truncate">{user.displayName || user.email?.split('@')[0]}</span>
                <ChevronDown size={13} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 glass-strong rounded-2xl border border-border overflow-hidden shadow-card z-50"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-sm font-medium text-text-primary truncate">{user.displayName || 'Creator'}</div>
                      <div className="text-xs text-text-muted truncate">{user.email}</div>
                    </div>
                    <button
                      onClick={() => { logout(); router.push('/'); }}
                      className="w-full px-4 py-3 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-1" style={{ fontFamily: 'Space Mono, monospace' }}>
              Content Generator{' '}
              <span className="text-accent-cyan">✦</span>
            </h1>
            <p className="text-text-muted text-sm">
              Hey {user.displayName?.split(' ')[0] || 'Creator'} 👋 — select your options and hit Generate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Controls panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-5"
            >
              {/* Platform */}
              <div className="glass rounded-3xl p-5 border border-border">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 block">Platform</label>
                <div className="space-y-2">
                  {PLATFORMS.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPlatform(p.id as Platform)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 ${platform === p.id
                          ? 'bg-bg-card border-accent-cyan/40 text-text-primary'
                          : 'border-border text-text-secondary hover:border-border-bright hover:text-text-primary'
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium">{p.label}</span>
                        {platform === p.id && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-accent-cyan" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inspiration */}
              <div className="glass rounded-3xl p-5 border border-border">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 block">Inspiration Source</label>
                <div className="space-y-2">
                  {INSPIRATION_SOURCES.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setInspiration(s.id as InspirationSource)}
                        className={`w-full flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-200 text-left ${inspiration === s.id
                          ? 'bg-bg-card border-accent-purple/40 text-text-primary'
                          : 'border-border text-text-secondary hover:border-border-bright'
                          }`}
                      >
                        <Icon size={15} className="flex-shrink-0 mt-0.5 text-accent-cyan" />
                        <div>
                          <div className="text-sm font-medium">{s.label}</div>
                          <div className="text-xs text-text-muted mt-0.5">{s.desc}</div>
                        </div>
                        {inspiration === s.id && (
                          <div className="ml-auto flex-shrink-0 w-2 h-2 rounded-full bg-accent-purple mt-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* YouTube link */}
              <div className="glass rounded-3xl p-5 border border-border">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 block flex items-center gap-2">
                  <LinkIcon size={11} />
                  YouTube Link (Optional)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-muted border border-border input-glow bg-transparent pr-10"
                  />
                  {youtubeLink && (
                    <button onClick={() => setYoutubeLink('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-2">Paste a YouTube video link to use it as content inspiration</p>
              </div>
              {/* Language Selector */}
              <div className="glass rounded-3xl p-5 border border-border">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3 block flex items-center gap-2">
                  🌐 Script Language
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id as Language)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 text-left ${language === lang.id
                        ? 'bg-bg-card border-accent-cyan/40 text-text-primary'
                        : 'border-border text-text-secondary hover:border-border-bright hover:text-text-primary'
                        }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{lang.label}</div>
                        <div className="text-xs text-text-muted">{lang.desc}</div>
                      </div>
                      {language === lang.id && (
                        <div className="w-2 h-2 rounded-full bg-accent-cyan flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right column: niche + generate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-3 space-y-5"
            >
              {/* Niche */}
              <div className="glass rounded-3xl p-5 border border-border">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-4 block">Select Niche</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                  {NICHES.map((n) => {
                    const Icon = n.icon;
                    return (
                      <button
                        key={n.id}
                        onClick={() => setNiche(n.id as Niche)}
                        className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all duration-200 group ${niche === n.id
                          ? 'bg-bg-card border-white/15 text-text-primary'
                          : 'border-border text-text-secondary hover:border-border-bright hover:text-text-primary'
                          }`}
                        style={niche === n.id ? { boxShadow: `0 0 20px ${n.color}20` } : {}}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${niche === n.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                            }`}
                          style={{ background: `${n.color}20`, border: `1px solid ${n.color}30` }}
                        >
                          <Icon size={16} style={{ color: n.color }} />
                        </div>
                        <span className="text-xs font-medium">{n.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-glow w-full py-5 rounded-3xl font-bold text-white text-lg flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>AI is generating...</span>
                  </>
                ) : (
                  <>
                    <Zap size={22} />
                    <span>Generate Content</span>
                  </>
                )}
              </button>

              {/* Loader / Output */}
              <AnimatePresence mode="wait">
                {generating && (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ShimmerLoader />
                  </motion.div>
                )}
                {result && !generating && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <OutputSection content={result} platform={platform} niche={niche} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
