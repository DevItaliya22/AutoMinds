'use server';
import { NextResponse } from 'next/server';
import { createFile } from '@/app/api/google';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const response = await createFile(data);

    if (response.error) {
      return NextResponse.json({ error: response.error }, { status: 401 });
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create file' },
      { status: 500 },
    );
  }
}
// const data = {
//   name: 'test',
//   mimeType: 'text/html',
//   body: 'Hello World',
// };

// try {
//   const res = await fetch('http://localhost:3000/api/google/drive/createFile', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });

//   const result = await res.json();
//   console.log(result);
// } catch (error) {
//   console.error('Error:', error);
// }
