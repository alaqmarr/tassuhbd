'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, User, CheckCircle, AlertCircle, Loader2, Heart } from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Check if setup is needed
  useEffect(() => {
    async function checkSetup() {
      try {
        const res = await fetch('/api/setup');
        const data = await res.json();
        setSetupRequired(data.setupRequired);
      } catch {
        setSetupRequired(true);
      } finally {
        setLoading(false);
      }
    }
    checkSetup();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-8 h-8 text-rose-gold" />
        </motion.div>
      </div>
    );
  }

  // Already set up — show a message
  if (setupRequired === false) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-charcoal border border-rose-gold/20 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="font-heading text-3xl text-rose-gold mb-2">Already Set Up</h1>
          <p className="font-body text-warm-white/70 mb-6">
            An admin account already exists. You can log in to manage the site.
          </p>
          <button
            onClick={() => router.push('/admin/login')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-gold to-soft-pink text-warm-white font-body text-lg hover:opacity-90 transition-opacity"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-rose-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-soft-pink/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-gold/20 to-soft-pink/20 border border-rose-gold/30 mb-4"
          >
            <Shield className="w-8 h-8 text-rose-gold" />
          </motion.div>
          <h1 className="font-heading text-4xl text-rose-gold mb-2">First Time Setup</h1>
          <p className="font-body text-warm-white/60 text-lg">
            Create your admin account to manage the birthday surprise
          </p>
          <div className="flex items-center justify-center gap-1 mt-2 text-soft-pink/50">
            <Heart className="w-3 h-3 fill-current" />
            <span className="font-body text-sm">For Tasneem&apos;s special day</span>
            <Heart className="w-3 h-3 fill-current" />
          </div>
        </div>

        {/* Form Card */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-charcoal border border-green-500/30 rounded-2xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
              </motion.div>
              <h2 className="font-heading text-3xl text-green-400 mb-2">You&apos;re All Set! ✨</h2>
              <p className="font-body text-warm-white/70 mb-2">
                Admin account created successfully.
              </p>
              <p className="font-body text-warm-white/50 text-sm">
                Redirecting you to login...
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="bg-charcoal border border-rose-gold/20 rounded-2xl p-8 space-y-5"
            >
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 font-body text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              {/* Name field */}
              <div>
                <label className="block font-body text-warm-white/70 text-sm mb-1.5">Your Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-gold/50" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="What's your name?"
                    className="w-full pl-10 pr-4 py-3 bg-deep-purple/50 border border-rose-gold/20 rounded-xl text-warm-white font-body placeholder:text-warm-white/30 focus:outline-none focus:border-rose-gold/50 focus:ring-1 focus:ring-rose-gold/30 transition-all"
                  />
                </div>
              </div>

              {/* Email field */}
              <div>
                <label className="block font-body text-warm-white/70 text-sm mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-gold/50" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-deep-purple/50 border border-rose-gold/20 rounded-xl text-warm-white font-body placeholder:text-warm-white/30 focus:outline-none focus:border-rose-gold/50 focus:ring-1 focus:ring-rose-gold/30 transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block font-body text-warm-white/70 text-sm mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-gold/50" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-3 bg-deep-purple/50 border border-rose-gold/20 rounded-xl text-warm-white font-body placeholder:text-warm-white/30 focus:outline-none focus:border-rose-gold/50 focus:ring-1 focus:ring-rose-gold/30 transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password field */}
              <div>
                <label className="block font-body text-warm-white/70 text-sm mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-gold/50" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.confirmPassword}
                    onChange={(e) => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-4 py-3 bg-deep-purple/50 border border-rose-gold/20 rounded-xl text-warm-white font-body placeholder:text-warm-white/30 focus:outline-none focus:border-rose-gold/50 focus:ring-1 focus:ring-rose-gold/30 transition-all"
                  />
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1 font-body">Passwords don&apos;t match</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || form.password !== form.confirmPassword}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-gold to-soft-pink text-warm-white font-body text-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Create Admin Account
                  </>
                )}
              </button>

              <p className="text-center font-body text-warm-white/30 text-xs">
                This page is only available once. After creating your account, it will be locked.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
