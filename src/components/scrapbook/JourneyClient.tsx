'use client';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';

const BookWrapper = dynamic(
  () => import('@/components/scrapbook/BookWrapper').then((mod) => mod.BookWrapper),
  { ssr: false, loading: () => <div className="text-rose-gold animate-pulse">Opening scrapbook...</div> }
);

export function JourneyClient({ memories }: { memories: any[] }) {
  return (
    <div className="min-h-[100svh] pt-20 pb-32 px-4 flex flex-col items-center bg-[url('/textures/wood.jpg')] bg-cover bg-center bg-fixed relative">
      <div className="absolute inset-0 bg-charcoal/80"></div>
      
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <p className="font-body text-soft-pink mb-2">Swipe or click corners to flip pages</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="w-full flex justify-center"
        >
          <BookWrapper memories={memories} />
        </motion.div>
      </div>
    </div>
  );
}
