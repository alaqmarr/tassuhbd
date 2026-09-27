import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { count } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// POST - Create the first admin account (only works when no admins exist)
export async function POST(request: Request) {
  try {
    // Check if any admin already exists
    const [result] = await db.select({ total: count() }).from(adminUsers);
    
    if (result.total > 0) {
      return NextResponse.json(
        { error: 'Setup already completed. An admin account already exists.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the admin user
    const [admin] = await db.insert(adminUsers).values({
      email,
      passwordHash,
      name,
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully! You can now log in.',
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin account.' },
      { status: 500 }
    );
  }
}

// GET - Check if setup is needed
export async function GET() {
  try {
    const [result] = await db.select({ total: count() }).from(adminUsers);
    
    return NextResponse.json({
      setupRequired: result.total === 0,
      message: result.total === 0 
        ? 'No admin account found. Please create one.' 
        : 'Setup already completed.',
    });
  } catch (error) {
    // If the table doesn't exist yet, setup is needed
    return NextResponse.json({
      setupRequired: true,
      message: 'Database not initialized. Please create an admin account.',
    });
  }
}
