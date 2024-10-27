'use server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

export default async function getImageURL() {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return null;
  }
  // console.log(session.user.email + " is the email");
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  // console.log(user + " is the image url");
  if (!user) return null;
  return user.imageUrl;
}
