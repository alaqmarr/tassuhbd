'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { usePreferredName } from '@/hooks/usePreferredName';
import { TypewriterText } from '@/components/ui/TypewriterText';
import { RefreshCcw } from 'lucide-react';

export default function LetterPage() {
  const { name } = usePreferredName();
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [key, setKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayName = name || 'Tasneem';

  const letterLines = [
    `Dear ${displayName},`,
    "",
    "Birthdays are often about counting years.",
    "But I think they are really about celebrating a person.",
    "And today, I want to celebrate you.",
    "",
    "Not because you turned nineteen.",
    "But because of the kind of person you are.",
    "",
    "You have a heart that cares deeply for the people around you.",
    "You have a kindness that appears naturally, without effort.",
    "You have a way of making others feel comfortable, heard, and valued.",
    "You carry strength within you, even during moments when you may not realize it yourself.",
    "Over the years, you have grown into someone who balances warmth with determination, compassion with resilience, and innocence with maturity.",
    "",
    "Nineteen years ago, Allah blessed this world with a beautiful soul.",
    "A daughter who is loved.",
    "A friend who is cherished.",
    "A person whose presence leaves an impact far greater than she knows.",
    "",
    "As you begin this new year of your life, I pray that Allah grants you endless barakat in your time, your health, your knowledge, your family, and your future.",
    "May He make every difficulty easy for you.",
    "May He fill your life with happiness that is lasting, not temporary.",
    "May He protect your smile, increase your rizq, strengthen your imaan, and surround you with people who genuinely care for you.",
    "May every dream that is good for you find its way to you at the perfect time.",
    "And may the years ahead be even more beautiful than the ones behind you.",
    "",
    "Never forget that you are special—not because of what you achieve, what you own, or what others think of you, but because of who you are.",
    "",
    "A thoughtful heart.",
    "A beautiful soul.",
    "A blessing to the people who know you.",
    "",
    `Happy 19th Birthday, ${displayName}.`,
    "",
    "May this year be one of your happiest yet."
  ];

  const fullText = letterLines.join('\n');

  // Auto-scroll logic
  useEffect(() => {
    if (!scrollRef.current || isTypingComplete) return;

    const observer = new MutationObserver(() => {
      if (scrollRef.current) {
        // Use smooth scrolling if desired, but instant is better for typewriter
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });

    observer.observe(scrollRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [isTypingComplete, key]);

  const handleComplete = () => {
    setIsTypingComplete(true);
    
    // Grand celebration
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#b76e79', '#e8a0bf', '#c9a96e']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#b76e79', '#e8a0bf', '#c9a96e']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleReplay = () => {
    setIsTypingComplete(false);
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-[100dvh] pt-20 pb-32 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-2xl relative flex flex-col max-h-[75vh]">
        {/* Paper Background */}
        <div 
          ref={scrollRef}
          className="bg-cream p-8 md:p-12 rounded-lg shadow-2xl relative overflow-y-auto custom-scrollbar w-full transition-all duration-700 ease-out"
        >
          {/* subtle paper texture overlay could go here */}
          
          <div className="font-body text-charcoal text-lg md:text-xl leading-loose whitespace-pre-wrap">
            <TypewriterText 
              key={key}
              text={fullText} 
              speed={40} 
              delay={500}
              onComplete={handleComplete}
            />
          </div>
          
          {isTypingComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-12 text-center"
            >
              <h2 className="font-heading text-4xl text-rose-gold mb-6">
                Happy Birthday, {displayName}! 🎂
              </h2>
            </motion.div>
          )}
        </div>

        {isTypingComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mt-8 flex justify-center shrink-0"
          >
            <button
              onClick={handleReplay}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-warm-white hover:bg-rose-gold/20 hover:text-rose-gold transition-colors"
            >
              <RefreshCcw size={18} />
              <span className="font-body text-lg">Read Again</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
