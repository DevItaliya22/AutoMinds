import React, { useMemo } from 'react';
import { Handle, Position, useNodeId } from 'reactflow';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Github, Inbox, PlusCircle } from 'lucide-react';
import clsx from 'clsx';

type CustomNodeData = {
  label: string;
  type: string;
  description: string;
  nodeType: 'Google' | 'Github';
};

export default function CustomWorkflowNode({ data }: { data: CustomNodeData }) {
  const nodeId = useNodeId();

  const logo = useMemo(() => {
    if (data.nodeType === 'Google') return <Database />;
    if (data.nodeType === 'Github') return <Github />;
    return <PlusCircle />;
  }, [data.nodeType]);

  const statusColor = useMemo(() => {
    const random = Math.random();
    if (random < 0.6) return 'bg-green-500';
    if (random < 0.8) return 'bg-orange-500';
    return 'bg-red-500';
  }, []);

  return (
    <>
      {data.type !== 'Trigger' && (
        <Handle type="target" position={Position.Top} style={{ zIndex: 100 }} />
      )}
      <Card className="relative max-w-[400px] dark:border-muted-foreground/70">
        <CardHeader className="flex flex-row items-center gap-4">
          <div>{logo}</div>
          <div>
            <CardTitle className="text-md">{data.label}</CardTitle>
            <CardDescription>
              <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {nodeId}
              </p>
              <p>{data.description}</p>
            </CardDescription>
          </div>
        </CardHeader>
        <Badge variant="secondary" className="absolute right-2 top-2">
          {data.type}
        </Badge>
        <div
          className={clsx(
            'absolute left-3 top-4 h-2 w-2 rounded-full',
            statusColor,
          )}
        ></div>
      </Card>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
