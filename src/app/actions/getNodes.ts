'use server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function getNodes({ workflowId }: { workflowId: string }) {
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

  const workFlow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
    include: {
      nodes: true,
    },
  });

  if (!workFlow) {
    return null;
  }

  return workFlow.nodes;
}
