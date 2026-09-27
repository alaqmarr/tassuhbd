import type { Metadata } from 'next';
import '@fontsource/dancing-script/400.css';
import '@fontsource/dancing-script/700.css';
import '@fontsource/crimson-text/400.css';
import '@fontsource/crimson-text/600.css';
import '@fontsource/crimson-text/700.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/700.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'For You, Tasneem 💝',
  description: 'A birthday surprise...',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-charcoal text-warm-white font-body">
        {children}
      </body>
    </html>
  );
}
