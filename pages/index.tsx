// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, TrendingUp, ArrowRight, Play, Star } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/router';

const ROTATING_WORDS = ['Viral Scripts', 'Hooks', 'Captions', 'Hashtags', 'Ideas'];

const FEATURES = [
  { icon: '🎯', title: 'AI-Powered Scripts', desc: 'Generate complete scripts optimized for virality in seconds.' },
  { icon: '📈', title: 'Trending Insights', desc: 'Pull from YouTube trending data to stay ahead of the curve.' },
  { icon: '✨', title: 'Platform Tailored', desc: 'Different output styles for Instagram Reels vs YouTube Shorts.' },
  { icon: '⚡', title: 'Instant Results', desc: 'Hook, script, caption, and hashtags — all at once.' },
  { icon: '🔥', title: 'Niche Targeting', desc: 'Money, Fitness, Tech, Motivation — 10+ niches available.' },
  { icon: '📝', title: 'Content History', desc: 'Save and revisit all your generated content anytime.' },
];

const TESTIMONIALS = [
  { name: 'Alex M.', handle: '@alexmakes', text: 'Went from 2K to 85K followers in 3 months using Creata AI. Absolutely insane tool.', stars: 5 },
  { name: 'Priya S.', handle: '@priyashorts', text: 'My YouTube Shorts hit 1M views. The scripts are genuinely viral. 10/10.', stars: 5 },
  { name: 'Jordan K.', handle: '@jkontent', text: 'Saves me 4 hours a week on content creation. The hooks are 🔥', stars: 5 },
];

export default function Landing() {
  const [wordIndex, setWordIndex] = useState(0);
  const { user } = useAuth();
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <>
      <Head><title>Creata AI — Create Viral Content in Seconds 🚀</title></Head>

      <div className="relative min-h-screen bg-bg-primary overflow-hidden">
        {/* Canvas particles */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />

        {/* Orbs */}
        <div className="orb orb-cyan w-96 h-96 -top-40 -left-20 animate-float" />
        <div className="orb orb-purple w-80 h-80 top-1/3 -right-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="orb orb-pink w-64 h-64 bottom-1/4 left-1/4 animate-float" style={{ animationDelay: '4s' }} />

        {/* Grid bg */}
        <div className="absolute inset-0 grid-bg opacity-30" />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'Space Mono, monospace' }}>Creata AI</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <button className="btn-glow px-5 py-2 rounded-xl text-sm font-semibold text-white">
                  <span>Dashboard →</span>
                </button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <button className="text-text-secondary hover:text-text-primary text-sm transition-colors">Sign In</button>
                </Link>
                <Link href="/auth?mode=signup">
                  <button className="btn-glow px-5 py-2 rounded-xl text-sm font-semibold text-white">
                    <span>Get Started Free</span>
                  </button>
                </Link>
              </>
            )}
          </motion.div>
        </nav>

        {/* Hero */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-text-secondary mb-8 border border-border"
          >
            <Sparkles size={12} className="text-accent-cyan" />
            Powered by GPT-4 + YouTube Trending Data
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl mb-4"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            Create Viral Content
            <br />
            in Seconds{' '}
            <span className="text-accent-cyan">🚀</span>
          </motion.h1>

          {/* Rotating words */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-3xl md:text-5xl font-bold mb-6 h-14 flex items-center"
          >
            <span className="text-text-muted mr-3">Generate</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="gradient-text"
                style={{ fontFamily: 'Space Mono, monospace' }}
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-text-secondary text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            Creata AI turns trending topics into complete viral content — hooks, scripts, captions, and hashtags — for Instagram Reels and YouTube Shorts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href={user ? '/dashboard' : '/auth?mode=signup'}>
              <button className="btn-glow px-8 py-4 rounded-2xl text-base font-bold text-white flex items-center gap-2">
                <span>Start Creating Free</span>
                <ArrowRight size={18} />
              </button>
            </Link>
            <button className="glass px-8 py-4 rounded-2xl text-base font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2 border border-border">
              <Play size={16} className="text-accent-cyan" />
              Watch Demo
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 mt-10 text-sm text-text-muted"
          >
            <div className="flex -space-x-2">
              {['🧑‍💻','👩‍🎨','🧑‍🚀','👨‍💼','👩‍🎤'].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-sm">{e}</div>
              ))}
            </div>
            <span>12,000+ creators using Creata AI</span>
          </motion.div>
        </section>

        {/* Features */}
        <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Space Mono, monospace' }}>
              Everything you need to go <span className="gradient-text">viral</span>
            </h2>
            <p className="text-text-secondary text-lg">All the tools. One platform.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass card-hover rounded-3xl p-6 border border-border group"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ fontFamily: 'Space Mono, monospace' }}
          >
            Creators love <span className="gradient-text">Creata AI</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl p-6 border border-border card-hover"
              >
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="text-sm font-semibold text-text-primary">{t.name}</div>
                  <div className="text-xs text-text-muted">{t.handle}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto glass rounded-3xl p-12 text-center border border-border relative overflow-hidden"
          >
            <div className="orb orb-cyan w-64 h-64 -top-20 -left-20 opacity-20" />
            <div className="orb orb-purple w-64 h-64 -bottom-20 -right-20 opacity-20" />
            <TrendingUp size={40} className="text-accent-cyan mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Space Mono, monospace' }}>
              Ready to go <span className="gradient-text">viral?</span>
            </h2>
            <p className="text-text-secondary mb-8">Join 12,000+ creators generating viral content with AI.</p>
            <Link href={user ? '/dashboard' : '/auth?mode=signup'}>
              <button className="btn-glow px-10 py-4 rounded-2xl text-base font-bold text-white inline-flex items-center gap-2">
                <span>{user ? 'Go to Dashboard' : 'Start for Free'}</span>
                <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-8 border-t border-border text-center">
          <p className="text-text-muted text-sm">
            © 2025 Creata AI. Built with ❤️ for viral creators.
          </p>
        </footer>
      </div>
    </>
  );
}
