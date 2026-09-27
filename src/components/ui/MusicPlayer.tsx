'use client';
import { useState, useRef, useEffect } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Attempt auto-play on mount, though browsers often block it until interaction
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // nice soft background volume
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => {
          // Auto-play blocked
          setIsPlaying(false);
        });
      }
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <audio
        ref={audioRef}
        loop
        // Fallback romantic piano/lofi track. 
        // Can be replaced with actual loved song in public/music/bgm.mp3
        src="https://cdn.pixabay.com/download/audio/2022/10/25/audio_2339d67ccb.mp3?filename=beautiful-romantic-piano-122971.mp3"
      />
      
      <motion.button
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-rose-gold shadow-[0_0_15px_rgba(183,110,121,0.3)] hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
        animate={{
          boxShadow: isPlaying 
            ? ['0 0 15px rgba(183,110,121,0.3)', '0 0 25px rgba(183,110,121,0.6)', '0 0 15px rgba(183,110,121,0.3)']
            : '0 0 15px rgba(183,110,121,0)',
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isPlaying ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Music size={20} />
          </motion.div>
        ) : (
          <VolumeX size={20} className="opacity-70" />
        )}
      </motion.button>
    </div>
  );
}
