import { NextResponse } from 'next/server';
import { getAllfiles } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await getAllfiles(data);

  return NextResponse.json(result);
}

//  const res = await fetch('/api/google/drive/getAllFiles', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ pageSize }),
//   });

//   const result = await res.json();
//   console.log(result);
//   setFiles(result.files || []);
