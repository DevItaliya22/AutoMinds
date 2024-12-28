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
import { Label } from '@/components/ui/label';
import type { GitHubTrigger } from '@/lib/types';
import axios from 'axios';

interface TriggerOption {
  value: GitHubTrigger;
  label: string;
  description: string;
}

const triggerOptions: TriggerOption[] = [
  {
    value: 'newBranch',
    label: 'New Branch',
    description: 'Triggers when a new branch is created.',
  },
  {
    value: 'newCollaborator',
    label: 'New Collaborator',
    description: 'Triggers when you add a new collaborator.',
  },
  {
    value: 'newCommit',
    label: 'New Commit',
    description: 'Triggers when a new commit is created.',
  },
  {
    value: 'newCommitComment',
    label: 'New Commit Comment',
    description: 'Triggers when a new comment on a commit is created.',
  },
  {
    value: 'newIssue',
    label: 'New Issue',
    description: 'Triggers when a new issue is created.',
  },
  {
    value: 'newPullRequest',
    label: 'New Pull Request',
    description: 'Triggers when a new pull request is created.',
  },
  {
    value: 'newRepoEvent',
    label: 'New Repo Event',
    description: 'Triggers when anything happens on a repo.',
  },
  {
    value: 'newRepository',
    label: 'New Repository',
    description: 'Triggers when a new repository is created.',
  },
];

type Props = {
  nodeId: string;
  steps: number;
  isLast :boolean
};

export default function GitHubTrigger({ steps, nodeId,isLast }: Props) {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>();
  const router = useRouter();
  const path = isLast ?`/workflows/${workFlowSegment}?step=${steps-1}` : `/workflows/${workFlowSegment}?step=${steps}`;

  const [trigger, setTrigger] = useState<GitHubTrigger | ''>('');
  const [repository, setRepository] = useState<string>('');
  const [userRepos, setUserRepos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = async () => {
    const data = {
      isTrigger: true,
      repository,
      action: trigger,
    };

    const res = await axios.post(`/api/github/${workFlowSegment}/${nodeId}`, data);

    if (res.data.success) {
      router.push(path);
    }
  };

  useEffect(() => {
    const getRepos = async () => {
      try {
        const res = await axios.get('/api/github/getRepos');
        setUserRepos(res.data.data);
      } catch (error) {
        console.error('Failed to fetch repositories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getRepos();
  }, [nodeId]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/github/getAllData?nodeId=${nodeId}`);
        const data = res.data.data;
        
        if (data.GithubTriggerRepoName) {
          const fullRepoName = `${data.GithubTriggerRepoOwner}/${data.GithubTriggerRepoName}`;
          setRepository(fullRepoName);
        }
        
        if (data.GithubTriggersWhen) {
          setTrigger(data.GithubTriggersWhen);
        }
      } catch (error) {
        console.error('Failed to fetch trigger data:', error);
      }
    };
    getData();
  }, [nodeId]);

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
        <h1 className="text-3xl font-bold text-primary">GitHub Trigger</h1>

        <div className="space-y-6">
          <div>
            <Label htmlFor="trigger" className="text-lg font-semibold">
              Select a trigger:
            </Label>
            <Select
              onValueChange={(value) => setTrigger(value as GitHubTrigger)}
              value={trigger}
            >
              <SelectTrigger id="trigger" className="w-full mt-2">
                <SelectValue placeholder="Choose a trigger" />
              </SelectTrigger>
              <SelectContent>
                {triggerOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      {option.label} ( {option.description} )
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(trigger === 'newBranch' ||
            trigger === 'newCommit' ||
            trigger === 'newCommitComment' ||
            trigger === 'newIssue' ||
            trigger === 'newPullRequest' ||
            trigger === 'newRepoEvent') && (
            <div>
              <Label htmlFor="repository" className="text-lg font-semibold">
                Select a repository:
              </Label>
              <Select onValueChange={setRepository} value={repository}>
                <SelectTrigger id="repository" className="w-full mt-2">
                  <SelectValue placeholder="Choose a repository" />
                </SelectTrigger>
                <SelectContent>
                  {userRepos.map((repo: string) => (
                    <SelectItem key={repo} value={repo}>
                      {repo.split('/')[1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            variant="default"
            className="w-full md:w-auto px-8 py-2 text-lg"
            onClick={handleClick}
            disabled={!trigger || (trigger !== 'newRepository' && trigger !== 'newCollaborator' && !repository)}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}