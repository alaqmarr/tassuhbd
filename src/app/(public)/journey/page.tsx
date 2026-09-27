import { db } from '@/lib/db';
import { memories } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { JourneyClient } from '@/components/scrapbook/JourneyClient';

export const dynamic = 'force-dynamic';

export default async function JourneyPage() {
  const allMemories = await db
    .select()
    .from(memories)
    .where(eq(memories.showInJournal, true))
    .orderBy(asc(memories.order));

  const parsedMemories = allMemories.map(m => ({
    ...m,
    photos: JSON.parse(m.photos || '[]')
  }));

  return <JourneyClient memories={parsedMemories} />;
}
