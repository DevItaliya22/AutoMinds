'use server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

export default async function getConnections() {
  const session = await getServerSession();
  const arr: string[] = [];

  if (!session || !session.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) return arr;

  const accessToken = await prisma.accessToken.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!accessToken) return arr;

  if (accessToken.GoogleAccessToken !== '') {
    arr.push('Google');
  }
  if (accessToken.GithubAccessToken !== '') {
    arr.push('Github');
  }

  return arr;
}
