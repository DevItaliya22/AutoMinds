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
import type { GitHubAction } from '@/lib/types';

interface ActionOption {
  value: GitHubAction;
  label: string;
  description: string;
}

const actionOptions: ActionOption[] = [
  {
    value: 'createGist',
    label: 'Create Gist',
    description: 'Creates a new gist.',
  },
  {
    value: 'createIssue',
    label: 'Create Issue',
    description: 'Create a new issue.',
  },
  {
    value: 'createPullRequest',
    label: 'Create Pull Request',
    description: 'Create a new pull request and merge it (optional).',
  },
  {
    value: 'deleteBranch',
    label: 'Delete Branch',
    description: 'Deletes an unwanted branch.',
  },
];

type Props = {
  steps: number;
};

export default function GitHubAction({ steps }: Props) {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>();
  const router = useRouter();
  const path = `/workflows/${workFlowSegment}?step=${steps}`;

  const [action, setAction] = useState<GitHubAction | ''>('');
  const [repository, setRepository] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const mockRepositories = ['user/repo1', 'user/repo2', 'organization/repo3'];

  return (
    <div className="bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">GitHub Action</h1>

        <div className="space-y-6">
          <div>
            <Label htmlFor="action" className="text-lg font-semibold">
              Select an action:
            </Label>
            <Select
              onValueChange={(value) => setAction(value as GitHubAction)}
              value={action}
            >
              <SelectTrigger id="action" className="w-full mt-2">
                <SelectValue placeholder="Choose an action" />
              </SelectTrigger>
              <SelectContent>
                {actionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div>{option.label}</div>
                      {action !== option.value && (
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(action === 'createIssue' || action === 'createPullRequest') && (
            <div>
              <Label htmlFor="repository" className="text-lg font-semibold">
                Select a repository:
              </Label>
              <Select onValueChange={setRepository} value={repository}>
                <SelectTrigger id="repository" className="w-full mt-2">
                  <SelectValue placeholder="Choose a repository" />
                </SelectTrigger>
                <SelectContent>
                  {mockRepositories.map((repo) => (
                    <SelectItem key={repo} value={repo}>
                      {repo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(action === 'createIssue' || action === 'createPullRequest') && (
            <div>
              <Label htmlFor="title" className="text-lg font-semibold">
                Title:
              </Label>
              <Input
                id="title"
                placeholder="Enter title"
                className="w-full mt-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          )}

          {(action === 'createIssue' ||
            action === 'createPullRequest' ||
            action === 'createGist') && (
            <div>
              <Label htmlFor="body" className="text-lg font-semibold">
                Body:
              </Label>
              <Textarea
                id="body"
                placeholder="Enter body"
                className="w-full mt-2"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          )}

          {(action === 'createPullRequest' || action === 'deleteBranch') && (
            <div>
              <Label htmlFor="branch" className="text-lg font-semibold">
                Branch name:
              </Label>
              <Input
                id="branch"
                placeholder="Enter branch name"
                className="w-full mt-2"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
          )}

          {action === 'createGist' && (
            <>
              <div>
                <Label htmlFor="fileName" className="text-lg font-semibold">
                  File Name:
                </Label>
                <Input
                  id="fileName"
                  placeholder="Enter file name"
                  className="w-full mt-2"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-lg font-semibold">
                  Description:
                </Label>
                <Input
                  id="description"
                  placeholder="Enter gist description"
                  className="w-full mt-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
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
                  Public Gist
                </Label>
              </div>
            </>
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
