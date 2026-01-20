"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ExampleQueries } from "./example-queries";
import { ErrorMessage } from "./error-message";
import { useChatHistory } from "@/hooks/use-chat-history";
import { askQuestion } from "@/lib/api";
import { ChatMessage } from "@/types";

export function ChatContainer() {
  const { messages, setMessages, clearHistory, isLoaded } = useChatHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastQuestionRef = useRef<string | null>(null);

  const handleSend = async (content: string) => {
    setError(null);
    lastQuestionRef.current = content;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await askQuestion(content);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastQuestionRef.current) {
      // Remove the last user message that failed
      setMessages((prev) => prev.slice(0, -1));
      handleSend(lastQuestionRef.current);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleClearHistory = () => {
    clearHistory();
    setError(null);
  };

  if (!isLoaded) {
    return (
      <Card className="flex h-[calc(100vh-8rem)] flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chat with AI Agent</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 shrink-0">
        <CardTitle className="text-lg">Chat with AI Agent</CardTitle>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
        {error && (
          <ErrorMessage
            error={error}
            onRetry={handleRetry}
            onDismiss={handleDismissError}
          />
        )}
        <MessageList messages={messages} isLoading={isLoading} />
        {messages.length === 0 && !isLoading && (
          <ExampleQueries onSelect={handleSend} disabled={isLoading} />
        )}
        <div className="shrink-0">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}
