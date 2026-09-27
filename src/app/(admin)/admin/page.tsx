import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAnalyticsOverview, getPageBreakdown } from '@/lib/analytics';
import { db } from '@/lib/db';
import { memories } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const session = await auth();
  if (!session) {
    redirect('/admin/login');
  }

  const analytics = await getAnalyticsOverview();
  const pages = await getPageBreakdown();
  
  const memoriesCountResult = await db.select({ count: sql<number>`count(*)` }).from(memories);
  const totalMemories = memoriesCountResult[0]?.count || 0;
  
  // Calculate total photos
  const allMemories = await db.select({ photos: memories.photos }).from(memories);
  let totalPhotos = 0;
  allMemories.forEach(m => {
    try {
      const photos = JSON.parse(m.photos || '[]');
      totalPhotos += photos.length;
    } catch(e) {}
  });

  const mostViewedPage = pages.length > 0 ? pages[0].pagePath : 'N/A';

  return (
    <div className="p-8 max-w-6xl mx-auto text-charcoal bg-cream min-h-screen font-body">
      <h1 className="text-4xl font-heading text-rose-gold mb-8">Welcome back, Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Total Memories</h3>
          <p className="text-3xl font-mono text-charcoal">{totalMemories}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Total Photos</h3>
          <p className="text-3xl font-mono text-charcoal">{totalPhotos}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Visitor Sessions</h3>
          <p className="text-3xl font-mono text-charcoal">{analytics.totalSessions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Most Viewed</h3>
          <p className="text-xl font-mono text-charcoal truncate">{mostViewedPage}</p>
        </div>
      </div>

      <h2 className="text-2xl font-heading text-charcoal mb-6">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/memories" className="block bg-rose-gold text-white p-6 rounded-lg text-center hover:bg-rose-gold/90 transition-colors shadow-sm">
          <span className="block text-xl font-heading mb-2">Manage Memories</span>
          <span className="text-sm opacity-90">Add, edit, or delete memories</span>
        </Link>
        <Link href="/admin/analytics" className="block bg-gold text-white p-6 rounded-lg text-center hover:bg-gold/90 transition-colors shadow-sm">
          <span className="block text-xl font-heading mb-2">View Analytics</span>
          <span className="text-sm opacity-90">Check visitor stats & sessions</span>
        </Link>
      </div>
    </div>
  );
}
