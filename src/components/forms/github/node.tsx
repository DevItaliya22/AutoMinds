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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';

type GitHubAction =
  | 'createGist'
  | 'createIssue'
  | 'createPullRequest'
  | 'deleteBranch'
  | 'createBranch';

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
  {
    value: 'createBranch',
    label: 'Create Branch',
    description: 'Create a branch.',
  },
];

type Props = {
  nodeId: string;
  steps: number;
};

export default function GitHubAction({ steps, nodeId }: Props) {
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
  const [userRepos, setUserRepos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get('/api/github/getRepos');
        setUserRepos(res.data.data);
      } catch (error) {
        console.error('Failed to fetch repositories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/github/getAllData?nodeId=${nodeId}`);
        const data = res.data.data;

        if (data.GithubActionType) setAction(data.GithubActionType);
        if (data.GithubActionRepoName && data.GithubActionRepoOwner) {
          setRepository(`${data.GithubActionRepoOwner}/${data.GithubActionRepoName}`);
        }
        if (data.GithubActionBranchName) setBranch(data.GithubActionBranchName);
        if (data.GithubActionGistName) setFileName(data.GithubActionGistName);
        if (data.GithubActionGistDescription) setDescription(data.GithubActionGistDescription);
        if (data.GithubActionGistBody) setBody(data.GithubActionGistBody);
        if (data.GitHubActionisPublic !== null) setIsPublic(data.GitHubActionisPublic);
        if (data.GithubActionIssueTitle) setTitle(data.GithubActionIssueTitle);
        if (data.GithubActionIssueBody) setBody(data.GithubActionIssueBody);
        if (data.GithubActionPRTitle) setTitle(data.GithubActionPRTitle);
        if (data.GithubActionPRBody) setBody(data.GithubActionPRBody);
      } catch (error) {
        console.error('Failed to fetch action data:', error);
      }
    };
    getData();
  }, [nodeId]);

  const handleClick = async () => {
    const data = {
      action,
      repository,
      title,
      body,
      branch,
      fileName,
      description,
      isPublic,
      isTrigger: false,
    };
    const res = await axios.post(
      `/api/github/${workFlowSegment}/${nodeId}`,
      data,
    );
    if (res.data.success) {
      router.push(path);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Loading repositories...</p>
      </div>
    );
  }

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
                      {option.label} ( {option.description} )
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(action === 'createIssue' ||
            action === 'createPullRequest' ||
            action === 'createBranch' ||
            action === 'deleteBranch') && (
            <div>
              <Label htmlFor="repository" className="text-lg font-semibold">
                Select a repository:
              </Label>
              <Select onValueChange={setRepository} value={repository}>
                <SelectTrigger id="repository" className="w-full mt-2">
                  <SelectValue placeholder="Choose a repository" />
                </SelectTrigger>
                <SelectContent>
                  {userRepos.map((repo) => (
                    <SelectItem key={repo} value={repo}>
                      {repo.split('/')[1]}
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

          {(action === 'createPullRequest' ||
            action === 'deleteBranch' ||
            action === 'createBranch') && (
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
            onClick={handleClick}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}