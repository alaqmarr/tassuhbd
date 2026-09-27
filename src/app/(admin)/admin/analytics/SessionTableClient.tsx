'use client';

import React, { useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { Trash2 } from 'lucide-react';

interface PageView {
  id: number;
  pagePath: string;
  durationMs: number | null;
}

interface SessionData {
  id: string;
  ipAddress: string;
  location: string | null;
  userAgent: string | null;
  startedAt: string;
  pageViews: PageView[];
}

interface SessionTableClientProps {
  initialSessions: SessionData[];
}

export default function SessionTableClient({ initialSessions }: SessionTableClientProps) {
  const [sessions, setSessions] = useState<SessionData[]>(initialSessions);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const tz = 'Asia/Kolkata';

  const formatIST = (dateStr: string) => {
    try {
      return formatInTimeZone(new Date(dateStr), tz, 'MMM dd, yyyy HH:mm');
    } catch {
      return dateStr;
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === sessions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sessions.map(s => s.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} session(s)? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    
    try {
      const promises = Array.from(selectedIds).map(id => 
        fetch(`/api/analytics/session/${id}`, { method: 'DELETE' })
      );
      
      await Promise.all(promises);
      
      // Update local state
      setSessions(sessions.filter(s => !selectedIds.has(s.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error("Failed to delete sessions", error);
      alert("Failed to delete some sessions.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-heading">Recent Sessions</h2>
        {selectedIds.size > 0 && (
          <button 
            onClick={deleteSelected}
            disabled={isDeleting}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : `Delete Selected (${selectedIds.size})`}
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-rose-gold focus:ring-rose-gold"
                  checked={sessions.length > 0 && selectedIds.size === sessions.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-4 font-semibold text-gray-700">Started (IST)</th>
              <th className="p-4 font-semibold text-gray-700">IP & Location</th>
              <th className="p-4 font-semibold text-gray-700">User Agent</th>
              <th className="p-4 font-semibold text-gray-700">Pages Visited</th>
              <th className="p-4 font-semibold text-gray-700">Total Time</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => {
              const views = s.pageViews || [];
              const totalTimeMs = views.reduce((acc, v) => acc + (v.durationMs || 0), 0);
              
              return (
                <React.Fragment key={s.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 bg-white">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-rose-gold focus:ring-rose-gold"
                        checked={selectedIds.has(s.id)}
                        onChange={() => toggleSelect(s.id)}
                      />
                    </td>
                    <td className="p-4 font-mono text-xs whitespace-nowrap">{formatIST(s.startedAt)}</td>
                    <td className="p-4">
                      <div className="font-mono text-xs font-bold text-gray-700">{s.ipAddress}</div>
                      {s.location && s.location !== 'Unknown Location' && (
                        <div className="text-xs text-rose-gold mt-1">{s.location}</div>
                      )}
                    </td>
                    <td className="p-4 text-xs truncate max-w-[200px]" title={s.userAgent || ''}>{s.userAgent}</td>
                    <td className="p-4 font-bold">{views.length}</td>
                    <td className="p-4 font-bold">{Math.round(totalTimeMs / 1000)}s</td>
                  </tr>
                  {views.length > 0 && (
                    <tr className="bg-[#fcfaf8] border-b-2 border-gray-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                      <td colSpan={6} className="p-0">
                        <div className="p-4 pl-12 border-l-4 border-rose-gold overflow-x-auto">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal/60 mb-3">Session Timeline (In Order)</h4>
                          <div className="flex flex-nowrap md:flex-wrap gap-2 items-center text-sm font-mono text-charcoal whitespace-nowrap md:whitespace-normal">
                             {views.map((v, i) => (
                               <div key={v.id} className="flex items-center shrink-0 md:shrink">
                                 <div className="bg-white px-3 py-1.5 rounded shadow-sm border border-gray-200 flex flex-col items-center min-w-[100px]">
                                   <span className="font-semibold text-rose-gold text-xs">{v.pagePath}</span>
                                   <span className="text-xs text-gray-500 mt-1">{Math.round((v.durationMs || 0) / 1000)}s spent</span>
                                 </div>
                                 {i < views.length - 1 && (
                                   <span className="mx-3 text-gray-300 font-bold">→</span>
                                 )}
                               </div>
                             ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {sessions.length === 0 && <tr><td colSpan={6} className="p-4 text-center">No sessions yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
