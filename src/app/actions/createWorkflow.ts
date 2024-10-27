'use server';

import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function createWorkflow(data: {
  name: string;
  description: string;
}) {
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

  const existingWorkflow = await prisma.workflow.findUnique({
    where: {
      name_userId: {
        name: data.name,
        userId: user.id,
      },
    },
  });

  if (existingWorkflow) {
    return 'Workflow with the same name already exists';
  }

  const workFlow = await prisma.workflow.create({
    data: {
      name: data.name,
      description: data.description,
      status: 'draft',
      lastRun: null,
      userId: user.id,
    },
  });

  console.log(workFlow.id);
  return workFlow;
}
