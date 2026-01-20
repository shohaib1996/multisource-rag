"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { SourceBadge } from "./source-badge"
import { OrdersModal } from "./orders-modal"
import { PaymentsModal } from "./payments-modal"
import { KnowledgeFilesModal } from "./knowledge-files-modal"
import { getSources } from "@/lib/api"
import { Database, CreditCard, FileText, Eye } from "lucide-react"

// Helper to get string value from potentially nested response
function getSourceDescription(value: unknown): string {
  if (typeof value === "string") {
    return value
  }
  if (typeof value === "object" && value !== null) {
    // If it's an object, try to get a description or stringify it
    return JSON.stringify(value)
  }
  return String(value)
}

export function SourcesPanel() {
  const [sources, setSources] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ordersOpen, setOrdersOpen] = useState(false)
  const [paymentsOpen, setPaymentsOpen] = useState(false)
  const [knowledgeFilesOpen, setKnowledgeFilesOpen] = useState(false)

  useEffect(() => {
    async function fetchSources() {
      try {
        const data = await getSources()
        setSources(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sources")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSources()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Sources</CardTitle>
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const sourceKeys = Object.keys(sources || {})

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Sources</CardTitle>
          <CardDescription>Available knowledge sources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* View Data Buttons */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              View Training Data
            </p>
            <div className="grid gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-2"
                onClick={() => setOrdersOpen(true)}
              >
                <Database className="h-4 w-4" />
                View Orders
                <Eye className="h-3 w-3 ml-auto text-muted-foreground" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-2"
                onClick={() => setPaymentsOpen(true)}
              >
                <CreditCard className="h-4 w-4" />
                View Payments
                <Eye className="h-3 w-3 ml-auto text-muted-foreground" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start gap-2"
                onClick={() => setKnowledgeFilesOpen(true)}
              >
                <FileText className="h-4 w-4" />
                View Knowledge Files
                <Eye className="h-3 w-3 ml-auto text-muted-foreground" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Source List */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              All Sources
            </p>
            {sourceKeys.map((key) => (
              <div
                key={key}
                className="flex flex-col gap-1 rounded-lg border p-3"
              >
                <SourceBadge source={key} />
                <p className="text-xs text-muted-foreground">
                  {getSourceDescription(sources?.[key])}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <OrdersModal open={ordersOpen} onOpenChange={setOrdersOpen} />
      <PaymentsModal open={paymentsOpen} onOpenChange={setPaymentsOpen} />
      <KnowledgeFilesModal
        open={knowledgeFilesOpen}
        onOpenChange={setKnowledgeFilesOpen}
      />
    </>
  )
}
