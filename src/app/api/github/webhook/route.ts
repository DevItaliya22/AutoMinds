import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const eventType = req.headers.get('x-github-event');

  const rawBody = await req.text();
  let payload;

  try {
    payload = JSON.parse(rawBody);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json(
      { message: 'Invalid JSON payload' },
      { status: 400 },
    );
  }

  // console.log('Parsed Payload:', payload);
  // console.log(req.headers);

  if (eventType) {
    console.log(eventType);
    return NextResponse.json({ message: 'Event received', eventType });
  }

  return NextResponse.json(
    { message: 'Event type not found' },
    { status: 400 },
  );
}
