'use client';

import { useEffect, useState } from 'react';
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
import { ChevronRight, Folder } from 'lucide-react';
import type { GoogleDriveTriggerActions } from '@/lib/types';
import axios from 'axios';

interface ActionOption {
  value: GoogleDriveTriggerActions;
  label: string;
  description: string;
}

const actionOptions: ActionOption[] = [
  {
    value: 'new',
    label: 'New File',
    description: 'Action will be triggered when new file is added',
  },
  {
    value: 'newInFolder',
    label: 'New file in folder',
    description:
      'Action will be triggered when new file is added in a particular folder',
  },
  {
    value: 'update',
    label: 'Updated file in folder',
    description: 'Action will be triggered when file is updated in folder',
  },
  {
    value: 'trash',
    label: 'Trashed file in folder',
    description: 'Action will be triggered when file is Trashed in folder',
  },
];

const mockFileTypes = [
  { value: 'any', label: 'Any file type' },
  { value: 'document', label: 'Document (*.doc, *.docx, *.txt)' },
  { value: 'spreadsheet', label: 'Spreadsheet (*.xls, *.xlsx, *.csv)' },
  { value: 'presentation', label: 'Presentation (*.ppt, *.pptx)' },
  { value: 'pdf', label: 'PDF (*.pdf)' },
  { value: 'image', label: 'Image (*.jpg, *.png, *.gif)' },
];

type Props = {
  steps: number;
  nodeId: string;
};

type Folder = {
  id: string;
  name: string;
}

export default function GoogleDriveTrigger({ steps, nodeId }: Props) {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>();
  const router = useRouter();
  const path = `/workflows/${workFlowSegment}?step=${steps}`;

  const [action, setAction] = useState<GoogleDriveTriggerActions | ''>('');
  const [selectedFolder, setSelectedFolder] = useState<Folder>({id:'', name:''});
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [selectedFileType, setSelectedFileType] = useState<string>('any');
  const [mockFolders, setMockFolders] = useState<Folder[]>([]);
  const [maxDepthAchieved, setMaxDepthAchieved] = useState(false);

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
    setFolderPath([...folderPath, folder]);
  };

  const handleBackFolder = () => {
    setFolderPath(folderPath.slice(0, -1));
    setSelectedFolder(folderPath[folderPath.length - 2] || {id:'', name:''});
  };

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`/api/google/drive/getAllData?nodeId=${nodeId}`);
      const data = res.data.data;
      
      if (data) {
        setAction(data?.GoogleDriveTriggersWhen as GoogleDriveTriggerActions);
        setSelectedFileType(data.GoogleDriveTriggersMimeType as string);
        setFolderPath(
          data?.GoogleDriveTriggerFolderPath?.split("/").map((name: string, index: number) => ({ id: `${index}`, name })) || []
        )
        setSelectedFolder({id : data?.GoogleDriveTriggerFolderId as string , name :data?.GoogleDriveTriggerFolderPath?.split('/')[data?.GoogleDriveTriggerFolderPath.length - 1] as string});
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getFolderNameData = async () => {
      const parentFolderId = selectedFolder.id;
      const data = await axios.post(`/api/google/drive/listFolders`, {pageSize : 10 , parentFolderId });
      console.log(data.data?.folders);
      if(data.data?.folders.length === 0){
        setMaxDepthAchieved(true);
      }else {
        setMaxDepthAchieved(false);
      }
      setMockFolders(data.data?.folders || []);
    }
    getFolderNameData();
  }, [selectedFolder]);

    

  const handleClick = async () => {
    const data = {
      action: action,
      selectedFolder: selectedFolder.id,
      folderPath: folderPath.map(folder => folder.name),
      selectedFileType: selectedFileType,
      isTrigger: true,
    };
    const res = await axios.post(
      `/api/google/drive/${workFlowSegment}/${nodeId}`,
      data,
    );
    if (res.data.success) {
      router.push(path);
    }
  };

  return (
    <div className="bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">
          Google Drive Trigger {nodeId ? nodeId : 'not yet'}
        </h1>

        <div className="space-y-6">
          <div>
            <Label htmlFor="action" className="text-lg font-semibold">
              Select an action:
            </Label>
            <Select
              onValueChange={(value) =>
                setAction(value as GoogleDriveTriggerActions)
              }
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

          {action === 'new' && (
            <div className="space-y-4">
              <Label htmlFor="filetype" className="text-lg font-semibold">
                File type:
              </Label>
              <Select
                onValueChange={setSelectedFileType}
                value={selectedFileType}
              >
                <SelectTrigger id="filetype" className="w-full mt-2">
                  <SelectValue placeholder="Choose a file type" />
                </SelectTrigger>
                <SelectContent>
                  {mockFileTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(action === 'newInFolder' ||
            action === 'update' ||
            action === 'trash') && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Select a folder:</Label>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {folderPath.map((folder, index) => (
                  <span key={index}>
                    {folder.name} <ChevronRight className="inline h-4 w-4" />
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {folderPath.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleBackFolder}
                    className="w-full"
                  >
                    Back
                  </Button>
                )}
                {maxDepthAchieved ? (
                  <p>Max Depth Achieved</p>
                ) : (
                  mockFolders.map((folder: Folder) => (
                    <Button
                      key={folder.id}
                      variant="outline"
                      onClick={() => handleFolderSelect(folder)}
                      className="w-full"
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      {folder.name}
                    </Button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            variant="default"
            className="w-full md:w-auto px-8 py-2 text-lg"
            onClick={handleClick}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
