"use client"

import { useState, FormEvent, KeyboardEvent } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
      role="search"
      aria-label="Chat input"
    >
      <label htmlFor="chat-input" className="sr-only">
        Ask a question
      </label>
      <Input
        id="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question..."
        disabled={isLoading || disabled}
        className="flex-1"
        aria-describedby="chat-input-hint"
        autoComplete="off"
      />
      <span id="chat-input-hint" className="sr-only">
        Press Enter to send your message
      </span>
      <Button
        type="submit"
        disabled={!input.trim() || isLoading || disabled}
        size="icon"
        aria-label={isLoading ? "Sending message..." : "Send message"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
      </Button>
    </form>
  )
}
