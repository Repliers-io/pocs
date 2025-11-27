import { useState, useMemo, useCallback } from "react";
import { RepliersNLPService } from "../services/repliersAPI";
import { OpenAIService } from "../services/openaiService";
import {
  isPropertySearchQuery,
  getErrorMessage,
} from "../utils/errorHandling";
import { DEFAULT_WELCOME_MESSAGE } from "../utils/constants";
import type { ChatMessage, PropertyListing } from "../types";

export interface ChatRuntime {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => void;
  resetConversation: () => void;
}

/**
 * Chat Runtime Hook with ChatGPT + Repliers NLP Integration
 *
 * Manages chat state and intelligently routes between:
 * - ChatGPT for conversational AI and general questions
 * - Repliers NLP for property searches
 *
 * Features:
 * - Natural conversation with ChatGPT
 * - Automatic property search detection
 * - Property results integrated into conversation
 * - Maintains context across both services
 * - Handles errors gracefully with user-friendly messages
 *
 * @param repliersApiKey - Repliers API key for NLP and listings APIs
 * @param openaiApiKey - OpenAI API key for ChatGPT (optional)
 * @param brokerageName - Brokerage name for ChatGPT system prompt
 * @param welcomeMessage - Initial welcome message from assistant
 * @returns ChatRuntime object with messages, loading state, and sendMessage function
 */
export function useChatRuntime(
  repliersApiKey: string,
  openaiApiKey?: string,
  brokerageName: string = "Real Estate Assistant",
  welcomeMessage: string = DEFAULT_WELCOME_MESSAGE
): ChatRuntime {
  // Initialize services (memoized to avoid recreating on every render)
  const nlpService = useMemo(
    () => new RepliersNLPService(repliersApiKey),
    [repliersApiKey]
  );

  const chatGPT = useMemo(
    () => openaiApiKey ? new OpenAIService(openaiApiKey, brokerageName) : null,
    [openaiApiKey, brokerageName]
  );

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Process property search query using NLP
   */
  const processPropertySearch = useCallback(
    async (userMessage: string): Promise<PropertyListing[]> => {
      // Step 1: Call NLP API to understand the query
      console.log("🔍 Processing property search:", userMessage);
      const nlpResponse = await nlpService.processQuery(userMessage);

      // Step 2: Show NLP summary as loading message
      const searchingMessage: ChatMessage = {
        id: `searching-${Date.now()}`,
        role: "assistant",
        content: `${nlpResponse.summary || "Searching for properties"}...`,
        timestamp: new Date(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, searchingMessage]);

      // Step 3: Fetch property listings
      const listings = await nlpService.searchListings(
        nlpResponse.request.url,
        nlpResponse.request.body
      );

      // Step 4: Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.id !== searchingMessage.id));

      return listings;
    },
    [nlpService]
  );

  /**
   * Handle messages with ChatGPT
   */
  const handleChatGPTMessage = useCallback(
    async (userMessage: string, listings?: PropertyListing[]): Promise<string> => {
      if (!chatGPT) {
        // Fallback if no OpenAI key
        if (listings && listings.length > 0) {
          return `I found ${listings.length} ${
            listings.length === 1 ? "property" : "properties"
          } that match your search!`;
        }
        return "I specialize in helping you find properties! Try asking me something like '3 bedroom condo in Toronto' or 'house under $800k with a backyard'.";
      }

      // Add property context to ChatGPT if we just searched
      if (listings) {
        chatGPT.addPropertyContext(listings, userMessage);
      }

      // Get ChatGPT response
      return await chatGPT.chat(userMessage);
    },
    [chatGPT]
  );

  /**
   * Send a message to the chatbot
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Detect if this is a property search query
        const isPropertyQuery = isPropertySearchQuery(content);

        if (isPropertyQuery) {
          // PROPERTY SEARCH FLOW
          // 1. Search for properties using Repliers NLP
          const listings = await processPropertySearch(content);

          // 2. Get ChatGPT response about the results (or fallback message)
          const response = await handleChatGPTMessage(content, listings);

          // 3. Add message with property results
          const resultMessage: ChatMessage = {
            id: `result-${Date.now()}`,
            role: "assistant",
            content: response,
            propertyResults: listings.length > 0 ? listings : undefined,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, resultMessage]);
        } else {
          // CONVERSATION FLOW (non-property query)
          // Use ChatGPT for conversation, or fallback to guidance
          const response = await handleChatGPTMessage(content);

          const responseMessage: ChatMessage = {
            id: `response-${Date.now()}`,
            role: "assistant",
            content: response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, responseMessage]);
        }

        // Trim ChatGPT history to prevent context overflow
        if (chatGPT) {
          chatGPT.trimHistory(20);
        }
      } catch (error) {
        console.error("Error processing message:", error);

        // Remove any loading messages
        setMessages((prev) => prev.filter((msg) => !msg.isLoading));

        // Add error message
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: getErrorMessage(error),
          timestamp: new Date(),
          error: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, processPropertySearch, handleChatGPTMessage, chatGPT]
  );

  /**
   * Reset conversation and NLP context
   */
  const resetConversation = useCallback(() => {
    nlpService.resetContext();
    if (chatGPT) {
      chatGPT.resetConversation();
    }
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      },
    ]);
    setIsLoading(false);
  }, [nlpService, chatGPT, welcomeMessage]);

  return {
    messages,
    isLoading,
    sendMessage,
    resetConversation,
  };
}
