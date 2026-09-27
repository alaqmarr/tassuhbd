import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { memories } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { asc, eq } from 'drizzle-orm';

// GET - Fetch all memories (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    let allMemories;
    
    if (target === 'journal') {
      allMemories = await db.select().from(memories).where(eq(memories.showInJournal, true)).orderBy(asc(memories.order));
    } else if (target === 'timeline') {
      allMemories = await db.select().from(memories).where(eq(memories.showInTimeline, true)).orderBy(asc(memories.order));
    } else {
      allMemories = await db.select().from(memories).orderBy(asc(memories.order));
    }

    // Parse the photos JSON string for each memory
    const parsed = allMemories.map(m => ({
      ...m,
      photos: JSON.parse(m.photos || '[]')
    }));
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Failed to fetch memories', error);
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
  }
}

// POST - Create a new memory (admin only)
export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const result = await db.insert(memories).values({
      title: body.title,
      description: body.description || null,
      date: body.date,
      emoji: body.emoji || null,
      photos: JSON.stringify(body.photos || []),
      order: body.order || 0,
      type: body.type || 'milestone',
      quote: body.quote || null,
      showInJournal: body.showInJournal ?? true,
      showInTimeline: body.showInTimeline ?? true,
    }).returning();
    
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to create memory', error);
    return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
  }
}
