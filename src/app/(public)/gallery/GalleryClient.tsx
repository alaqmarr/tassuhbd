'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export function GalleryClient({ photos }: { photos: Photo[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-5xl md:text-6xl text-center text-rose-gold mb-12"
        >
          Our Gallery
        </motion.h1>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: (idx % 2 === 0 ? 1 : -1) * (1 + (idx % 3)) }}
              transition={{ delay: idx * 0.1, type: 'spring' }}
              onClick={() => setSelectedIndex(idx)}
              className="break-inside-avoid cursor-pointer group mb-6"
            >
              <div className="bg-[#fbfbf9] p-3 pb-12 rounded-[2px] shadow-[0_10px_30px_rgba(0,0,0,0.15)] transform transition-all duration-300 group-hover:scale-[1.05] group-hover:rotate-0 relative z-10 hover:z-20 border border-white/50">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-md shadow-sm rotate-[-2deg] z-10 rounded-[1px]"></div>
                
                <div className="w-full aspect-[4/5] bg-gray-200 relative overflow-hidden group-hover:brightness-105 transition-all">
                   <img src={photo.url} alt={photo.caption} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <p className="font-handwriting text-2xl text-charcoal/80 absolute bottom-3 left-0 w-full text-center px-4 truncate" style={{ textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.05)' }}>
                  {photo.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-8 backdrop-blur-md"
            >
              <button className="absolute top-6 right-6 text-white hover:text-rose-gold transition-colors z-[110]">
                <X size={32} />
              </button>
              
              <div className="relative w-full h-full max-w-7xl flex items-center justify-center">
                <button 
                  onClick={prevPhoto} 
                  className="absolute left-0 md:left-4 z-20 p-2 md:p-3 bg-black/50 text-white rounded-full hover:bg-rose-gold transition-colors"
                >
                  <ChevronLeft size={32} />
                </button>
                
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="relative w-full h-full flex flex-col items-center justify-center px-12 md:px-24"
                >
                  <div className="relative flex-grow flex items-center justify-center w-full min-h-0">
                    <img 
                      src={photos[selectedIndex].url} 
                      alt={photos[selectedIndex].caption} 
                      className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-sm" 
                    />
                  </div>
                  <div className="mt-4 text-center shrink-0">
                    <p className="font-body text-xl md:text-2xl text-warm-white">{photos[selectedIndex].caption}</p>
                    <p className="font-mono text-soft-pink text-xs md:text-sm mt-1">{photos[selectedIndex].date}</p>
                  </div>
                </motion.div>

                <button 
                  onClick={nextPhoto} 
                  className="absolute right-0 md:right-4 z-20 p-2 md:p-3 bg-black/50 text-white rounded-full hover:bg-rose-gold transition-colors"
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
