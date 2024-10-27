import { NextResponse } from 'next/server';
import { ListLabels } from '@/app/api/google';

export async function GET(request: Request) {
  const result = await ListLabels();

  return NextResponse.json(result);
}
