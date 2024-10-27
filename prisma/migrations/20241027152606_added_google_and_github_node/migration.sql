-- CreateEnum
CREATE TYPE "ServiceName" AS ENUM ('GoogleMail', 'GoogleDrive', 'GoogleClassroom', 'GoogleForms');

-- CreateTable
CREATE TABLE "GoogleNode" (
    "id" TEXT NOT NULL,
    "NodeId" TEXT NOT NULL,
    "isTrigger" BOOLEAN NOT NULL,
    "ServiceName" "ServiceName" NOT NULL,
    "GoogleDriveTriggersWhen" TEXT,
    "GoogleDriveTriggersMimeType" TEXT,
    "GoogleDriveTriggerFolderPath" TEXT,
    "GoogleDriveTriggerFolderId" TEXT,
    "GoogleDriveActionType" TEXT,
    "GoogleDriveActionFileId" TEXT,
    "GoogleDriveActionFileName" TEXT,
    "GoogleDriveActionFolderId" TEXT,
    "GoogleDriveActionFolderName" TEXT,
    "GoogleDriveActionNewName" TEXT,
    "GoogleDriveActionContent" TEXT,
    "GoogleDriveActionIsPublic" BOOLEAN,
    "GoogleDriveActionSourceFolderId" TEXT,
    "GoogleDriveActionDestinationFolderId" TEXT,

    CONSTRAINT "GoogleNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubNode" (
    "id" TEXT NOT NULL,
    "NodeId" TEXT NOT NULL,
    "GithubTriggersWhen" TEXT,
    "GithubTriggerRepoName" TEXT,
    "GithubTriggerRepoOwner" TEXT,
    "GithubActionType" TEXT,
    "GithubActionRepoName" TEXT,
    "GithubActionRepoOwner" TEXT,
    "GithubActionBranchName" TEXT,
    "GithubActionGistDescription" TEXT,
    "GithubActionGistName" TEXT,
    "GithubActionGistBody" TEXT,
    "GitHubActionisPublic" TEXT,
    "GithubActionIssueTitle" TEXT,
    "GithubActionIssueBody" TEXT,
    "GithubActionPRTitle" TEXT,
    "GithubActionPRBody" TEXT,

    CONSTRAINT "GithubNode_pkey" PRIMARY KEY ("id")
);
