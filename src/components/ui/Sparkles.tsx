'use client';
import { motion } from 'motion/react';
import { ReactNode, useEffect, useState } from 'react';

interface SparklesProps {
  children: ReactNode;
  color?: string;
  count?: number;
}

export function Sparkles({ children, color = '#c9a96e', count = 5 }: SparklesProps) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      return Array.from({ length: count }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }));
    };
    
    setSparkles(generateSparkles());
    
    const interval = setInterval(() => {
      setSparkles(generateSparkles());
    }, 3000);
    
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="relative inline-block">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{
            backgroundColor: color,
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            boxShadow: `0 0 4px ${color}`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: sparkle.delay, ease: 'easeInOut' }}
        />
      ))}
      {children}
    </div>
  );
}
