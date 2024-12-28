'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
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

type GoogleDriveAction = 
  | 'copyFile'
  | 'createFile'
  | 'createFolder'
  | 'deleteFile'
  | 'moveFile'
  | 'updateName';

interface DriveItem {
  id: string;
  name: string;
}

const actionOptions = [
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
  nodeId: string;
  isLast: boolean;
};

export default function GoogleDriveAction({ steps, nodeId, isLast }: Props) {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>();
  const router = useRouter();
  const path = isLast ?`/workflows/${workFlowSegment}?step=${steps-1}` : `/workflows/${workFlowSegment}?step=${steps}`;

  const [files, setFiles] = useState<DriveItem[]>([]);
  const [folders, setFolders] = useState<DriveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [action, setAction] = useState<GoogleDriveAction | ''>('');
  const [fileId, setFileId] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [folderName, setFolderName] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [sourceFolderId, setSourceFolderId] = useState<string>('');
  const [destinationFolderId, setDestinationFolderId] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filesRes, foldersRes] = await Promise.all([
          axios.post("/api/google/drive/getAllFiles", { pageSize: 20 }),
          axios.post("/api/google/drive/listFolders", { pageSize: 20, parentFolderId: "" })
        ]);

        setFiles(filesRes.data.files || []);
        setFolders(foldersRes.data.folders || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching drive data:', err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/google/drive/getAllData?nodeId=${nodeId}`);
        const data = res.data.data;

        setAction(data.GoogleDriveActionType || '');
        setFileId(data.GoogleDriveActionFileId || '');
        setFileName(data.GoogleDriveActionFileName || '');
        setFolderName(data.GoogleDriveActionFolderName || '');
        setFileContent(data.GoogleDriveActionContent || '');
        setSourceFolderId(data.GoogleDriveActionSourceFolderId || '');
        setDestinationFolderId(data.GoogleDriveActionDestinationFolderId || '');
        setIsPublic(data.GoogleDriveActionIsPublic || false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    getData();
  }, [nodeId]);

  const handleSave = async () => {
    const data = {
      action,
      fileId,
      fileName,
      folderName,
      fileContent,
      sourceFolderId,
      destinationFolderId,
      isPublic,
      isTrigger: false,
    };
    const res = await axios.post(
      `/api/google/drive/${workFlowSegment}/${nodeId}`,
      data,
    );
    if (res.data.success) {
      router.push(path);
    }
  };

  const renderFileSelect = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    includeFiles = true,
    includeFolders = false
  ) => {
    const items = [
      ...(includeFiles ? files.map(file => ({
        id: file.id,
        label: `File: ${file.name}`,
      })) : []),
      ...(includeFolders ? folders.map(folder => ({
        id: folder.id,
        label: `Folder: ${folder.name}`,
      })) : []),
    ];

    return (
      <div className="space-y-2">
        <Label htmlFor={label} className="text-lg font-semibold">
          {label}
        </Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={label} className="w-full">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">
          Google Drive Action
        </h1>
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
                    <div>
                      {option.label} ( {option.description} )
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(action === 'copyFile' || action === 'deleteFile') && (
            renderFileSelect('Select File', fileId, setFileId, true, false)
          )}

          {action === 'updateName' && (
            renderFileSelect('Select Item', fileId, setFileId, true, true)
          )}

          {(action === 'createFile' || action === 'createFolder') && (
            <div>
              <Label htmlFor="fileName" className="text-lg font-semibold">
                {action === 'createFile' ? 'File Name:' : 'Folder Name:'}
              </Label>
              <Input
                id="fileName"
                placeholder={`Enter ${action === 'createFile' ? 'file' : 'folder'} name`}
                className="w-full mt-2"
                value={action === 'createFile' ? fileName : folderName}
                onChange={(e) => 
                  action === 'createFile' 
                    ? setFileName(e.target.value)
                    : setFolderName(e.target.value)
                }
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
              {renderFileSelect('Source Folder', sourceFolderId, setSourceFolderId, false, true)}
              {renderFileSelect('Destination Folder', destinationFolderId, setDestinationFolderId, false, true)}
            </>
          )}

          {action === 'createFile' && (
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
            onClick={handleSave}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}