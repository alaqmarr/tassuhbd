'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface Memory {
  id: string;
  title: string;
  description: string | null;
  date: string;
  photos?: string[];
}

export function TimelineClient({ memories }: { memories: Memory[] }) {
  return (
    <div className="min-h-screen pt-20 pb-32 px-6 bg-gradient-to-b from-charcoal to-[#2d1b2e]">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-5xl md:text-6xl text-center text-rose-gold mb-16"
        >
          Our Memories
        </motion.h1>

        <div className="relative border-l-2 md:border-l-0 md:border-r-0 md:before:absolute md:before:inset-y-0 md:before:left-1/2 md:before:-translate-x-1/2 md:before:w-0.5 md:before:bg-rose-gold/30 border-rose-gold/30 space-y-12 md:space-y-24 ml-4 md:ml-0">
          {memories.map((memory, index) => (
            <TimelineItem key={memory.id} memory={memory} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-24 mb-8"
        >
          <p className="font-heading text-4xl text-soft-pink">Happy Birthday! 💕</p>
          <p className="font-body text-warm-white/60 mt-4">{new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </motion.div>
      </div>
    </div>
  );
}

function TimelineItem({ memory, index }: { memory: Memory; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  const photo = memory.photos && memory.photos.length > 0 ? memory.photos[0] : null;

  return (
    <div ref={ref} className={`relative flex items-center md:justify-between w-full group ${isEven ? 'md:flex-row-reverse' : ''}`}>
      {/* Heart Marker & Line effect */}
      <div className="absolute left-[-29px] md:left-1/2 md:-translate-x-1/2 w-14 h-14 rounded-full bg-charcoal border-4 border-rose-gold flex items-center justify-center z-10 shadow-[0_0_15px_rgba(183,110,121,0.6)] group-hover:scale-110 group-hover:border-soft-pink transition-all duration-300">
        <span className="text-xl animate-pulse-slow">❤️</span>
      </div>

      {/* Connection Line Glow for this item */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-gradient-to-r from-rose-gold/0 via-rose-gold/50 to-rose-gold/0 opacity-0 group-hover:opacity-100 transition-opacity z-0 blur-sm"></div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 50 : -50, scale: 0.95 }}
        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: isEven ? 50 : -50, scale: 0.95 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        className={`w-full md:w-[45%] pl-8 md:pl-0 ${isEven ? 'md:pr-10 text-left md:text-right' : 'md:pl-10 text-left'}`}
      >
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-[0_0_30px_rgba(183,110,121,0.2)] hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-rose-gold/20 to-soft-pink/20 text-soft-pink rounded-full text-xs tracking-widest font-mono font-bold mb-4 border border-rose-gold/20">
            {new Date(memory.date).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <h3 className="font-heading text-3xl text-warm-white mb-2">{memory.title}</h3>
          <p className="font-body text-cream/80 text-lg leading-relaxed">{memory.description}</p>
          
          {photo && (
            <div className="mt-4 rounded-xl overflow-hidden relative aspect-video shadow-inner">
               <img src={photo} alt={memory.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
