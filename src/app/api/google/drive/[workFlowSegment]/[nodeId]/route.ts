import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { ServiceName } from '@prisma/client';

type GoogleDriveActionData = {
  action: string;
  fileId: string;
  fileName: string;
  folderName: string;
  fileContent: string;
  sourceFolderId: string;
  destinationFolderId: string;
  query: string;
  isPublic: boolean;
  isTrigger: boolean;
};

type GoogleDriveTriggerData = {
  action: string;
  selectedFolder: string;
  folderPath: string[];
  selectedFileType: string;
  isTrigger: boolean;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { nodeId: string; workFlowSegment: string } },
) {
  try {
    const { nodeId, workFlowSegment } = params;
    const data: GoogleDriveActionData | GoogleDriveTriggerData =
      await request.json();
    const session = await getServerSession();

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

    const googleDriveNode = await prisma.googleNode.update({
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
        ServiceName: ServiceName.GoogleDrive,

        GoogleDriveTriggerFolderPath:
          data.isTrigger && 'folderPath' in data
            ? data.folderPath.join('/')
            : null,
        GoogleDriveTriggerFolderId:
          data.isTrigger && 'selectedFolder' in data ? data.selectedFolder : null,
        GoogleDriveTriggersMimeType:
          data.isTrigger && 'selectedFileType' in data
            ? data.selectedFileType
            : null,
        GoogleDriveTriggersWhen:
          data.isTrigger && 'action' in data ? data.action : null,

        GoogleDriveActionType:
          !data.isTrigger && 'action' in data ? data.action : null,
        GoogleDriveActionFileId:
          !data.isTrigger && 'fileId' in data ? data.fileId : null,
        GoogleDriveActionFileName:
          !data.isTrigger && 'fileName' in data ? data.fileName : null,
        GoogleDriveActionFolderId:
          !data.isTrigger && 'folderName' in data ? data.folderName : null,
        GoogleDriveActionFolderName:
          !data.isTrigger && 'folderName' in data ? data.folderName : null,
        GoogleDriveActionContent:
          !data.isTrigger && 'fileContent' in data ? data.fileContent : null,
        GoogleDriveActionIsPublic:
          !data.isTrigger && 'isPublic' in data ? data.isPublic : null,
        GoogleDriveActionSourceFolderId:
          !data.isTrigger && 'sourceFolderId' in data
            ? data.sourceFolderId
            : null,
        GoogleDriveActionDestinationFolderId:
          !data.isTrigger && 'destinationFolderId' in data
            ? data.destinationFolderId
            : null,
      },
    });

    return NextResponse.json({ success: true, message: 'Success', nodeId });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
