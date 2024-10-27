'use server';
// const { PrismaClient } = require("@prisma/client");

// // @ts-expect-error
// const prisma = new PrismaClient();

import prisma from '../src/lib/db';

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe2',
      email: 'jo2hn.doe@example.com',
      imageUrl: 'https://example.com/johndoe.jpg',
      AccessToken: {
        create: {
          GoogleAccessToken: 'google-token-123',
          GoogleAccessTokenExpireAt: new Date(),
          GithubAccessToken: 'github-token-123',
        },
      },
    },
  });

  const workflow = await prisma.workflow.create({
    data: {
      name: 'Sample Workflow 2',
      description: 'This is a sample workflow',
      userId: user.id,
    },
  });

  const node1 = await prisma.node.create({
    data: {
      name: 'Google Node',
      description: 'This node is for Google',
      type: 'Google',
      workflowId: workflow.id,
      positionX: 10,
      positionY: 20,
      workerType: 'Trigger',
    },
  });

  const node2 = await prisma.node.create({
    data: {
      name: 'Github Node',
      description: 'This node is for Github',
      type: 'Github',
      workflowId: workflow.id,
      positionX: 30,
      positionY: 40,
      workerType: 'Action',
    },
  });

  await prisma.edge.create({
    data: {
      sourceId: node1.id,
      targetId: node2.id,
      workflowId: workflow.id,
    },
  });

  console.log('Seeding completed');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
