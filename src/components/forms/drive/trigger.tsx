'use client'

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight, File, Folder } from "lucide-react"

type Action = "new" | "newInFolder" | "update" | "trash"

interface ActionOption {
  value: Action
  label: string
  description: string
}

const actionOptions: ActionOption[] = [
  { value: "new", label: "New File", description: "Action will be triggered when new file is added" },
  { value: "newInFolder", label: "New file in folder", description: "Action will be triggered when new file is added in a particular folder" },
  { value: "update", label: "Updated file in folder", description: "Action will be triggered when file is updated in folder" },
  { value: "trash", label: "Trashed file in folder", description: "Action will be triggered when file is Trashed in folder" },
]

const mockFileTypes = [
  { value: "any", label: "Any file type" },
  { value: "document", label: "Document (*.doc, *.docx, *.txt)" },
  { value: "spreadsheet", label: "Spreadsheet (*.xls, *.xlsx, *.csv)" },
  { value: "presentation", label: "Presentation (*.ppt, *.pptx)" },
  { value: "pdf", label: "PDF (*.pdf)" },
  { value: "image", label: "Image (*.jpg, *.png, *.gif)" },
]

type Props = {
  steps : number
}

export default function GoogleDriveTrigger({steps}:Props) {
  const { workFlowSegment } = useParams<{ workFlowSegment: string }>()
  const router = useRouter()
  const path = `/workflows/${workFlowSegment}?step=${steps}`

  const [action, setAction] = useState<Action | "">("")
  const [selectedFolder, setSelectedFolder] = useState<string>("")
  const [folderPath, setFolderPath] = useState<string[]>([])
  const [selectedFileType, setSelectedFileType] = useState<string>("any")
  const [customPattern, setCustomPattern] = useState<string>("")

  const mockFolders = ["Documents", "Images", "Projects"]

  const handleFolderSelect = (folder: string) => {
    setSelectedFolder(folder)
    setFolderPath([...folderPath, folder])
  }

  const handleBackFolder = () => {
    setFolderPath(folderPath.slice(0, -1))
    setSelectedFolder("")
  }

  const handleClick = () =>{
    router.push(path)
  }

  return (
    <div className="bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">Google Drive Trigger</h1>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="action" className="text-lg font-semibold">Select an action:</Label>
            <Select onValueChange={(value) => setAction(value as Action)} value={action}>
              <SelectTrigger id="action" className="w-full mt-2">
                <SelectValue placeholder="Choose an action" />
              </SelectTrigger>
              <SelectContent>
                {actionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div>{option.label}</div>
                      {action !== option.value && (
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {action === "new" && (
            <div className="space-y-4">
              <Label htmlFor="filetype" className="text-lg font-semibold">File type:</Label>
              <Select onValueChange={setSelectedFileType} value={selectedFileType}>
                <SelectTrigger id="filetype" className="w-full mt-2">
                  <SelectValue placeholder="Choose a file type" />
                </SelectTrigger>
                <SelectContent>
                  {mockFileTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFileType === "any" && (
                <div>
                  <Label htmlFor="custompattern" className="text-lg font-semibold">Custom file pattern (optional):</Label>
                  <Input 
                    id="custompattern" 
                    placeholder="e.g., *.pdf, document*.docx" 
                    className="w-full mt-2"
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {(action === "newInFolder" || action === "update" || action === "trash") && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Select a folder:</Label>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {folderPath.map((folder, index) => (
                  <span key={index}>
                    {folder} <ChevronRight className="inline h-4 w-4" />
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {folderPath.length > 0 && (
                  <Button variant="outline" onClick={handleBackFolder} className="w-full">
                    Back
                  </Button>
                )}
                {mockFolders.map((folder) => (
                  <Button key={folder} variant="outline" onClick={() => handleFolderSelect(folder)} className="w-full">
                    <Folder className="mr-2 h-4 w-4" />
                    {folder}
                  </Button>
                ))}
              </div>
              <div>
                <Label htmlFor="filepattern" className="text-lg font-semibold">File name pattern (optional):</Label>
                <Input id="filepattern" placeholder="e.g., *.pdf, document*.docx" className="w-full mt-2" />
              </div>
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
  )
}