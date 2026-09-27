'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookHeart, Clock, Image as ImageIcon, Mail } from 'lucide-react';

export function PublicNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/journey', icon: BookHeart, label: 'Journey' },
    { href: '/timeline', icon: Clock, label: 'Timeline' },
    { href: '/gallery', icon: ImageIcon, label: 'Gallery' },
    { href: '/letter', icon: Mail, label: 'Letter' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <nav className="flex items-center gap-2 px-4 py-3 bg-charcoal/80 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-3 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'bg-rose-gold/20 text-rose-gold scale-110' 
                  : 'text-soft-pink hover:bg-white/5 hover:text-warm-white'
              }`}
              aria-label={item.label}
              title={item.label}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
