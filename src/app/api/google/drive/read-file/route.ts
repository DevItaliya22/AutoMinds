import { NextResponse } from 'next/server';
import { readFile } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await readFile(data);

  return NextResponse.json(result);
}
