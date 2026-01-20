"use client"

import { Button } from "@/components/ui/button"
import {
  Database,
  DollarSign,
  Coins,
  ArrowRightLeft,
  FileText,
  Layers,
} from "lucide-react"

const exampleQueries = [
  {
    label: "Order Status",
    query: "What is the status of order 1?",
    icon: Database,
  },
  {
    label: "Revenue",
    query: "What was our revenue in January 2025?",
    icon: DollarSign,
  },
  {
    label: "Convert Currency",
    query: "Convert 100 USD to EUR",
    icon: Coins,
  },
  {
    label: "Exchange Rate",
    query: "What is the USD to JPY exchange rate?",
    icon: ArrowRightLeft,
  },
  {
    label: "Refund Policy",
    query: "What is the refund policy?",
    icon: FileText,
  },
  {
    label: "Multi-Intent",
    query: "Show order 1 status and the shipping policy",
    icon: Layers,
  },
]

interface ExampleQueriesProps {
  onSelect: (query: string) => void
  disabled?: boolean
}

export function ExampleQueries({ onSelect, disabled }: ExampleQueriesProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Try an example:</p>
      <div className="flex flex-wrap gap-2">
        {exampleQueries.map((example) => {
          const Icon = example.icon
          return (
            <Button
              key={example.label}
              variant="outline"
              size="sm"
              onClick={() => onSelect(example.query)}
              disabled={disabled}
              className="gap-1.5"
            >
              <Icon className="h-3.5 w-3.5" />
              {example.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
