'use server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function deleteWorkflow(id: string): Promise<string> {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return 'Session not found';
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return 'User not found';
  }

  const transaction = await prisma.$transaction(async (tx) => {
    await tx.edge.deleteMany({
      where: {
        workflowId: id,
      },
    });
    await tx.node.deleteMany({
      where: {
        workflowId: id,
      },
    });
    await tx.workflow.delete({
      where: {
        id,
      },
    });
    return 'Transaction complete';
  });

  console.log(transaction);
  return 'success';
}
