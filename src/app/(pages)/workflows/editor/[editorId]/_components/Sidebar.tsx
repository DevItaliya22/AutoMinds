import React, { DragEvent } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Database, Github, Mailbox, Search, Loader2 } from 'lucide-react'
import { TriggerNodes , ActionNodes } from '@/lib/constants'

type SidebarProps = {
  handleSave: () => void
  hasTrigger: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  isSaving: boolean
  isFetching: boolean
}

export default function Sidebar({ handleSave, hasTrigger, searchTerm, setSearchTerm, isSaving, isFetching }: SidebarProps) {
  const onDragStart = (event: DragEvent<HTMLButtonElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }


  const triggerNodes = TriggerNodes
  const actionNodes = ActionNodes
  const nodesToShow = hasTrigger ? actionNodes : triggerNodes
  const filteredNodes = nodesToShow.filter(node => 
    node.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="w-64 h-auto border-l">
      <CardHeader>
        <CardTitle>
          <div className="border-t border-b py-4">
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
                onDragStart={(event) => onDragStart(event, node.type)}
                draggable
                disabled={isFetching}
              >
                <node.icon className="mr-2 h-4 w-4" /> {node.label}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}