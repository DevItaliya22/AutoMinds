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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tag, Mail, Reply, Trash, Send } from 'lucide-react';
import axios, { getAdapter } from 'axios';

type GmailActionType =
  | 'addLabel'
  | 'createDraft'
  | 'createDraftReply'
  | 'createLabel'
  | 'deleteEmail'
  | 'removeLabel'
  | 'replyToEmail'
  | 'sendEmail';

interface ActionOption {
  value: GmailActionType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const actionOptions: ActionOption[] = [
  {
    value: 'addLabel',
    label: 'Add Label to Email',
    description: 'Add a label to an email message.',
    icon: <Tag className="mr-2 h-4 w-4" />,
  },
  {
    value: 'createDraft',
    label: 'Create Draft',
    description: 'Create a draft email message.',
    icon: <Mail className="mr-2 h-4 w-4" />,
  },
  {
    value: 'createLabel',
    label: 'Create Label',
    description: 'Creates a new label.',
    icon: <Tag className="mr-2 h-4 w-4" />,
  },
  {
    value: 'deleteEmail',
    label: 'Delete Email',
    description: 'Sends an email message to the trash.',
    icon: <Trash className="mr-2 h-4 w-4" />,
  },
  {
    value: 'removeLabel',
    label: 'Remove Label From Email',
    description: 'Remove a label from an email message.',
    icon: <Tag className="mr-2 h-4 w-4" />,
  },
  {
    value: 'sendEmail',
    label: 'Send Email',
    description: 'Create and send a new email message.',
    icon: <Send className="mr-2 h-4 w-4" />,
  }
];

type Props = {
  nodeId: string;
  isLast : boolean;
  steps: number;
};

export default function GmailActions({ steps,nodeId,isLast }: Props) {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>();
  const router = useRouter();
  const path = isLast ?`/workflows/${workFlowSegment}?step=${steps-1}` : `/workflows/${workFlowSegment}?step=${steps}`;

  const [action, setAction] = useState<GmailActionType | ''>('');
  const [label, setLabel] = useState<string>('');
  const [emailId, setEmailId] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [labelOptions, setLabelOptions] = useState<string[]>([]);

  const handleClick =async () => {
    const data = {
      isTrigger: false,
      actionLabel: label,
      actionEmail: to,
      actionSubject: subject,
      actionBody: body,
      actionTo: action,
    }
    const res = await axios.post(`/api/google/gmail/${workFlowSegment}/${nodeId}`, data);
    if(res.data.success){
      router.push(path);
    }
  };

  const fetchLabels = async () => {
    try {
      const res = await axios.get('/api/google/gmail/listLabels');
      const labels = res.data.labels; 
      setLabelOptions(labels.map((label: { name: string; }) => label.name));
    } catch (error) {
      console.error('Failed to fetch labels:', error);
    }
  };

  useEffect(() => {
    if (action === 'addLabel' || action === 'removeLabel') {
      fetchLabels();
    }
  }, [action]);
  

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/google/gmail/getAllData?nodeId=${nodeId}`);
        const data = res.data.data;
        console.log('Fetched Data:', data);
  
        setLabel(data?.GmailActionLabel || '');
        setEmailId(data?.GmailActionEmail || '');
        setSubject(data?.GmailActionSubject || '');
        setBody(data?.GmailActionBody || '');
        setTo(data?.GmailActionEmail || '');
        setAction(data?.GmailactionTo || '');
      } catch (error) {
        console.error('Failed to fetch trigger data:', error);
      }
    };
    getData();
  }, [nodeId]);
  

  return (
    <div className="bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">Gmail Actions</h1>

        <div className="space-y-6">
          <div>
            <Label htmlFor="action" className="text-lg font-semibold">
              Select an action:
            </Label>
            <Select
              onValueChange={(value) => setAction(value as GmailActionType)}
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

          {(action === 'addLabel' || action === 'removeLabel' || action === 'createLabel') && (
  <div>
    <Label htmlFor="label" className="text-lg font-semibold">
      Label:
    </Label>
    <Select
      onValueChange={(value) => setLabel(value)}
      value={label}
    >
      <SelectTrigger id="label" className="w-full mt-2">
        <SelectValue placeholder="Choose a label" />
      </SelectTrigger>
      <SelectContent>
        {labelOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)}


          {(action === 'addLabel' ||
            action === 'removeLabel' ||
            action === 'deleteEmail' ||
            action === 'replyToEmail' ||
            action === 'createDraftReply') && (
            <div>
              <Label htmlFor="emailId" className="text-lg font-semibold">
                Email ID:
              </Label>
              <Input
                id="emailId"
                placeholder="Enter email ID"
                className="w-full mt-2"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>
          )}

          {(action === 'createDraft' || action === 'sendEmail') && (
            <>
              <div>
                <Label htmlFor="to" className="text-lg font-semibold">
                  To:
                </Label>
                <Input
                  id="to"
                  placeholder="Enter recipient email"
                  className="w-full mt-2"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="subject" className="text-lg font-semibold">
                  Subject:
                </Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject"
                  className="w-full mt-2"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </>
          )}

          {(action === 'createDraft' ||
            action === 'sendEmail' ||
            action === 'replyToEmail' ||
            action === 'createDraftReply') && (
            <div>
              <Label htmlFor="body" className="text-lg font-semibold">
                Body:
              </Label>
              <Textarea
                id="body"
                placeholder="Enter email body"
                className="w-full mt-2"
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
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
