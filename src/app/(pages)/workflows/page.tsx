"use client"
import React, { useEffect, useState, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import getWorkflows from "@/app/actions/getWorkflows"
import { useRouter } from "next/navigation"

type Workflow = {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "draft"
  lastRun: string | null
}

export default function Workflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter();

  const fetchWorkflows = useCallback(async () => {
    const data = await getWorkflows()
    if (data) {
      setWorkflows(data)
    }
  }, [])

  useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
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
      
      {filteredWorkflows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkflows.map((workflow) => (
            <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{workflow.name}</CardTitle>
                <CardDescription>{workflow.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                    workflow.status === 'inactive' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {workflow.status ? workflow.status : "draft" }
                  </span>
                  <span className="text-sm text-gray-500">Last run: {workflow.lastRun ? workflow.lastRun : " N/A " }</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push(`/workflows/${workflow.id}`)}>View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No workflows available.</p>
      )}
    </div>
  )
}
