"use client"

import { useState, useEffect, useCallback } from "react"
import { ChatMessage } from "@/types"

const STORAGE_KEY = "multi-source-rag-chat-history"

interface StoredMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  sources?: string[]
}

export function useChatHistory() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: StoredMessage[] = JSON.parse(stored)
        const restored = parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })) as ChatMessage[]
        setMessages(restored)
      }
    } catch (error) {
      console.error("Failed to load chat history:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && messages.length > 0) {
      try {
        const toStore: StoredMessage[] = messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        }))
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
      } catch (error) {
        console.error("Failed to save chat history:", error)
      }
    }
  }, [messages, isLoaded])

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const clearHistory = useCallback(() => {
    setMessages([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error("Failed to clear chat history:", error)
    }
  }, [])

  return {
    messages,
    setMessages,
    addMessage,
    clearHistory,
    isLoaded,
  }
}
