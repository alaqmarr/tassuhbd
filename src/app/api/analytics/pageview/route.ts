import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pageViews, sessions } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    let body;
    const text = await req.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Empty body' }, { status: 400 });
    }

    if (body._method === 'PATCH') {
      return handlePatch(body);
    }

    const { sessionId, pagePath } = body;
    
    if (!sessionId || !pagePath) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    // Check for replay
    const existingViews = await db.query.pageViews.findMany({
      where: and(
        eq(pageViews.sessionId, sessionId),
        eq(pageViews.pagePath, pagePath)
      ),
    });

    const isReplay = existingViews.length > 0;
    
    // Ensure session exists
    const sessionExists = await db.query.sessions.findFirst({
      where: eq(sessions.id, sessionId)
    });
    
    if (!sessionExists) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    const [newPageView] = await db.insert(pageViews).values({
      sessionId,
      pagePath,
      enteredAt: istTime.toISOString(),
      isReplay,
      durationMs: 0,
    }).returning({ id: pageViews.id });

    if (isReplay) {
      for (const view of existingViews) {
         await db.update(pageViews)
           .set({ replayCount: (view.replayCount || 0) + 1 })
           .where(eq(pageViews.id, view.id));
      }
    }

    return NextResponse.json({ pageViewId: newPageView.id, isReplay }, { status: 201 });
  } catch (error) {
    console.error('Analytics pageview POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    return handlePatch(body);
  } catch (error) {
    console.error('Analytics pageview PATCH error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handlePatch(body: any) {
  const { pageViewId, exitedAt, durationMs } = body;
  if (!pageViewId) {
    return NextResponse.json({ error: 'Missing pageViewId' }, { status: 400 });
  }

  const exitTime = exitedAt ? new Date(new Date(exitedAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })) : new Date();

  await db.update(pageViews)
    .set({
      exitedAt: exitTime.toISOString(),
      durationMs: durationMs || 0
    })
    .where(eq(pageViews.id, pageViewId));

  return NextResponse.json({ success: true });
}
