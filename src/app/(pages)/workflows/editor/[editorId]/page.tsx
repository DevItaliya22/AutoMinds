"use client"

import React, { useState, useCallback, DragEvent } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  Connection,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Workflow, Database, FileJson, Send } from 'lucide-react'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Default Node' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
  {
    id: '4',
    data: { label: 'Custom Node' },
    position: { x: 400, y: 125 },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e1-4', source: '1', target: '4' },
  { id: 'e4-3', source: '4', target: '3' },
]

const CustomNode = ({ data }: { data: { label: string } }) => {
  return (
    <Card className="min-w-[150px]">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">{data.label}</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        {/* Add any additional node content here */}
      </CardContent>
    </Card>
  )
}

const nodeTypes = {
  custom: CustomNode,
}

const Sidebar = () => {

  const onDragStart = (event: DragEvent<HTMLButtonElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Card className="w-64 h-full border-l">
      <CardHeader>
        <CardTitle>Node Types</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4 space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onDragStart={(event) => onDragStart(event, 'input')}
              draggable
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Input Node 
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onDragStart={(event) => onDragStart(event, 'default')}
              draggable
            >
              <Workflow className="mr-2 h-4 w-4" /> Default Node
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onDragStart={(event) => onDragStart(event, 'output')}
              draggable
            >
              <Send className="mr-2 h-4 w-4" /> Output Node
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onDragStart={(event) => onDragStart(event, 'custom')}
              draggable
            >
              <FileJson className="mr-2 h-4 w-4" /> Custom Node
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

const EditorContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { editorId } = useParams<{editorId : string}>()
  const reactFlowInstance = useReactFlow()

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - 250,
        y: event.clientY,
      })
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} node` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance,setNodes]
  )

  return (
    <div className="h-[calc(100vh-64px)] w-full flex">
      <div className="flex-grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls className="top-2 left-2" />
          <MiniMap className="bottom-2 left-2 w-0" pannable zoomable zoomStep={2} />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  )
}

export default function EditorId() {
  return (
    <ReactFlowProvider>
      <EditorContent />
    </ReactFlowProvider>
  )
}