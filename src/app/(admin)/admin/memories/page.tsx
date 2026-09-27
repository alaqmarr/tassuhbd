import { db } from '@/lib/db';
import { memories } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { ManageMemoriesClient } from './ManageMemoriesClient';

export const dynamic = 'force-dynamic';

export default async function ManageMemoriesPage() {
  const allMemories = await db
    .select()
    .from(memories)
    .orderBy(asc(memories.order));

  const parsedMemories = allMemories.map(m => ({
    ...m,
    photos: JSON.parse(m.photos || '[]')
  }));

  return <ManageMemoriesClient initialMemories={parsedMemories} />;
}
