import React, { useEffect, useMemo, useState } from 'react';
import { Handle, Position, useNodeId, useReactFlow } from 'reactflow';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Github, Mail, PlusCircle, MoreHorizontal, X, Edit, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import clsx from 'clsx';
import { useWorkflowStore } from '@/store/Editing';
import { useIsWorkflowSavedStore, WorkflowState } from '@/store/Saving';


type CustomNodeData = {
  label: string;
  type: string;
  description: string;
  nodeType: 'Google Drive' | 'Gmail' | 'Github';
};

export default function CustomWorkflowNode({ data }: { data: CustomNodeData }) {
  const { isEditing, setIsEditing } = useWorkflowStore((state:any) => ({
    isEditing: state.isEditing,
    setIsEditing: state.setIsEditing,
  }));
  const nodeId = useNodeId();
  const { setNodes, setEdges } = useReactFlow();
  const { isSaved, setIsSaved } = useIsWorkflowSavedStore(
    (state: WorkflowState) => ({
      isSaved: state.isSaved,
      setIsSaved: state.setIsSaved,
    }),
  );
  const [editedLabel, setEditedLabel] = useState(data.label);
  const [editedDescription, setEditedDescription] = useState(data.description);

  const isValidEdit = () => {
    return editedLabel.trim() !== '' && editedDescription.trim() !== '';
  };

  useEffect(()=>{
    if(isEditing)setIsSaved(false)
  },[isEditing,setIsSaved]);

  const logo = useMemo(() => {
    if (data.nodeType === 'Google Drive') return <Database className="h-6 w-6" />;
    if (data.nodeType === 'Gmail') return <Mail className="h-6 w-6" />;
    if (data.nodeType === 'Github') return <Github className="h-6 w-6" />;
    return <PlusCircle className="h-6 w-6" />;
  }, [data.nodeType]);

  const statusColor = useMemo(() => {
    const random = Math.random();
    if (random < 0.6) return 'bg-green-500';
    if (random < 0.8) return 'bg-orange-500';
    return 'bg-red-500';
  }, []);

  const handleDelete = () => {
    if (data.type === 'Trigger') {
      // Show an error message or handle the case where deletion is not allowed
      console.log('Cannot delete trigger node');
      return;
    }
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setIsSaved(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirmEdit = () => {
    if (!isValidEdit()) {
      // Show an error message or handle the invalid input
      console.log('Name and description are required');
      return;
    }
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: editedLabel.trim(), description: editedDescription.trim() } }
          : node
      )
    );
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedLabel(data.label);
    setEditedDescription(data.description);
    setIsEditing(false);
  };

  return (
    <>
      {data.type !== 'Trigger' && (
        <Handle type="target" position={Position.Top} style={{ zIndex: 100 }} />
      )}
      <Card className="relative max-w-[400px] dark:border-muted-foreground/70">
        <CardHeader className="flex flex-row items-center gap-4">
          <div>{logo}</div>
          <div className="flex-grow">
            {isEditing ? (
              <Input
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                className="mb-2"
              />
            ) : (
              <CardTitle className="text-md">{data.label}</CardTitle>
            )}
            <CardDescription>
              <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {nodeId}
              </p>
              {isEditing ? (
                <>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="mt-2"
                  />
                  {editedLabel.trim() === '' && (
                    <p className="text-xs text-red-500 mt-1">Name is required</p>
                  )}
                  {editedDescription.trim() === '' && (
                    <p className="text-xs text-red-500 mt-1">Description is required</p>
                  )}
                </>
              ) : (
                <p>{data.description}</p>
              )}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`h-8 w-8 p-0 ${isEditing ? "bg-primary" : ""}`}>
                <MoreHorizontal className={`h-4 w-4 ${isEditing ? "text-primary-foreground" : ""}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isEditing ? (
                <>
                  <DropdownMenuItem onClick={handleConfirmEdit} disabled={!isValidEdit()}>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCancelEdit}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {data.type !== 'Trigger' && (
                    <DropdownMenuItem onClick={handleDelete}>
                      <X className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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