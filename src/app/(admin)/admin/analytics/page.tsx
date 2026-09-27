import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAnalyticsOverview, getSessionDetails, getPageBreakdown } from '@/lib/analytics';
import { formatInTimeZone } from 'date-fns-tz';
import SessionTableClient from './SessionTableClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AnalyticsDashboard() {
  const session = await auth();
  if (!session) {
    redirect('/admin/login');
  }

  const overview = await getAnalyticsOverview();
  const sessions = await getSessionDetails();
  const pages = await getPageBreakdown();
  
  const tz = 'Asia/Kolkata';

  const formatIST = (dateStr: string) => {
    try {
      return formatInTimeZone(new Date(dateStr), tz, 'MMM dd, yyyy HH:mm');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto text-charcoal bg-cream min-h-screen font-body">
      <h1 className="text-4xl font-heading text-rose-gold mb-8">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs uppercase text-gray-500 mb-1">Total Sessions</h3>
          <p className="text-2xl font-mono">{overview.totalSessions}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs uppercase text-gray-500 mb-1">Page Views</h3>
          <p className="text-2xl font-mono">{overview.totalViews}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xs uppercase text-gray-500 mb-1">Avg Time</h3>
          <p className="text-2xl font-mono">{Math.round((overview.avgDurationMs || 0) / 1000)}s</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 truncate">
          <h3 className="text-xs uppercase text-gray-500 mb-1">Top Page</h3>
          <p className="text-lg font-mono truncate">{pages.length > 0 ? pages[0].pagePath : 'N/A'}</p>
        </div>
      </div>

      <h2 className="text-2xl font-heading mb-4">Page Breakdown</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden mb-12">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 font-semibold text-gray-700">Path</th>
              <th className="p-4 font-semibold text-gray-700">Views</th>
              <th className="p-4 font-semibold text-gray-700">Avg Time</th>
              <th className="p-4 font-semibold text-gray-700">Replays</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-mono text-sm">{p.pagePath}</td>
                <td className="p-4">{p.views}</td>
                <td className="p-4">{Math.round((p.avgDurationMs || 0) / 1000)}s</td>
                <td className="p-4">{p.replays || 0}</td>
              </tr>
            ))}
            {pages.length === 0 && <tr><td colSpan={4} className="p-4 text-center">No data yet</td></tr>}
          </tbody>
        </table>
      </div>

      <SessionTableClient initialSessions={sessions as any} />
    </div>
  );
}
