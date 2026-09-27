import { db } from '@/lib/db';
import { memories } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import { GalleryClient } from './GalleryClient';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const allMemories = await db
    .select()
    .from(memories)
    .orderBy(asc(memories.order));

  const extractedPhotos: any[] = [];
  allMemories.forEach(memory => {
    const photos = JSON.parse(memory.photos || '[]');
    if (photos && Array.isArray(photos)) {
      photos.forEach((url: string, i: number) => {
        extractedPhotos.push({
          id: `${memory.id}-${i}`,
          url,
          caption: memory.title,
          date: new Date(memory.date).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' })
        });
      });
    }
  });

  return <GalleryClient photos={extractedPhotos} />;
}
