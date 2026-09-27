'use client';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Assuming a utility exists, else just template literal

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

export function TypewriterText({ text, speed = 50, delay = 0, onComplete, className = '' }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      if (!isCompleted) {
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
    }
  }, [displayedText, isStarted, text, speed, isCompleted, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isCompleted && <span className="animate-pulse opacity-70">|</span>}
    </span>
  );
}
