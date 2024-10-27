'use server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

export default async function getWorkflows() {
  const session = await getServerSession();
  if (!session || !session.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      Workflows: true,
    },
    cacheStrategy: {
      ttl: 60,
      swr: 60,
    },
  });

  if (!user) {
    return null;
  }

  const workflows = user.Workflows.map((workflow) => ({
    ...workflow,
    lastRun: workflow?.lastRun ? workflow?.lastRun : null,
  }));

  return workflows;
}
