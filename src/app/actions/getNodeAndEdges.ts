'use server';
import prisma from '@/lib/db';
import { Edge, Node } from '@prisma/client';
import { getServerSession } from 'next-auth';

export async function getNodesAndEdges(data: {
  workflowId: string;
}): Promise<any> {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return 'Unauthorized';
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if (!user) {
    return 'Unauthorized';
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: data.workflowId,
    },
    include: {
      nodes: true,
      edges: true,
    },
  });
  if (!workflow) {
    return 'Workflow not found';
  }

  return { nodes: workflow.nodes, edges: workflow.edges };
}
