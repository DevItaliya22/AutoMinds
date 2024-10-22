import { Connection } from "./types";

export const CONNECTIONS: Connection[] = [
    {
      title: 'Google',
      description: 'Connect your google drive to listen to folder changes',
      image: '/google.png'
    },
    {
      title: 'Discord',
      description: 'Connect your discord to send notification and messages',
      image: '/discord.png'
    },
    {
      title: 'Notion',
      description: 'Create entries in your notion dashboard and automate tasks.',
      image: '/notion.png',
    },
    {
      title: 'Github',
      description:
        'Use github to check for multiple things like PRs, issues, etc.',
      image: '/github.png'
    }
]

export const MimeType = {
  TEXT: 'text/plain',
  HTML: 'text/html',
  MARKDOWN: 'text/markdown',
  CSV: 'text/csv',
  LATEX: 'application/x-latex',
  WORD: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  GOOGLE_SHEET: 'application/vnd.google-apps.spreadsheet',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  POWERPOINT: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};