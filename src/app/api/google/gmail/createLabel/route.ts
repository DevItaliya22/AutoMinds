import { NextResponse } from 'next/server';
import { createLabel } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await createLabel(data);

  return NextResponse.json(result);
}
