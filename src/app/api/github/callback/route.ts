import { NextResponse } from 'next/server';
import axios from 'axios';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const session = await getServerSession();

  const BASE_URL = process.env.NEXT_PUBLIC_URL;

  if (!session || !session.user?.email) {
    return NextResponse.redirect(`${BASE_URL}/auth/signin`);
  }

  if (!code) {
    return NextResponse.redirect(`${BASE_URL}/?error=missing_code`);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = `${BASE_URL}/api/github/callback`;

  let user = null;
  try {
    user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
  } catch (error) {
    console.log('User not found');
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const accessToken = tokenResponse.data.access_token;
    console.log(tokenResponse.data);

    if (!accessToken) {
      return NextResponse.redirect(`${BASE_URL}/?error=invalid_token`);
    }

    if (!user) {
      return NextResponse.redirect(`${BASE_URL}/auth/signin`);
    }

    const res = await prisma.accessToken.update({
      where: {
        userId: user.id,
      },
      data: {
        GithubAccessToken: accessToken,
      },
    });

    return NextResponse.redirect(`${BASE_URL}/connections`);
  } catch (error) {
    return NextResponse.redirect(`${BASE_URL}/?error=github_auth_failed`);
  }
}
