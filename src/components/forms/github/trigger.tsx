"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

type GitHubTrigger = 
  | "newBranch" | "newCollaborator" | "newCommit" | "newCommitComment" | "newGist"
  | "newGlobalEvent" | "newIssue" | "newLabel" | "newMention" | "newMilestone"
  | "newNotification" | "newOrganization" | "newPullRequest" | "newRelease"
  | "newRepoEvent" | "newRepository" | "newReviewRequest" | "newTeam" | "newWatcher"

interface TriggerOption {
  value: GitHubTrigger
  label: string
  description: string
}

const triggerOptions: TriggerOption[] = [
  { value: "newBranch", label: "New Branch", description: "Triggers when a new branch is created." },
  { value: "newCollaborator", label: "New Collaborator", description: "Triggers when you add a new collaborator." },
  { value: "newCommit", label: "New Commit", description: "Triggers when a new commit is created." },
  { value: "newCommitComment", label: "New Commit Comment", description: "Triggers when a new comment on a commit is created." },
  { value: "newIssue", label: "New Issue", description: "Triggers when a new issue is created." },
  { value: "newMention", label: "New Mention", description: "Triggers when your Github username is mentioned in a Commit, Comment, Issue or Pull Request." },
  { value: "newMilestone", label: "New Milestone", description: "Triggers when a new milestone is created." },
  { value: "newPullRequest", label: "New Pull Request", description: "Triggers when a new pull request is created." },
  { value: "newRepoEvent", label: "New Repo Event", description: "Triggers when anything happens on a repo." },
  { value: "newRepository", label: "New Repository", description: "Triggers when a new repository is created." },
  { value: "newReviewRequest", label: "New Review Request", description: "Triggers when a review is requested from you or a specified user." },
]

export default function GitHubTrigger() {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>()
  const router = useRouter()
  const path = `/workflows/editor/${workFlowSegment}`

  const [trigger, setTrigger] = useState<GitHubTrigger | "">("")
  const [repository, setRepository] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [includePrivate, setIncludePrivate] = useState<boolean>(false)

  const mockRepositories = ["user/repo1", "user/repo2", "organization/repo3"]

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">GitHub Trigger</h1>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="trigger" className="text-lg font-semibold">Select a trigger:</Label>
            <Select onValueChange={(value) => setTrigger(value as GitHubTrigger)} value={trigger}>
              <SelectTrigger id="trigger" className="w-full mt-2">
                <SelectValue placeholder="Choose a trigger" />
              </SelectTrigger>
              <SelectContent>
                {triggerOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div>{option.label}</div>
                      {trigger !== option.value && (
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(trigger === "newBranch" || trigger === "newCommit" || trigger === "newCommitComment" || 
            trigger === "newIssue" || trigger === "newLabel" || trigger === "newMilestone" || 
            trigger === "newPullRequest" || trigger === "newRelease" || trigger === "newRepoEvent" || 
            trigger === "newWatcher" || trigger === "newCollaborator") && (
            <div>
              <Label htmlFor="repository" className="text-lg font-semibold">Select a repository:</Label>
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

          {(trigger === "newMention" || trigger === "newReviewRequest") && (
            <div>
              <Label htmlFor="username" className="text-lg font-semibold">GitHub Username:</Label>
              <Input 
                id="username" 
                placeholder="Enter GitHub username" 
                className="w-full mt-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          {(trigger === "newGist" || trigger === "newGlobalEvent" || trigger === "newNotification") && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includePrivate" 
                checked={includePrivate} 
                onCheckedChange={(checked) => setIncludePrivate(checked as boolean)}
              />
              <Label htmlFor="includePrivate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Include private repositories/gists
              </Label>
            </div>
          )}
        </div>

        <div className="pt-6">
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
  )
}