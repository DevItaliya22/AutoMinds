import { NextResponse } from 'next/server';

function generateRandomString() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export async function POST(req: Request) {
  const { accessToken, folderId } = await req.json();

  console.log(
    'watch folder ======================================================',
  );
  console.log('accessToken:', accessToken);
  console.log('folderId:', folderId);
  console.log(generateRandomString());
  const watchUrl = `https://www.googleapis.com/drive/v3/files/${folderId}/watch`;

  const watchResponse = await fetch(watchUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: `${folderId}`,
      type: 'web_hook',
      address:
        'https://fafa-2405-201-2027-209d-a530-7b16-5d27-37ee.ngrok-free.app/api/webhook/drive',
    }),
  });

  const watchData = await watchResponse.json();

  return NextResponse.json(watchData);
}
