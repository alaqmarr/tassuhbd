'use client';
import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { CoverPage } from './CoverPage';
import { MemoryPage } from './MemoryPage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  photoUrl?: string;
  emoji?: string;
}

interface BookWrapperProps {
  memories: Memory[];
}

export function BookWrapper({ memories }: BookWrapperProps) {
  const bookRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setIsMobile(true);
        setDimensions({ width: width - 40, height: (width - 40) * 1.4 });
      } else {
        setIsMobile(false);
        setDimensions({ width: 450, height: 600 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextButtonClick = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevButtonClick = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const pages = [
    <div key="cover" className="page page-cover" data-density="hard">
      <CoverPage />
    </div>,
    <div key="inside-cover" className="page bg-cream border-l border-black/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-multiply" 
           style={{ backgroundImage: 'radial-gradient(#d5c3aa 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      <div className="w-16 h-16 border-t border-l border-rose-gold/30 absolute top-12 left-12"></div>
      <div className="w-16 h-16 border-b border-r border-rose-gold/30 absolute bottom-12 right-12"></div>
      
      <p className="font-heading text-4xl text-rose-gold mb-6 drop-shadow-sm">To a truly special person,</p>
      <p className="font-handwriting text-2xl text-charcoal/70 leading-relaxed max-w-[80%]">
        These pages hold the memories of how it all began. Every word, every laugh, and every moment I've treasured since February 13th.
      </p>
      <p className="font-heading text-3xl text-rose-gold mt-12">Thank you for being you. 💕</p>
    </div>
  ];

  memories.forEach((memory, index) => {
    pages.push(
      <div key={`memory-${memory.id}`} className="page">
        <MemoryPage memory={memory} pageNumber={index + 1} />
      </div>
    );
  });

  // To make the final book have an even number of pages overall,
  // we first see how many pages we have, assuming we will add 2 more (inside-back-cover, back-cover).
  // Total pages = current_pages + (filler?) + 2
  // We want (current_pages + 2 + filler) % 2 === 0
  if ((pages.length + 2) % 2 !== 0) {
    pages.push(
      <div key="filler-text" className="page bg-cream border-l border-black/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] flex items-center justify-center">
        <p className="font-heading text-2xl text-charcoal/40">To be continued...</p>
      </div>
    );
  }

  pages.push(
    <div key="inside-back-cover" className="page bg-cream border-l border-black/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"></div>
  );
  
  pages.push(
    <div key="back-cover" className="page page-cover bg-charcoal border-8 border-[#2a1a20] shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]" data-density="hard"></div>
  );

  return (
    <div className="relative w-full flex justify-center items-center">
      <button 
        onClick={prevButtonClick}
        className="hidden md:flex absolute left-4 lg:left-12 z-20 p-4 rounded-full bg-white/5 hover:bg-rose-gold/20 text-warm-white transition-colors"
      >
        <ChevronLeft size={32} />
      </button>

      {/* @ts-ignore - react-pageflip types are slightly outdated */}
      <HTMLFlipBook
        width={dimensions.width}
        height={dimensions.height}
        size="fixed"
        minWidth={300}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1000}
        maxShadowOpacity={0}
        drawShadow={false}
        usePortrait={true}
        showCover={true}
        mobileScrollSupport={true}
        ref={bookRef}
        className="scrapbook shadow-2xl mx-auto"
        style={{ margin: '0 auto' }}
        useMouseEvents={true}
        disableFlipByClick={true}
        clickEventForward={true}
      >
        {pages}
      </HTMLFlipBook>

      <button 
        onClick={nextButtonClick}
        className="hidden md:flex absolute right-4 lg:right-12 z-20 p-4 rounded-full bg-white/5 hover:bg-rose-gold/20 text-warm-white transition-colors"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}
