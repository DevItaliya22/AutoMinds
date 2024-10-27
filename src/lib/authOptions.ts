import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './db';
import axios from 'axios';

function isAccessTokenExpired(expirationTime: Date) {
  const currentTime = new Date();
  // console.log('isAccessTokenExpired======================================================');
  // console.log('Current Time:', currentTime);
  // console.log('Expiration Time:', expirationTime);
  // console.log('Is Expired:', expirationTime <= currentTime);
  // console.log('isAccessTokenExpired======================================================');
  return expirationTime <= currentTime;
}

async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      null,
      {
        params: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: token.refreshToken,
          grant_type: 'refresh_token',
        },
      },
    );

    const refreshedTokens = response.data;

    // console.log('refresh token ======================================================');
    //   console.log('Refreshed Tokens:', refreshedTokens);
    // console.log('refresh token ======================================================');

    const user = await prisma.user.findUnique({
      where: {
        email: token.email,
      },
    });

    if (!user) {
      return { ...token, error: 'UserNotFound' };
    }

    await prisma.accessToken.update({
      where: {
        userId: user.id,
      },
      data: {
        GoogleAccessToken: refreshedTokens.access_token,
        GoogleAccessTokenExpireAt: new Date(
          Date.now() + refreshedTokens.expires_in * 1000,
        ), // Store as DateTime
      },
    });

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    // console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            'openid email profile https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/gmail.modify https://mail.google.com/',
          access_type: 'offline',
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at * 1000;
        token.email = profile.email;
        console.log('Token 1 ', account);

        const user = await prisma.user.upsert({
          where: { email: profile.email },
          update: {
            name: profile.name,
            imageUrl: account.provider === 'google' ? profile.picture : '',
            updatedAt: new Date(),
          },
          create: {
            name: profile.name,
            imageUrl: account.provider === 'google' ? profile.picture : '',
            email: profile.email,
          },
        });
        // console.log("User created /  inserted : 2 ", user.id);

        await prisma.accessToken.upsert({
          where: { userId: user.id },
          update: {
            GoogleAccessToken: token.accessToken,
            GoogleAccessTokenExpireAt: new Date(token.accessTokenExpires),
            GoogleRefreshToken: token.refreshToken,
          },
          create: {
            GoogleAccessToken: token.accessToken,
            GoogleAccessTokenExpireAt: new Date(token.accessTokenExpires),
            GoogleRefreshToken: token.refreshToken,
            userId: user.id,
          },
        });
      }
      if (isAccessTokenExpired(new Date(token.accessTokenExpires))) {
        console.log('\n\n\nGoing to find new accesstoken using refresh token\n\n\n');
        return refreshAccessToken(token);
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.email = token.email;
      session.exiperesAt = token.accessTokenExpires;
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url === '/auth/signout') {
        return baseUrl;
      }
      return baseUrl + '/connections';
    },
  },
};
