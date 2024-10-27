import { NextResponse } from 'next/server';
import { sendEmail } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await sendEmail(data);

  return NextResponse.json(result);
}
