'use client';
import { useCountdown } from '@/hooks/useCountdown';

interface CounterCardProps {
  fromDate: string;
  toDate?: string;
  label: string;
  emoji?: string;
}

export function CounterCard({ fromDate, toDate, label, emoji }: CounterCardProps) {
  const { totalDays, hours, minutes, seconds } = useCountdown(fromDate, toDate);

  return (
    <div className="flex flex-col items-center justify-center min-w-[140px]">
      <div className="text-3xl font-mono text-warm-white font-bold mb-2 tabular-nums tracking-tight">
        <div className="flex items-center gap-2">
          {totalDays > 0 && (
            <>
              <div className="flex flex-col items-center">
                <span>{totalDays}</span>
                <span className="text-[10px] text-soft-pink font-sans font-normal tracking-normal uppercase">days</span>
              </div>
              <span className="text-rose-gold mb-3 opacity-50">:</span>
            </>
          )}
          <div className="flex flex-col items-center">
            <span>{String(hours).padStart(2, '0')}</span>
            <span className="text-[10px] text-soft-pink font-sans font-normal tracking-normal uppercase">hr</span>
          </div>
          <span className="text-rose-gold mb-3 opacity-50">:</span>
          <div className="flex flex-col items-center">
            <span>{String(minutes).padStart(2, '0')}</span>
            <span className="text-[10px] text-soft-pink font-sans font-normal tracking-normal uppercase">min</span>
          </div>
          <span className="text-rose-gold mb-3 opacity-50">:</span>
          <div className="flex flex-col items-center w-[3ch]">
            <span className="text-rose-gold">{String(seconds).padStart(2, '0')}</span>
            <span className="text-[10px] text-soft-pink font-sans font-normal tracking-normal uppercase">sec</span>
          </div>
        </div>
      </div>
      <div className="text-sm font-body text-cream text-center">
        {label} {emoji && <span>{emoji}</span>}
      </div>
    </div>
  );
}
