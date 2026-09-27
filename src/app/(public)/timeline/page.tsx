import { db } from '@/lib/db';
import { memories } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { TimelineClient } from './TimelineClient';

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  const allMemories = await db
    .select()
    .from(memories)
    .where(eq(memories.showInTimeline, true))
    .orderBy(asc(memories.order));

  const parsedMemories = allMemories.map(m => ({
    ...m,
    id: m.id.toString(),
    photos: JSON.parse(m.photos || '[]')
  }));

  return <TimelineClient memories={parsedMemories} />;
}
