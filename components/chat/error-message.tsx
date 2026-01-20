"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, WifiOff, ServerOff } from "lucide-react"

interface ErrorMessageProps {
  error: string
  onRetry?: () => void
  onDismiss?: () => void
}

function getErrorDetails(error: string) {
  if (error.includes("fetch") || error.includes("network") || error.includes("Failed to fetch")) {
    return {
      title: "Connection Error",
      icon: WifiOff,
      description: "Unable to connect to the server. Please check your internet connection.",
    }
  }

  if (error.includes("500") || error.includes("502") || error.includes("503")) {
    return {
      title: "Server Error",
      icon: ServerOff,
      description: "The server is experiencing issues. Please try again later.",
    }
  }

  if (error.includes("404")) {
    return {
      title: "Not Found",
      icon: AlertCircle,
      description: "The requested resource was not found.",
    }
  }

  return {
    title: "Error",
    icon: AlertCircle,
    description: error,
  }
}

export function ErrorMessage({ error, onRetry, onDismiss }: ErrorMessageProps) {
  const { title, icon: Icon, description } = getErrorDetails(error)

  return (
    <Alert variant="destructive">
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <span>{description}</span>
        <div className="flex gap-2">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          )}
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
