import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { ServiceName } from '@prisma/client';

type GitHubActionData = {
  action: string;
  repository: string;
  title: string;
  body: string;
  branch: string;
  fileName: string;
  isPublic: boolean;
  isTrigger: boolean;
  description: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { nodeId: string; workFlowSegment: string } },
) {
  const { nodeId, workFlowSegment } = params;
  const data: GitHubActionData = await request.json();
  const session = await getServerSession();

  console.log(data);

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 },
    );
  }

  const githubNode = await prisma.githubNode.update({
    where: {
      nodeId,
      node: {
        workflowId: workFlowSegment,
        workflow: {
          userId: user.id,
        },
      },
    },
    data: {
      isTrigger: data.isTrigger,

      GithubTriggersWhen: data.isTrigger ? data.action : null,
      GithubTriggerRepoName: data.isTrigger
        ? data.repository.split('/')[1]
        : null,
      GithubTriggerRepoOwner: data.isTrigger
        ? data.repository.split('/')[0]
        : null,

      GithubActionType: !data.isTrigger ? data.action : null,
      GithubActionRepoName: !data.isTrigger
        ? data.repository.split('/')[1]
        : null,
      GithubActionRepoOwner: !data.isTrigger
        ? data.repository.split('/')[0]
        : null,
      GithubActionBranchName: !data.isTrigger ? data.branch : null,
      GithubActionGistDescription: !data.isTrigger ? data.description : null,
      GithubActionGistName: data.fileName,
      GithubActionGistBody: data.body,
      GitHubActionisPublic: data.isPublic,
      GithubActionIssueBody: data.body,
      GithubActionIssueTitle: data.title,
      GithubActionPRBody: data.body,
      GithubActionPRTitle: data.title,
    },
  });

  return NextResponse.json({ success: true, message: 'Success', nodeId });
}
