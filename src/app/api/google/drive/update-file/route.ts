import { NextResponse } from 'next/server';
import { updateFile } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await updateFile(data);

  return NextResponse.json(result);
}
