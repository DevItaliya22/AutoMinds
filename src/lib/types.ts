export type ConnectionTypes =
  | 'Discord'
  | 'Notion'
  | 'Slack'
  | 'Google'
  | 'Github';

export type Connection = {
  title: ConnectionTypes;
  description: string;
  image: string;
};

export type GoogleDriveTriggerActions =
  | 'new'
  | 'newInFolder'
  | 'update'
  | 'trash';

export type GoogleDriveAction =
  | 'copyFile'
  | 'createFile'
  | 'createFolder'
  | 'deleteFile'
  | 'moveFile'
  | 'replaceFile'
  | 'retrieveFiles'
  | 'updateName'
  | 'uploadFile';

export type GitHubAction =
  | 'createGist'
  | 'createIssue'
  | 'createPullRequest'
  | 'deleteBranch';

export type GitHubTrigger =
  | 'newBranch'
  | 'newCollaborator'
  | 'newCommit'
  | 'newCommitComment'
  | 'newIssue'
  | 'newPullRequest'
  | 'newRepoEvent'
  | 'newRepository';
