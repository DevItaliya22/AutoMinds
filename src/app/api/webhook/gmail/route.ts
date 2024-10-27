import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data: encodedData } = body.message;

  // Decode the base64-encoded data
  const decodedData = Buffer.from(encodedData, 'base64').toString('utf-8');

  // Parse the JSON string
  const emailInfo = JSON.parse(decodedData);

  // Extract email address
  const emailAddress = emailInfo.emailAddress; // Adjust based on the actual decoded structure
  const historyId = emailInfo.historyId;

  console.log('Email Address:', emailAddress);
  console.log('History ID:', historyId);

  return NextResponse.json({ status: 'success', emailAddress, historyId });
}
