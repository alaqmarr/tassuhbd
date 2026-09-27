'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function SessionTracker() {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);
  const currentPageViewIdRef = useRef<number | null>(null);
  const pageEnteredAtRef = useRef<number>(Date.now());
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const visitedPagesRef = useRef<Set<string>>(new Set());

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      // Check sessionStorage for existing session
      const existingSessionId = sessionStorage.getItem('analytics_session_id');
      if (existingSessionId) {
        sessionIdRef.current = existingSessionId;
        // Load visited pages from session storage
        const visited = sessionStorage.getItem('analytics_visited_pages');
        if (visited) visitedPagesRef.current = new Set(JSON.parse(visited));
      } else {
        // Create new session
        const response = await fetch('/api/analytics/session', { method: 'POST' });
        if (response.ok) {
            const data = await response.json();
            if (data.sessionId) {
              sessionIdRef.current = data.sessionId;
              sessionStorage.setItem('analytics_session_id', data.sessionId);
            }
        }
      }
      // Record initial page view if we haven't already
      if (sessionIdRef.current && !currentPageViewIdRef.current) {
        recordPageView(pathname);
      }
    };
    initSession();

    // Cleanup on unmount
    return () => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      sendPageExit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track page changes
  useEffect(() => {
    // Skip on initial mount where initSession handles it
    if (!sessionIdRef.current) return;
    
    // Check if we are already tracking this page
    if (currentPageViewIdRef.current) {
      sendPageExit(); // Exit previous page
    }
    
    recordPageView(pathname); // Enter new page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isTrackingRef = useRef(false);

  const recordPageView = async (path: string) => {
    if (!sessionIdRef.current || isTrackingRef.current) return;
    isTrackingRef.current = true;
    pageEnteredAtRef.current = Date.now();

    try {
      const response = await fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          pagePath: path,
        }),
      });
      if (response.status === 404) {
        // Session was deleted from DB, clear storage and let it re-init on reload
        sessionStorage.removeItem('analytics_session_id');
        sessionStorage.removeItem('analytics_visited_pages');
        window.location.reload();
        return;
      }
      if (!response.ok) {
        isTrackingRef.current = false;
        return;
      }
      const data = await response.json();
      if (!data.pageViewId) {
        isTrackingRef.current = false;
        return;
      }
      
      currentPageViewIdRef.current = data.pageViewId;

      // Track visited pages for replay detection
      visitedPagesRef.current.add(path);
      sessionStorage.setItem('analytics_visited_pages', JSON.stringify([...visitedPagesRef.current]));

      // Start heartbeat
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = setInterval(() => sendHeartbeat(), 5000);
    } catch (e) {
      console.error('Analytics: Failed to record page view', e);
      isTrackingRef.current = false;
    }
  };

  const sendPageExit = () => {
    if (!currentPageViewIdRef.current) return;
    const durationMs = Date.now() - pageEnteredAtRef.current;
    
    // We get IST time
    const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

    // Use fetch with keepalive for reliability on page exit (better than sendBeacon)
    fetch('/api/analytics/pageview', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageViewId: currentPageViewIdRef.current,
        exitedAt: new Date(now).toISOString(),
        durationMs,
      }),
      keepalive: true,
    }).catch(console.error);

    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    currentPageViewIdRef.current = null;
    isTrackingRef.current = false;
  };

  const sendHeartbeat = async () => {
    if (!sessionIdRef.current || !currentPageViewIdRef.current) return;
    const durationMs = Date.now() - pageEnteredAtRef.current;
    try {
      await fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          pageViewId: currentPageViewIdRef.current,
          currentDurationMs: durationMs,
        }),
      });
    } catch (e) {
      // Silent fail for heartbeats
    }
  };

  // Handle page visibility changes (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Just send a heartbeat to update the final time, but don't exit the page
        if (currentPageViewIdRef.current) {
          sendHeartbeat();
          if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
        }
      } else {
        // Resumed - restart heartbeat if we have a current page view
        if (currentPageViewIdRef.current) {
          if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = setInterval(() => sendHeartbeat(), 5000);
        }
      }
    };

    const handleBeforeUnload = () => {
      sendPageExit();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
