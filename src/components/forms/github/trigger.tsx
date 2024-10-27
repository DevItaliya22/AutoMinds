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
import { Label } from '@/components/ui/label';
import type { GitHubTrigger } from '@/lib/types';

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
  steps: number;
};

export default function GitHubTrigger({ steps }: Props) {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>();
  const router = useRouter();
  const path = `/workflows/${workFlowSegment}?step=${steps}`;

  const [trigger, setTrigger] = useState<GitHubTrigger | ''>('');
  const [repository, setRepository] = useState<string>('');

  const mockRepositories = ['user/repo1', 'user/repo2', 'organization/repo3'];

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
                      <div>{option.label}</div>
                      {trigger !== option.value && (
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
                  {mockRepositories.map((repo) => (
                    <SelectItem key={repo} value={repo}>
                      {repo}
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
            onClick={() => router.push(path)}
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
