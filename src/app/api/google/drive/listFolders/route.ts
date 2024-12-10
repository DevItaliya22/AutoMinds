import { NextResponse } from 'next/server';
import { listFolders } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();
  const result = await listFolders(data);
  return NextResponse.json(result);
}
