// pages/auth.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Zap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (router.query.mode === 'signup') setMode('signup');
  }, [router.query]);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email, password, name);
        toast.success('Account created! Welcome 🎉');
      } else {
        await signIn(email, password);
        toast.success('Welcome back! 👋');
      }
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message?.replace('Firebase: ', '') || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google! 🚀');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>{mode === 'signin' ? 'Sign In' : 'Create Account'} — Creata AI</title></Head>
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 relative overflow-hidden">
        {/* Orbs */}
        <div className="orb orb-cyan w-96 h-96 -top-40 -left-20 opacity-10 animate-float" />
        <div className="orb orb-purple w-80 h-80 bottom-0 right-0 opacity-10 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 grid-bg opacity-20" />

        {/* Back link */}
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm z-10">
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Logo */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-lg gradient-text" style={{ fontFamily: 'Space Mono, monospace' }}>Creata AI</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-strong rounded-3xl p-8 border border-border">
            {/* Mode toggle */}
            <div className="flex rounded-2xl bg-bg-secondary p-1 mb-8 border border-border">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    mode === m
                      ? 'bg-bg-card text-text-primary shadow-sm border border-border'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-bold text-text-primary mb-1" style={{ fontFamily: 'Space Mono, monospace' }}>
                  {mode === 'signin' ? 'Welcome back 👋' : 'Start creating 🚀'}
                </h1>
                <p className="text-text-muted text-sm mb-7">
                  {mode === 'signin' ? 'Sign in to your Creata AI account' : 'Create your free account in seconds'}
                </p>

                {/* Google button */}
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full glass rounded-2xl py-3 flex items-center justify-center gap-3 text-sm font-medium text-text-primary border border-border hover:border-border-bright transition-all mb-5 disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-text-muted text-xs">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full glass rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder-text-muted border border-border input-glow bg-transparent"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full glass rounded-xl pl-11 pr-4 py-3 text-sm text-text-primary placeholder-text-muted border border-border input-glow bg-transparent"
                    />
                  </div>

                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full glass rounded-xl pl-11 pr-12 py-3 text-sm text-text-primary placeholder-text-muted border border-border input-glow bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-glow w-full py-3.5 rounded-xl font-semibold text-white text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>
                      {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </span>
                    {!loading && <Zap size={16} />}
                  </button>
                </form>

                <p className="text-center text-text-muted text-xs mt-6">
                  {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-accent-cyan hover:underline"
                  >
                    {mode === 'signin' ? 'Sign up free' : 'Sign in'}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
}
