import React from 'react';
import Image from 'next/image';
import { useCountdown } from '@/hooks/useCountdown';

function MemoryCounter({ dateStr }: { dateStr: string }) {
  const { totalDays, hours, minutes, seconds } = useCountdown(dateStr);
  
  const isFuture = new Date(dateStr) > new Date();
  
  return (
    <div className="font-mono text-[10px] text-rose-gold/80 mt-1 uppercase tracking-wider font-bold">
      {totalDays > 0 ? `${totalDays}d ` : ''}
      {String(hours).padStart(2, '0')}h : {String(minutes).padStart(2, '0')}m : {String(seconds).padStart(2, '0')}s
      {isFuture ? ' remaining' : ' ago'}
    </div>
  );
}

interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  photos?: string[];
  emoji?: string;
  type?: string;
}

interface MemoryPageProps {
  memory: Memory;
  pageNumber: number;
}

export const MemoryPage = ({ memory, pageNumber }: MemoryPageProps) => {
  const formattedDate = new Date(memory.date).toLocaleDateString('en-US', {
    timeZone: 'Asia/Kolkata',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const photo = memory.photos && memory.photos.length > 0 ? memory.photos[0] : null;

  return (
    <div className="bg-cream h-full w-full relative shadow-[inset_0_0_30px_rgba(0,0,0,0.1)] p-8 md:p-12 overflow-hidden flex flex-col">
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" 
           style={{ backgroundImage: 'radial-gradient(#d5c3aa 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col border-b border-charcoal/20 pb-1">
            <div className="font-mono text-sm text-charcoal/60">
              {formattedDate}
            </div>
            <MemoryCounter dateStr={memory.date} />
          </div>
          {memory.emoji && <div className="text-3xl">{memory.emoji}</div>}
        </div>

        {/* Title */}
        <h2 className="font-heading text-4xl text-[#2a1a20] mb-4 drop-shadow-sm">
          {memory.title}
        </h2>

        {/* Scrollable Content Area */}
        <div 
          className="flex-grow overflow-y-auto custom-scrollbar pr-4 pb-8 flex flex-col items-center"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Photo (if any) */}
          {photo ? (
            <div className={`relative mx-auto mb-8 rotate-1 hover:rotate-0 transition-all duration-500 bg-[#fbfbf9] p-3 pb-12 shadow-[0_10px_30px_rgba(0,0,0,0.15)] group w-4/5 md:w-3/4 max-w-sm shrink-0`}>
              {/* Tape effect */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-md shadow-sm rotate-[-3deg] z-10 border border-white/30 rounded-[1px]"></div>
              
              <div className="w-full aspect-square bg-gray-200 relative overflow-hidden group-hover:brightness-105 transition-all">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={photo} alt={memory.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              {/* Polaroid caption hint */}
              <div className="absolute bottom-2 left-0 w-full text-center">
                <span className="font-handwriting text-base md:text-xl text-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity">{memory.type === 'photo' ? 'Beautiful Photo' : 'Sweet Memory'}</span>
              </div>
            </div>
          ) : (
            <div className="w-full border-t border-b border-black/5 py-4 mb-6"></div>
          )}

          {/* Description - Handwritten style */}
          <div 
            className={`w-full font-handwriting text-charcoal/80 leading-relaxed 
              ${memory.description && memory.description.length > 400 ? 'text-base md:text-lg' : 
                memory.description && memory.description.length > 200 ? 'text-lg md:text-xl' : 
                'text-2xl md:text-3xl'}`} 
            style={{ textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.05)' }}
          >
            {memory.description}
          </div>
        </div>

        {/* Page Number */}
        <div className="absolute bottom-4 left-0 w-full text-center font-mono text-xs text-charcoal/40">
          - {pageNumber} -
        </div>
      </div>
    </div>
  );
};
