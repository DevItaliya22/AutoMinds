'use server';
import prisma from '@/lib/db';
import { ConnectionTypes } from '@/lib/types';
import { getServerSession } from 'next-auth';

export default async function removeAccessToken(type: ConnectionTypes) {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return null;
  }

  const accessToken = await prisma.accessToken.update({
    where: {
      userId: user.id,
    },
    data: {
      [`${type}AccessToken`]: '',
    },
  });

  return 'Aceess Token Removed';
}
