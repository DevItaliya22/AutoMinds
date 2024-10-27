// app/api/user/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const dummyUser = {
      name: 'Dummy User',
      GoogleId: 'dummy-google-id',
    };

    const users = await prisma.user.findMany({
      cacheStrategy: {
        ttl: 60,
        swr: 60,
      },
    });
    console.log('User created:', users);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 },
    );
  }
}
