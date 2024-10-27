import { NextResponse } from 'next/server';
import { createAndSendDraftEmail } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await createAndSendDraftEmail(data);

  return NextResponse.json(result);
}
