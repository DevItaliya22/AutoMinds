import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const event = req.headers.get('x-github-event');
  console.log(event);
  return NextResponse.json({ message: 'Webhook received successfully' });
};
