import React, { DragEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Database, Github, Mail, Search, Loader2 } from 'lucide-react';
import { TriggerNodes, ActionNodes } from '@/lib/constants';
import { useRouter } from 'next/navigation';

type SidebarProps = {
  handleSave: () => void;
  hasTrigger: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSaving: boolean;
  isFetching: boolean;
  workFlowPath: string;
};

export default function Sidebar({
  handleSave,
  hasTrigger,
  searchTerm,
  setSearchTerm,
  isSaving,
  isFetching,
  workFlowPath,
}: SidebarProps) {
  const onDragStart = (
    event: DragEvent<HTMLButtonElement>,
    nodeType: string,
    nodeSubType: string
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/nodetype', nodeSubType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const router = useRouter();
  const triggerNodes = TriggerNodes;
  const actionNodes = ActionNodes;
  const nodesToShow = hasTrigger ? actionNodes : triggerNodes;
  const filteredNodes = nodesToShow.filter((node) =>
    node.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleExitEditor = () => {
    router.push(workFlowPath);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Google Drive':
        return <Database className="mr-2 h-4 w-4" />;
      case 'Gmail':
        return <Mail className="mr-2 h-4 w-4" />;
      case 'Github':
        return <Github className="mr-2 h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-64 h-auto border-l">
      <CardHeader>
        <CardTitle>
          <div className="border-t border-b py-4 flex gap-5">
            <Button onClick={handleSave} disabled={isSaving || isFetching}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Workflow'
              )}
            </Button>
            <Button
              onClick={handleExitEditor}
              disabled={isSaving || isFetching}
            >
              <>Exit Editor</>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              disabled={isFetching}
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="p-4 space-y-4">
            {filteredNodes.map((node) => (
              <Button
                key={node.type}
                variant="outline"
                className="w-full justify-start"
                onDragStart={(event) => onDragStart(event, node.type, node.subType)}
                draggable
                disabled={isFetching}
              >
                {getIcon(node.subType)}
                {node.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}