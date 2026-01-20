import {
  Database,
  DollarSign,
  Coins,
  ArrowRightLeft,
  FileText,
  HelpCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const sourceConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  ORDER: {
    label: "Order",
    icon: Database,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  REVENUE: {
    label: "Revenue",
    icon: DollarSign,
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  CURRENCY: {
    label: "Currency",
    icon: Coins,
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  EXCHANGE: {
    label: "Exchange",
    icon: ArrowRightLeft,
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  DOCS: {
    label: "Docs",
    icon: FileText,
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
}

const defaultConfig = {
  label: "Unknown",
  icon: HelpCircle,
  className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

interface SourceBadgeProps {
  source: string
  showIcon?: boolean
}

export function SourceBadge({ source, showIcon = true }: SourceBadgeProps) {
  const config = sourceConfig[source] || { ...defaultConfig, label: source }
  const Icon = config.icon

  return (
    <Badge variant="outline" className={cn("gap-1", config.className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  )
}
