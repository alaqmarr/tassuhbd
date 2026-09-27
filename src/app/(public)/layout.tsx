import { FloatingHearts } from '@/components/ui/FloatingHearts';
import { NameChoiceModal } from '@/components/ui/NameChoiceModal';
import { PublicNav } from '@/components/ui/PublicNav';
import { MusicPlayer } from '@/components/ui/MusicPlayer';
import SessionTracker from '@/components/analytics/SessionTracker';
import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-charcoal text-warm-white selection:bg-rose-gold/30 selection:text-white relative overflow-x-hidden">
      <SessionTracker />
      <FloatingHearts />
      <NameChoiceModal />
      <MusicPlayer />
      <main className="relative z-10 w-full min-h-screen pb-24">
        {children}
      </main>
      <PublicNav />
    </div>
  );
}
