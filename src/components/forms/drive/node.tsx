'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { GoogleDriveAction } from '@/lib/types';

interface ActionOption {
  value: GoogleDriveAction;
  label: string;
  description: string;
}

const actionOptions: ActionOption[] = [
  {
    value: 'copyFile',
    label: 'Copy File',
    description: 'Create a copy of the specified file.',
  },
  {
    value: 'createFile',
    label: 'Create File From Text',
    description: 'Create a new file from plain text.',
  },
  {
    value: 'createFolder',
    label: 'Create Folder',
    description: 'Create a new, empty folder.',
  },
  {
    value: 'deleteFile',
    label: 'Delete File',
    description: 'Delete a file in Google Drive.',
  },
  {
    value: 'moveFile',
    label: 'Move File',
    description: 'Move a file from one folder to another.',
  },
  {
    value: 'updateName',
    label: 'Update File/Folder Name',
    description: 'Update the name of a file or folder.',
  },
];

type Props = {
  steps: number;
};

export default function GoogleDriveAction({ steps }: Props) {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>();
  const router = useRouter();
  const path = `/workflows/${workFlowSegment}?step=${steps}`;

  const [action, setAction] = useState<GoogleDriveAction | ''>('');
  const [fileId, setFileId] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [folderName, setFolderName] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [sourceFolderId, setSourceFolderId] = useState<string>('');
  const [destinationFolderId, setDestinationFolderId] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);

  return (
    <div className="bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">Google Drive Action</h1>

        <div className="space-y-6">
          <div>
            <Label htmlFor="action" className="text-lg font-semibold">
              Select an action:
            </Label>
            <Select
              onValueChange={(value) => setAction(value as GoogleDriveAction)}
              value={action}
            >
              <SelectTrigger id="action" className="w-full mt-2">
                <SelectValue placeholder="Choose an action" />
              </SelectTrigger>
              <SelectContent>
                {actionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                      <div>{option.label} ( {option.description} )</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(action === 'copyFile' ||
            action === 'deleteFile' ||
            action === 'replaceFile' ||
            action === 'updateName') && (
            <div>
              <Label htmlFor="fileId" className="text-lg font-semibold">
                File ID:
              </Label>
              <Input
                id="fileId"
                placeholder="Enter file ID"
                className="w-full mt-2"
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
              />
            </div>
          )}

          {(action === 'createFile' ||
            action === 'createFolder' ||
            action === 'updateName' ||
            action === 'uploadFile') && (
            <div>
              <Label htmlFor="fileName" className="text-lg font-semibold">
                File/Folder Name:
              </Label>
              <Input
                id="fileName"
                placeholder="Enter file or folder name"
                className="w-full mt-2"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
          )}

          {action === 'createFile' && (
            <div>
              <Label htmlFor="fileContent" className="text-lg font-semibold">
                File Content:
              </Label>
              <Textarea
                id="fileContent"
                placeholder="Enter file content"
                className="w-full mt-2"
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
              />
            </div>
          )}

          {action === 'moveFile' && (
            <>
              <div>
                <Label
                  htmlFor="sourceFolderId"
                  className="text-lg font-semibold"
                >
                  Source Folder ID:
                </Label>
                <Input
                  id="sourceFolderId"
                  placeholder="Enter source folder ID"
                  className="w-full mt-2"
                  value={sourceFolderId}
                  onChange={(e) => setSourceFolderId(e.target.value)}
                />
              </div>
              <div>
                <Label
                  htmlFor="destinationFolderId"
                  className="text-lg font-semibold"
                >
                  Destination Folder ID:
                </Label>
                <Input
                  id="destinationFolderId"
                  placeholder="Enter destination folder ID"
                  className="w-full mt-2"
                  value={destinationFolderId}
                  onChange={(e) => setDestinationFolderId(e.target.value)}
                />
              </div>
            </>
          )}

          {action === 'retrieveFiles' && (
            <div>
              <Label htmlFor="query" className="text-lg font-semibold">
                Query:
              </Label>
              <Input
                id="query"
                placeholder="Enter search query"
                className="w-full mt-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}

          {(action === 'createFile' || action === 'uploadFile') && (
            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label
                htmlFor="public"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Make file public
              </Label>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            variant="default"
            className="w-full md:w-auto px-8 py-2 text-lg"
            onClick={() => router.push(path)}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
