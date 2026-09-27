import { db } from '@/lib/db';
import { sessions, pageViews } from '@/lib/db/schema';
import { eq, sql, desc } from 'drizzle-orm';

// Get overview stats (exclude admin sessions handled by API already)
export async function getAnalyticsOverview() {
  const result = await db.select({
    totalSessions: sql<number>`count(distinct ${sessions.id})`,
    totalViews: sql<number>`count(${pageViews.id})`,
    avgDurationMs: sql<number>`avg(${pageViews.durationMs})`,
  }).from(sessions)
    .leftJoin(pageViews, eq(sessions.id, pageViews.sessionId));
  
  return result[0];
}

// Get all sessions with their page views
export async function getSessionDetails() {
  const allSessions = await db.query.sessions.findMany({
    with: {
      pageViews: {
        orderBy: (views: any, { asc }: any) => [asc(views.enteredAt)],
      },
    },
    orderBy: (sessions: any, { desc }: any) => [desc(sessions.startedAt)],
  });
  return allSessions;
}

// Get per-page breakdown
export async function getPageBreakdown() {
  const breakdown = await db.select({
    pagePath: pageViews.pagePath,
    views: sql<number>`count(${pageViews.id})`,
    avgDurationMs: sql<number>`avg(${pageViews.durationMs})`,
    replays: sql<number>`sum(case when ${pageViews.isReplay} = 1 then 1 else 0 end)`,
  }).from(pageViews)
    .groupBy(pageViews.pagePath)
    .orderBy(desc(sql<number>`count(${pageViews.id})`));
  
  return breakdown;
}

// Get timeline of all sessions
export async function getSessionTimeline() {
  return await db.query.sessions.findMany({
    orderBy: (sessions: any, { desc }: any) => [desc(sessions.startedAt)],
  });
}
