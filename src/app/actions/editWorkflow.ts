'use server';
import prisma from '@/lib/db';
import { Workflow } from '@prisma/client';
import { getServerSession } from 'next-auth';

export async function editWorkflow(data: {
  id: string;
  name: string;
  description: string;
}): Promise<string | Workflow> {
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

  const workFlow = await prisma.workflow.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      description: data.description,
    },
  });

  console.log('Edited', workFlow.id);
  return workFlow;
}
