'use client';
import { useState, useEffect } from 'react';

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

export function useCountdown(fromDateStr: string, toDateStr?: string): CountdownResult {
  const [result, setResult] = useState<CountdownResult>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Use Asia/Kolkata timezone
      const getISTTime = (date: Date) => {
        return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getTime();
      };

      const fromDate = new Date(fromDateStr);
      let toDate = toDateStr ? new Date(toDateStr) : new Date();

      let difference = getISTTime(toDate) - getISTTime(fromDate);
      
      if (difference < 0) {
        // If fromDate is in the future relative to toDate, swap them for countdown
        difference = getISTTime(fromDate) - getISTTime(toDate);
      }

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));

        setResult({ days, hours, minutes, seconds, totalDays });
      } else {
        setResult({ days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 });
      }
    };

    calculateTimeLeft();
    
    // Always set interval to ensure real-time updates for countdowns
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [fromDateStr, toDateStr]);

  return result;
}
