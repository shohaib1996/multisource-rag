"use client"

import ReactMarkdown from "react-markdown"
import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatResponse } from "@/lib/format-response"
import { ChatMessage } from "@/types"

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"
  const roleLabel = isUser ? "You" : "AI Assistant"

  return (
    <article
      className={cn(
        "flex gap-3 p-4",
        isUser ? "flex-row-reverse animate-slide-in-right" : "flex-row animate-slide-in-left"
      )}
      aria-label={`Message from ${roleLabel}`}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {isUser ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{formatResponse(message.content)}</ReactMarkdown>
            </div>
          )}
        </div>
        <time
          className="text-xs text-muted-foreground"
          dateTime={message.timestamp.toISOString()}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
    </article>
  )
}
