import { NextResponse } from 'next/server';
import { deleteEmail } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await deleteEmail(data);

  return NextResponse.json(result);
}
