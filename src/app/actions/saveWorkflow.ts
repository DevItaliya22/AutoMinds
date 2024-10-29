'use server';
import prisma from '@/lib/db';
import { Edge, Node, NodeType, ServiceName, WorkerType } from '@prisma/client';
import { getServerSession } from 'next-auth';

type Nodes = {
  id: string;
  name: string;
  description: string;
  type: string;
  workerType: string;
  positionX: number;
  positionY: number;
}[];
type Edges = {
  id: string;
  sourceId: string;
  targetId: string;
}[];

export async function saveWorkflow(data: {
  workflowId: string;
  nodes: Nodes;
  edges: Edges;
}) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return 'Unauthorized';
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return 'Unauthorized';

  const workflow = await prisma.workflow.findUnique({
    where: { id: data.workflowId },
    include: { nodes: true, edges: true },
  });

  if (!workflow) return 'Workflow not found';

  for (const dataNode of data.nodes) {
    // console.log(dataNode);
    await prisma.node.upsert({
      where: {
        id: dataNode.id.includes('-') ? dataNode.id.split('-')[1] : dataNode.id,
      },
      create: {
        id: dataNode.id.includes('-') ? dataNode.id.split('-')[1] : dataNode.id,
        name: dataNode.name,
        description: dataNode.description,
        type: dataNode.id.includes('Google') || dataNode.id.includes('Gmail')
          ? NodeType.Google
          : NodeType.Github,
        workflowId: data.workflowId,
        positionX: dataNode.positionX,
        positionY: dataNode.positionY,
        workerType:
          dataNode.workerType.toLowerCase() === 'trigger'
            ? WorkerType.Trigger
            : WorkerType.Action,
        googleNode : dataNode.id.includes('Google') || dataNode.id.includes('Gmail') ? {
          create : {
            ServiceName : dataNode.name.includes('Drive') ? ServiceName.GoogleDrive : ServiceName.GoogleMail,
            isTrigger : dataNode.workerType.toLowerCase() === 'trigger' ? true : false,
          }
        } : undefined ,
        githubNode : dataNode.id.includes('Github') ? {
          create : {
              isTrigger : dataNode.workerType.toLowerCase() === 'trigger' ? true : false,
          }
        } : undefined
      },
      update: {
        positionX: dataNode.positionX,
        positionY: dataNode.positionY,
      },
    });
  }

  for (const dataEdge of data.edges) {
    // console.log(dataEdge);
    await prisma.edge.upsert({
      where: { id: dataEdge.id },
      create: {
        id: dataEdge.id,
        sourceId: dataEdge.sourceId.includes('-')
          ? dataEdge.sourceId.split('-')[1]
          : dataEdge.sourceId,
        targetId: dataEdge.targetId.includes('-')
          ? dataEdge.targetId.split('-')[1]
          : dataEdge.targetId,
        workflowId: data.workflowId,
      },
      update: {
        sourceId: dataEdge.sourceId.includes('-')
          ? dataEdge.sourceId.split('-')[1]
          : dataEdge.sourceId,
        targetId: dataEdge.targetId.includes('-')
          ? dataEdge.targetId.split('-')[1]
          : dataEdge.targetId,
      },
    });
  }

  return 'Workflow saved successfully';
}
