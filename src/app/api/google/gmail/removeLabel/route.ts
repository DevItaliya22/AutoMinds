import { NextResponse } from 'next/server';
import { removeLabel } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await removeLabel(data);

  return NextResponse.json(result);
}
