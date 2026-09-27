import React from 'react';
import { usePreferredName } from '@/hooks/usePreferredName';

interface CoverPageProps {
  // Add any needed props
}

export const CoverPage = (props: CoverPageProps) => {
  const { name } = usePreferredName();

  return (
    <div className="bg-charcoal border-8 border-[#2a1a20] shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] h-full w-full flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/textures/leather.jpg')] opacity-20 mix-blend-multiply pointer-events-none"></div>
      
      {/* Decorative Gold Border */}
      <div className="absolute inset-4 border-2 border-gold/40 rounded-sm"></div>
      <div className="absolute inset-6 border border-gold/20 rounded-sm"></div>

      <div className="relative z-10 text-center px-8 flex flex-col items-center">
        <h1 className="font-heading text-6xl md:text-7xl text-rose-gold drop-shadow-md mb-8">
          Our Journey
        </h1>
        
        <div className="w-24 h-[1px] bg-gold/50 mb-8"></div>
        
        <p className="font-body text-2xl text-cream/80 italic">
          For {name || 'You'}
        </p>
        
        <div className="mt-16 text-gold/60">
          <span className="text-sm uppercase tracking-widest font-mono">Volume I</span>
        </div>
      </div>
    </div>
  );
};
