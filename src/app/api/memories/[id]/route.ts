import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { memories } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const memoryId = parseInt(id, 10);
    if (isNaN(memoryId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const memory = await db.select().from(memories).where(eq(memories.id, memoryId));
    if (memory.length === 0) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    const parsed = {
      ...memory[0],
      photos: JSON.parse(memory[0].photos || '[]')
    };

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch memory' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const memoryId = parseInt(id, 10);
    if (isNaN(memoryId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const result = await db.update(memories).set({
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
    }).where(eq(memories.id, memoryId)).returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const memoryId = parseInt(id, 10);
    if (isNaN(memoryId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const result = await db.delete(memories).where(eq(memories.id, memoryId)).returning();
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}
