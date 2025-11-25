import { useEffect, useState } from "react";
import {
  MOCK_RESPONSE_MESSAGE,
  MOCK_RESPONSE_DELAY,
  DEFAULT_WELCOME_MESSAGE,
} from "../utils/constants";

// TODO: Replace this mock runtime with real MCP integration
// This is a temporary implementation for testing the UI

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatRuntime {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => void;
}

export function useChatRuntime(welcomeMessage: string): ChatRuntime {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: welcomeMessage || DEFAULT_WELCOME_MESSAGE,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate bot response with delay
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: MOCK_RESPONSE_MESSAGE,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, MOCK_RESPONSE_DELAY);
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}
