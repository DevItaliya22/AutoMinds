import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { ServiceName } from '@prisma/client';

type GoogleData = {
    isTrigger : boolean,
    triggerAction : string,
    triggerLabel : string,
    actionLabel : string,
    actionEmail : string,
    actionSubject : string,
    actionBody : string,
    actionEmailTo : string,
};

export async function POST(
  request: NextRequest,
  { params }: { params: { nodeId: string; workFlowSegment: string } },
) {
  const { nodeId, workFlowSegment } = params;
  const data: GoogleData = await request.json();
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

  const workflow = await prisma.googleNode.update({
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
        ServiceName : ServiceName.GoogleMail,

        GmailTriggerLabel :data.isTrigger && "triggerLabel" in data  ? data.triggerLabel:null,
        GmailTriggersWhen : data.isTrigger && "triggerAction" in data  ?  data.triggerAction :null,

        GmailActionLabel : !data.isTrigger && "actionLabel" in data  ?  data.actionLabel : null,
        GmailActionEmail : !data.isTrigger && "actionEmail" in data  ?  data.actionEmail : null,
        GmailActionSubject : !data.isTrigger && "actionSubject" in data  ?  data.actionSubject : null,
        GmailActionBody : !data.isTrigger && "actionBody" in data  ?  data.actionBody : null,
        GmailactionTo : !data.isTrigger && "actionEmailTo" in data  ?  data.actionEmailTo : null
    },
  });
  console.log(workflow);
    return NextResponse.json({ success: true, message: 'Success', nodeId });
}
