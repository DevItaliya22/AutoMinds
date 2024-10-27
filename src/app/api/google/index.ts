'use server';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

async function getGoogleInstance() {
  const session = await getServerSession(authOptions);

  // if (!session || !session.user?.email || !session.accessToken) {
  //   return null;
  // }
  // // console.log('Session : ', session);
  // const access_token = session.accessToken;

  const access_token = '';

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token });

  const drive = google.drive({ version: 'v3', auth });
  const gmail = google.gmail({ version: 'v1', auth });

  return { drive, gmail };
}

//Google watcher
async function watchUser() {
  const googleInstance = await getGoogleInstance();
  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }

  const { gmail } = googleInstance;
  try {
    const res = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        topicName: 'projects/zap-436910/topics/gmail-notifications',
        labelIds: ['INBOX'],
      },
    });

    console.log('Response:', res);
    console.log('Watcher created');
    return { res };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to create watcher' };
  }
}

// Google mail functions
async function addLabel(data: { messageId: string; labelId: string }) {
  const googleInstance = await getGoogleInstance();
  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }
  const { gmail } = googleInstance;

  try {
    const res = await gmail.users.messages.modify({
      userId: 'me',
      id: data.messageId,
      requestBody: {
        addLabelIds: [data.labelId],
      },
    });
    console.log(res);
    console.log('Label added to email');
    return { res };
  } catch (error) {
    console.log(error);
    return { error: 'Failed to add label to email' };
  }
}

async function ListLabels() {
  const googleInstance = await getGoogleInstance();
  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }
  const { gmail } = googleInstance;

  try {
    const response = await gmail.users.labels.list({
      userId: 'me',
    });

    return { labels: response.data.labels };
  } catch (error) {
    return { error: 'Failed to list labels' };
  }
}

async function ListEmails(data: { maxResults: number }) {
  const googleInstance = await getGoogleInstance();
  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }

  const { gmail } = googleInstance;

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: data.maxResults, // Adjust the number of results as needed
    });

    return { messages: response.data };
  } catch (error) {
    return { error: 'Failed to list emails' };
  }
}

async function removeLabel(data: { messageId: string; labelId: string }) {
  const googleInstance = await getGoogleInstance();
  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }
  const { gmail } = googleInstance;

  try {
    const res = await gmail.users.messages.modify({
      userId: 'me',
      id: data.messageId,
      requestBody: {
        removeLabelIds: [data.labelId],
      },
    });
    console.log('Label removed from email');
    return { res };
  } catch (error) {
    console.log('Error removing label from email');
    return { error: 'Failed to remove label from email' };
  }
}

async function createLabel(data: { labelName: string }) {
  const googleInstance = await getGoogleInstance();
  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }
  const { gmail } = googleInstance;

  try {
    const response = await gmail.users.labels.create({
      userId: 'me',
      requestBody: {
        name: data.labelName,
        labelListVisibility: 'labelShow',
        messageListVisibility: 'show',
      },
    });

    return { response };
  } catch (error) {
    return { error: 'Failed to create label' };
  }
}

async function deleteEmail(data: { id: string }) {
  // before this step we need to get the email id , and so we need to get the email id first
  // so we can get id of email by seraching the email by subject or by sender
  const googleInstance = await getGoogleInstance();
  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }
  const { gmail } = googleInstance;
  try {
    const res = await gmail.users.messages.delete({
      userId: 'me',
      id: data.id,
    });
    console.log('Email deleted');
    return { res };
  } catch (error) {
    console.log(error);
    return { error: 'Failed to delete email' };
  }
}

async function sendEmail(data: { to: string; subject: string; body: string }) {
  const googleInstance = await getGoogleInstance();
  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }
  const { gmail } = googleInstance;

  const email = `To: ${data.to}\r\nSubject: ${data.subject}\r\n\r\n${data.body}`;
  const base64EncodedEmail = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: base64EncodedEmail,
      },
    });

    return { response };
  } catch (error) {
    return { error: 'Failed to send email' };
  }
}

async function searchEmails(data: { query: string; maxResults: number }) {
  const googleInstance = await getGoogleInstance();
  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }
  const { gmail } = googleInstance;

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: data.query,
      maxResults: data.maxResults,
    });

    if (!response.data.messages || response.data.messages.length === 0) {
      return { emails: [], message: 'No emails found' };
    }

    // Fetch full details for each message using the message ID
    const emailDetails = await Promise.all(
      response.data.messages.map(async (message) => {
        const messageDetails = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
        });

        return messageDetails.data;
      }),
    );

    return { emails: emailDetails };
  } catch (error) {
    return { error: 'Failed to search emails' };
  }
}

async function createAndSendDraftEmail(data: {
  to: string;
  subject: string;
  body: string;
}) {
  const googleInstance = await getGoogleInstance();
  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }
  const { gmail } = googleInstance;

  const emailContent = `To: ${data.to}\r\nSubject: ${data.subject}\r\n\r\n${data.body}`;

  const encodedMessage = Buffer.from(emailContent)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const draftResponse = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedMessage,
        },
      },
    });

    const draftId = draftResponse.data.id;

    const sendResponse = await gmail.users.drafts.send({
      userId: 'me',
      requestBody: {
        id: draftId,
      },
    });

    return { success: true, draftId: draftId, sendResponse: sendResponse.data };
  } catch (error) {
    console.error('Error creating or sending draft:', error);
    return { error: 'Failed to create and send draft' };
  }
}

// Google drive functions

async function listFolders(data: { pageSize: number }) {
  const googleInstance = await getGoogleInstance();

  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }

  const { drive } = googleInstance;

  try {
    const response = await drive.files.list({
      pageSize: data.pageSize,
      fields: 'files(id, name)',
      q: "mimeType='application/vnd.google-apps.folder'",
    });

    console.log('Folders fetched successfully');
    return { folders: response.data.files };
  } catch (error) {
    console.error('Error fetching folders:');
    return { error: 'Failed to fetch folders' };
  }
}

async function createFile(data: {
  name: string;
  mimeType: string;
  body: string;
}) {
  const googleInstance = await getGoogleInstance();

  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }

  const { drive } = googleInstance;

  const fileMetadata = {
    name: data.name,
    fields: 'id',
  };

  const media = {
    mimeType: data.mimeType,
    body: data.body,
  };

  try {
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log('File created successfully');
    return { file };
  } catch (error) {
    console.error('Error creating file:');
    return { error: 'Failed to create file' };
  }
}

async function deleteFile(data: { fileId: string }) {
  const googleInstance = await getGoogleInstance();

  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }

  const { drive } = googleInstance;
  const fileId = data.fileId;

  if (!fileId) {
    return { error: 'File ID is required' };
  }

  try {
    await drive.files.delete({
      fileId: fileId,
    });

    console.log('File deleted successfully');
    return { message: 'File deleted successfully' };
  } catch (error) {
    console.error('Error deleting file:');
    return { error: 'Failed to delete file' };
  }
}

async function getAllfiles(data: { pageSize: number }) {
  const googleInstance = await getGoogleInstance();

  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }

  const { drive } = googleInstance;

  try {
    const files = await drive.files.list({
      pageSize: data.pageSize,
      fields: 'files(id, name)',
    });

    console.log('Files fetched successfully');
    return { files: files.data.files };
  } catch (error) {
    console.error('Error fetching files:');
    return { error: 'Failed to fetch files' };
  }
}

async function readFile(data: { fileId: string }) {
  const googleInstance = await getGoogleInstance();

  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }
  const { drive } = googleInstance;
  const fileId = data.fileId;
  try {
    const file = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    });

    const content = file.data;

    console.log('File read successfully');
    return { content };
  } catch (error) {
    console.log('Error reading file');
    return { error: 'Failed to read file' };
  }
}

async function updateFile(data: { fileId: string; body: string }) {
  const googleInstance = await getGoogleInstance();

  if (!googleInstance) {
    return { error: 'Unauthorized' };
  }
  const { drive } = googleInstance;

  const fileId = data.fileId;
  const newContent = data.body;

  if (!fileId || !newContent) {
    return { error: 'File ID and new content are required' };
  }

  try {
    const existingFile = await drive.files.get({
      fileId: fileId,
      alt: 'media',
    });

    const existingContent = existingFile.data;
    const updatedContent = existingContent + '\n' + newContent;

    const media = {
      mimeType: 'text/plain',
      body: updatedContent,
    };

    await drive.files.update({
      fileId: fileId,
      media: media,
      fields: 'id',
    });

    console.log('File updated successfully');
    return { message: 'File updated successfully' };
  } catch (error) {
    console.error('Error updating file');
    return { error: 'Failed to update file' };
  }
}

export {
  createFile,
  deleteFile,
  getAllfiles,
  readFile,
  updateFile,
  addLabel,
  removeLabel,
  createLabel,
  deleteEmail,
  searchEmails,
  sendEmail,
  createAndSendDraftEmail,
  getGoogleInstance,
  ListLabels,
  ListEmails,
  listFolders,
  watchUser,
};
