'use client';
import { motion, AnimatePresence } from 'motion/react';
import { usePreferredName } from '@/hooks/usePreferredName';

export function NameChoiceModal() {
  const { name, isLoading, chooseName } = usePreferredName();

  if (isLoading || name) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-charcoal border border-rose-gold/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
        >
          {/* Decorative background circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-gold/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-soft-pink/10 rounded-full blur-2xl" />

          <div className="relative z-10 text-center space-y-6">
            <div>
              <h2 className="font-heading text-4xl text-rose-gold mb-2">Before we begin... 💕</h2>
              <p className="font-body text-warm-white text-lg">What should I call you?</p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => chooseName('Tasneem')}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-rose-gold/20 to-soft-pink/20 border border-rose-gold/50 text-warm-white font-body text-xl hover:from-rose-gold/30 hover:to-soft-pink/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Tasneem
              </button>
              <button
                onClick={() => chooseName('Tassu')}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-rose-gold/20 to-soft-pink/20 border border-rose-gold/50 text-warm-white font-body text-xl hover:from-rose-gold/30 hover:to-soft-pink/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Tassu
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
