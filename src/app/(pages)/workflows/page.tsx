'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, MoreVertical, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import getWorkflows from '@/app/actions/getWorkflows';
import { useRouter } from 'next/navigation';
import { createWorkflow } from '@/app/actions/createWorkflow';
import { editWorkflow } from '@/app/actions/editWorkflow';
import { deleteWorkflow } from '@/app/actions/deleteWorkflow';

type Workflow = {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  lastRun: string | null;
};

export default function Component() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: '', description: '' });
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchWorkflows = useCallback(async () => {
    const data = await getWorkflows();
    if (data) {
      setWorkflows(data);
    }
  }, []);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateWorkflow = async () => {
    setIsLoading(true);
    const workflow = await createWorkflow(newWorkflow);
    setIsLoading(false);
    if (workflow === 'Workflow with the same name already exists') {
      toast({
        title: 'Workflow Already Exists',
        description: 'A workflow with the same name already exists.',
      });
      return;
    }
    if (!workflow) {
      toast({
        title: 'Error creating workflow',
        description: 'Your new workflow is not created',
      });
      return;
    }
    const createdWorkflow = {
      ...newWorkflow,
      id: workflow.id,
      status: 'draft' as const,
      lastRun: null,
    };
    setWorkflows([...workflows, createdWorkflow]);
    setNewWorkflow({ name: '', description: '' });
    setIsCreateModalOpen(false);
    toast({
      title: 'Workflow Created',
      description: 'Your new workflow has been created successfully.',
    });
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setIsCreateModalOpen(true);
  };

  const handleUpdateWorkflow = async () => {
    if (editingWorkflow) {
      setIsLoading(true);
      const editedWorkflow2 = await editWorkflow({
        id: editingWorkflow.id,
        name: editingWorkflow.name,
        description: editingWorkflow.description,
      });
      setIsLoading(false);

      if (editedWorkflow2 === 'Workflow with the same name already exists') {
        toast({
          title: 'Workflow Already Exists',
          description: 'A workflow with the same name already exists.',
        });
        return;
      }
      if (!editedWorkflow2) {
        toast({
          title: 'Error updating workflow',
          description: 'Your workflow is not updated',
        });
        return;
      }

      const updatedWorkflows = workflows.map((w) =>
        w.id === editingWorkflow.id ? editingWorkflow : w,
      );
      setWorkflows(updatedWorkflows);
      setEditingWorkflow(null);
      setIsCreateModalOpen(false);
      toast({
        title: 'Workflow Updated',
        description: 'Your workflow has been updated successfully.',
      });
    }
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflowToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteWorkflow = async () => {
    if (workflowToDelete) {
      setIsLoading(true);
      const result = await deleteWorkflow(workflowToDelete);
      setIsLoading(false);
      if (result === 'success') {
        const updatedWorkflows = workflows.filter(
          (w) => w.id !== workflowToDelete,
        );
        setWorkflows(updatedWorkflows);
        setIsDeleteConfirmOpen(false);
        setWorkflowToDelete(null);
        toast({
          title: 'Workflow Deleted',
          description: 'Your workflow has been deleted successfully.',
        });
      } else {
        toast({
          title: 'Error deleting workflow',
          description: 'Your workflow could not be deleted',
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
              </DialogTitle>
              <DialogDescription>
                {editingWorkflow
                  ? 'Update your workflow details here.'
                  : 'Add the details of your new workflow here.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={
                    editingWorkflow ? editingWorkflow.name : newWorkflow.name
                  }
                  onChange={(e) =>
                    editingWorkflow
                      ? setEditingWorkflow({
                          ...editingWorkflow,
                          name: e.target.value,
                        })
                      : setNewWorkflow({ ...newWorkflow, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={
                    editingWorkflow
                      ? editingWorkflow.description
                      : newWorkflow.description
                  }
                  onChange={(e) =>
                    editingWorkflow
                      ? setEditingWorkflow({
                          ...editingWorkflow,
                          description: e.target.value,
                        })
                      : setNewWorkflow({
                          ...newWorkflow,
                          description: e.target.value,
                        })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={
                  editingWorkflow ? handleUpdateWorkflow : handleCreateWorkflow
                }
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingWorkflow ? 'Updating...' : 'Creating...'}
                  </>
                ) : editingWorkflow ? (
                  'Update Workflow'
                ) : (
                  'Create Workflow'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filteredWorkflows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {workflow.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEditWorkflow(workflow)}
                    >
                      Edit Workflow
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                    >
                      Delete Workflow
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <CardDescription>{workflow.description}</CardDescription>
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      workflow.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : workflow.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {workflow.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    Last run: {workflow.lastRun || 'N/A'}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/workflows/${workflow.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No workflows available.</p>
      )}

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workflow? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteWorkflow}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
