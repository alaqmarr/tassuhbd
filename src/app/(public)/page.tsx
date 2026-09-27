'use client';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { usePreferredName } from '@/hooks/usePreferredName';
import { Sparkles } from '@/components/ui/Sparkles';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { CounterCard } from '@/components/ui/CounterCard';

export default function LandingPage() {
  const router = useRouter();
  const { name } = usePreferredName();

  const handleOpenGift = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#b76e79', '#e8a0bf', '#c9a96e', '#f5f0eb']
    });
    
    setTimeout(() => {
      router.push('/journey');
    }, 1500);
  };

  const currentYear = new Date().getFullYear();
  const birthdayDate = `${currentYear}-10-08T00:00:00`;
  const isBirthdayPast = new Date() > new Date(birthdayDate);
  const targetBirthdayDate = isBirthdayPast ? `${currentYear + 1}-10-08T00:00:00` : birthdayDate;

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-charcoal via-[#2a1a20] to-charcoal">
      {/* Subtle animated background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-rose-gold/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

      <motion.div 
        className="w-full max-w-4xl mx-auto flex flex-col items-center z-10 px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mb-8"
        >
          <p className="font-body text-rose-gold/80 text-xl md:text-2xl italic tracking-widest text-center">
            For someone incredibly special,
          </p>
        </motion.div>

        <div className="mb-12 flex items-center justify-center relative">
          <Sparkles count={12}>
            <h1 className="font-heading text-8xl md:text-[10rem] text-transparent bg-clip-text bg-gradient-to-br from-warm-white via-rose-gold to-soft-pink drop-shadow-[0_0_30px_rgba(183,110,121,0.5)] text-center leading-none py-4">
              {name || 'Tasneem'}
            </h1>
          </Sparkles>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2, type: 'spring' }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-4xl md:text-5xl text-warm-white mb-4">
            {isBirthdayPast ? `Happy ${currentYear - 2007}th Birthday! 🎂` : 'Happy Birthday! 🎂'}
          </h2>
          <p className="font-body text-cream/70 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Every moment with you feels like a gift. Today, it's my turn to give you one.
          </p>
        </motion.div>

        {/* Elegant unified counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="w-full max-w-2xl mb-16"
        >
          <div className="bg-white/[0.03] backdrop-blur-xl border border-rose-gold/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_40px_rgba(0,0,0,0.2)]">
            <div className="flex-1 w-full">
              <CounterCard 
                fromDate="2025-02-13T00:00:00" 
                label="Knowing You" 
                emoji="✨"
              />
            </div>
            
            <div className="hidden md:block w-[1px] h-20 bg-gradient-to-b from-transparent via-rose-gold/30 to-transparent"></div>
            <div className="md:hidden h-[1px] w-20 bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent"></div>
            
            <div className="flex-1 w-full">
              <CounterCard 
                fromDate={targetBirthdayDate} 
                label={isBirthdayPast ? "Next Birthday" : "The Big Day"} 
                emoji="⏳"
              />
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          onClick={handleOpenGift}
          className="group relative overflow-hidden rounded-full bg-charcoal border border-rose-gold/30 px-10 py-5 shadow-[0_0_20px_rgba(183,110,121,0.2)] hover:shadow-[0_0_40px_rgba(183,110,121,0.6)] hover:border-rose-gold transition-all duration-500 transform hover:-translate-y-1 active:translate-y-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-gold/20 via-soft-pink/20 to-rose-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative z-10 flex items-center gap-3 text-warm-white font-body text-xl md:text-2xl font-medium tracking-wide">
            Open Your Gift 
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">💝</span>
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
