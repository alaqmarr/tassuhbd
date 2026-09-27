import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sessions, pageViews } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq, inArray } from 'drizzle-orm';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = await params;
  
  try {
    // Delete page views associated with the session
    await db.delete(pageViews).where(eq(pageViews.sessionId, id));
    
    // Delete the session
    await db.delete(sessions).where(eq(sessions.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete session:", error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
