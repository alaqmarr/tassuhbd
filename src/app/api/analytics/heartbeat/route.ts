import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sessions, pageViews } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { sessionId, pageViewId, currentDurationMs } = await req.json();

    if (!sessionId || !pageViewId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    // Update session lastActiveAt
    await db.update(sessions)
      .set({ lastActiveAt: istTime.toISOString() })
      .where(eq(sessions.id, sessionId));

    // Update pageView duration
    await db.update(pageViews)
      .set({ durationMs: currentDurationMs })
      .where(eq(pageViews.id, pageViewId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics heartbeat error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
