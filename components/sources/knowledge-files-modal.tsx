"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, ChevronDown, ChevronUp } from "lucide-react"
import { getKnowledgeFiles } from "@/lib/api"
import { KnowledgeFile } from "@/types"
import { cn } from "@/lib/utils"

interface KnowledgeFilesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileCard({ file }: { file: KnowledgeFile }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border bg-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <div>
            <h4 className="font-medium">{file.title}</h4>
            <p className="text-xs text-muted-foreground">
              {file.filename} - {formatFileSize(file.size_bytes)}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          expanded ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="border-t p-4">
          <ScrollArea className="max-h-64">
            <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
              {file.content}
            </pre>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export function KnowledgeFilesModal({
  open,
  onOpenChange,
}: KnowledgeFilesModalProps) {
  const [files, setFiles] = useState<KnowledgeFile[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      setError(null)
      setFiles([])
      setTotal(0)
      getKnowledgeFiles()
        .then((data) => {
          setFiles(data.files)
          setTotal(data.total)
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Failed to load knowledge files"
          )
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Knowledge Base Documents</DialogTitle>
          <DialogDescription>
            Documents used for RAG (Pinecone Vector DB) - {total} files
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <p className="text-destructive text-center py-4">{error}</p>
          ) : files.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No knowledge files found
            </p>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <FileCard key={file.filename} file={file} />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
