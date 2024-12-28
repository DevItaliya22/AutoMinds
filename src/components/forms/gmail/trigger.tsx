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
import {
  Paperclip,
  Mail,
  Search,
  Tag,
  Star,
  MessageSquare,
} from 'lucide-react';
import type { GmailTriggerActions } from '@/lib/types';
import axios from 'axios';

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
  }
];

type Props = {
  nodeId: string;
  steps: number;
};

export default function GmailTrigger({ steps , nodeId }: Props) {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>();
  const router = useRouter();
  const path = `/workflows/${workFlowSegment}?step=${steps}`;

  const [action, setAction] = useState<GmailTriggerActions | ''>('');
  const [searchString, setSearchString] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [labelOptions, setLabelOptions] = useState<string[]>([]);

  const handleClick =async () => {
    const data = {
      isTrigger: true,
      triggerAction: action,
      triggerLabel: label,
    }
    const res = await axios.post(`/api/google/gmail/${workFlowSegment}/${nodeId}`, data);

    if (res.data.success) {
      router.push(path);
    }
  };

  const fetchLabels = async () => {
    try {
      const res = await axios.get('/api/gmail/listLabels');
      const labels = res.data.labels; 
      setLabelOptions(labels);
    } catch (error) {
      console.error('Failed to fetch labels:', error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/google/gmail/getAllData?nodeId=${nodeId}`);
        const data = res.data.data;
        
        if(data.GmailTriggerLabel){
          setLabel(data.GmailTriggerLabel);
        }
        if(data.GmailTriggersWhen){
          setAction(data.GmailTriggersWhen);
        }

      } catch (error) {
        console.error('Failed to fetch trigger data:', error);
      }
    };
    getData();
  }, [nodeId]);

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
