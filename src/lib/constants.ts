import { Database, Github, Mailbox } from 'lucide-react';
import { Connection } from './types';

export const CONNECTIONS: Connection[] = [
  {
    title: 'Google',
    description: 'Connect your google drive to listen to folder changes',
    image: '/google.png',
  },
  // {
  //   title: 'Discord',
  //   description: 'Connect your discord to send notification and messages',
  //   image: '/discord.png'
  // },
  // {
  //   title: 'Notion',
  //   description: 'Create entries in your notion dashboard and automate tasks.',
  //   image: '/notion.png',
  // },
  {
    title: 'Github',
    description:
      'Use github to check for multiple things like PRs, issues, etc.',
    image: '/github.png',
  },
];

export const MimeType = {
  TEXT: 'text/plain',
  HTML: 'text/html',
  MARKDOWN: 'text/markdown',
  CSV: 'text/csv',
  LATEX: 'application/x-latex',
  WORD: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  GOOGLE_SHEET: 'application/vnd.google-apps.spreadsheet',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  POWERPOINT:
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

// Here every node which have google as dependency is should be of type "Google"

type TriggerOrActionNodeReactType = {
  type: 'Google' | 'Github';
  subType: 'Google Drive' | 'Gmail' | 'Github';
  label: string;
  icon: any;
}[];

export const TriggerNodes: TriggerOrActionNodeReactType = [
  { type: 'Google', subType: 'Google Drive', label: 'Google Drive Trigger', icon: Database },
  { type: 'Github', subType: 'Github', label: 'GitHub Trigger', icon: Github },
  { type: 'Google', subType: 'Gmail', label: 'Gmail Trigger', icon: Mailbox },
];

export const ActionNodes: TriggerOrActionNodeReactType = [
  { type: 'Google', subType: 'Google Drive', label: 'Google Drive Action', icon: Database },
  { type: 'Github', subType: 'Github', label: 'GitHub Action', icon: Github },
  { type: 'Google', subType: 'Gmail', label: 'Gmail Action', icon: Mailbox },
];