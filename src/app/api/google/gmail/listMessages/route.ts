import { NextResponse } from 'next/server';
import { ListEmails } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await ListEmails(data.maxResults);

  return NextResponse.json(result);
}
