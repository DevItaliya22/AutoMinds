import { NextResponse } from 'next/server';
import { searchEmails } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await searchEmails(data);

  return NextResponse.json(result);
}
