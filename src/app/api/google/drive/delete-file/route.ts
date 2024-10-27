import { NextResponse } from 'next/server';
import { deleteFile } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await deleteFile(data);

  return NextResponse.json(result);
}

// const res = await fetch('/api/google/drive/delete-file', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ fileId }),
//   });

//   const result = await res.json();
//   console.log(result);
