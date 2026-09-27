import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const sessionId = uuidv4();
    
    // Convert current time to IST
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    await db.insert(sessions).values({
      id: sessionId,
      ipAddress: ip,
      userAgent: userAgent,
      startedAt: istTime.toISOString(),
      lastActiveAt: istTime.toISOString(),
    });

    return NextResponse.json({ sessionId }, { status: 201 });
  } catch (error) {
    console.error('Analytics session error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
