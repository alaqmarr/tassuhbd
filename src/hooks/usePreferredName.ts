'use client';
import { useState, useEffect } from 'react';

export function usePreferredName() {
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('preferred_name');
    setName(stored);
    setIsLoading(false);
  }, []);

  const chooseName = (chosen: string) => {
    localStorage.setItem('preferred_name', chosen);
    setName(chosen);
  };

  return { name, isLoading, chooseName };
}
