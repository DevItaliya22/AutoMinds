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
import {
  Paperclip,
  Mail,
  Search,
  Tag,
  Star,
  MessageSquare,
} from 'lucide-react';
import type { GmailTriggerActions } from '@/lib/types';

interface ActionOption {
  value: GmailTriggerActions;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const actionOptions: ActionOption[] = [
  {
    value: 'newAttachment',
    label: 'New Attachment',
    description: 'Triggers when you receive a new attachment.',
    icon: <Paperclip className="mr-2 h-4 w-4" />,
  },
  {
    value: 'newEmail',
    label: 'New Email',
    description: 'Triggers when a new email appears in the specified mailbox.',
    icon: <Mail className="mr-2 h-4 w-4" />,
  },
  {
    value: 'newEmailMatchingSearch',
    label: 'New Email Matching Search',
    description:
      'Triggers when you receive a new email that matches a search string you provide.',
    icon: <Search className="mr-2 h-4 w-4" />,
  },
  {
    value: 'newLabel',
    label: 'New Label',
    description: 'Triggers when you add a new label.',
    icon: <Tag className="mr-2 h-4 w-4" />,
  },
  {
    value: 'newLabeledEmail',
    label: 'New Labeled Email',
    description: 'Triggers when you label an email.',
    icon: <Tag className="mr-2 h-4 w-4" />,
  },
  {
    value: 'newStarredEmail',
    label: 'New Starred Email',
    description:
      'Triggers when you receive a new email and star it within two days.',
    icon: <Star className="mr-2 h-4 w-4" />,
  },
  {
    value: 'newThread',
    label: 'New Thread',
    description: 'Triggers when a new thread starts.',
    icon: <MessageSquare className="mr-2 h-4 w-4" />,
  },
];

type Props = {
  nodeId: string;
  steps: number;
};

export default function GmailTrigger({ steps }: Props) {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>();
  const router = useRouter();
  const path = `/workflows/${workFlowSegment}?step=${steps}`;

  const [action, setAction] = useState<GmailTriggerActions | ''>('');
  const [mailbox, setMailbox] = useState<string>('');
  const [searchString, setSearchString] = useState<string>('');
  const [label, setLabel] = useState<string>('');

  const handleClick = () => {
    router.push(path);
  };

  return (
    <div className="bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">Gmail Trigger</h1>

        <div className="space-y-6">
          <div>
            <Label htmlFor="action" className="text-lg font-semibold">
              Select an action:
            </Label>
            <Select
              onValueChange={(value) => setAction(value as GmailTriggerActions)}
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

          {(action === 'newEmail' || action === 'newEmailMatchingSearch') && (
            <div>
              <Label htmlFor="mailbox" className="text-lg font-semibold">
                Mailbox:
              </Label>
              <Input
                id="mailbox"
                placeholder="e.g., INBOX, [Gmail]/Sent Mail"
                className="w-full mt-2"
                value={mailbox}
                onChange={(e) => setMailbox(e.target.value)}
              />
            </div>
          )}

          {action === 'newEmailMatchingSearch' && (
            <div>
              <Label htmlFor="searchString" className="text-lg font-semibold">
                Search String:
              </Label>
              <Input
                id="searchString"
                placeholder="e.g., from:example@email.com subject:important"
                className="w-full mt-2"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              />
            </div>
          )}

          {(action === 'newLabel' || action === 'newLabeledEmail') && (
            <div>
              <Label htmlFor="label" className="text-lg font-semibold">
                Label:
              </Label>
              <Input
                id="label"
                placeholder="e.g., Work, Personal"
                className="w-full mt-2"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
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
