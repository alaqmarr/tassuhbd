export interface Memory {
  id: number;
  title: string;
  description: string | null;
  date: string; // ISO date string
  emoji: string | null;
  photos: string[]; // JSON parsed array of photo paths
  order: number;
  type: 'milestone' | 'photo' | 'letter' | 'quote';
  quote?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string; // UUID
  ipAddress: string;
  userAgent: string | null;
  startedAt: string;
  lastActiveAt: string | null;
  isAdmin: boolean;
}

export interface PageView {
  id: number;
  sessionId: string;
  pagePath: string;
  enteredAt: string;
  exitedAt: string | null;
  durationMs: number | null;
  isReplay: boolean;
  replayCount: number;
}

export interface SiteSetting {
  key: string;
  value: string;
}

export interface AnalyticsOverview {
  totalSessions: number;
  totalPageViews: number;
  avgTimePerPage: number;
  mostViewedPage: string;
  totalReplays: number;
  uniqueIPs: number;
}
