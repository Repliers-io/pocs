import { useState, useMemo, useCallback } from "react";
import { RepliersNLPService } from "../services/repliersAPI";
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
 * Chat Runtime Hook with Repliers NLP Integration
 *
 * Manages chat state and integrates with Repliers NLP API for property searches.
 *
 * Features:
 * - Detects property search queries using keyword matching
 * - Calls Repliers NLP API to process natural language
 * - Fetches property listings based on NLP response
 * - Maintains conversation context using nlpId
 * - Handles errors gracefully with user-friendly messages
 *
 * @param repliersApiKey - Repliers API key for NLP and listings APIs
 * @param welcomeMessage - Initial welcome message from assistant
 * @returns ChatRuntime object with messages, loading state, and sendMessage function
 */
export function useChatRuntime(
  repliersApiKey: string,
  welcomeMessage: string = DEFAULT_WELCOME_MESSAGE
): ChatRuntime {
  // Initialize NLP service (memoized to avoid recreating on every render)
  const nlpService = useMemo(
    () => new RepliersNLPService(repliersApiKey),
    [repliersApiKey]
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
    async (userMessage: string): Promise<void> => {
      try {
        // Step 1: Call NLP API to understand the query
        console.log("🔍 Processing property search:", userMessage);
        const nlpResponse = await nlpService.processQuery(userMessage);

        // Step 2: Show NLP summary as loading message
        const searchingMessage: ChatMessage = {
          id: `searching-${Date.now()}`,
          role: "assistant",
          content: `${nlpResponse.summary}...`,
          timestamp: new Date(),
          isLoading: true,
        };
        setMessages((prev) => [...prev, searchingMessage]);

        // Step 3: Fetch property listings
        const listings = await nlpService.searchListings(
          nlpResponse.request.url,
          nlpResponse.request.body
        );

        // Step 4: Remove loading message and add results
        setMessages((prev) => {
          const withoutLoading = prev.filter((msg) => msg.id !== searchingMessage.id);

          // Create result message
          const resultMessage: ChatMessage = {
            id: `result-${Date.now()}`,
            role: "assistant",
            content:
              listings.length > 0
                ? `I found ${listings.length} ${
                    listings.length === 1 ? "property" : "properties"
                  } that match your search!`
                : "I couldn't find any properties matching those criteria. Try adjusting your search.",
            propertyResults: listings,
            timestamp: new Date(),
          };

          return [...withoutLoading, resultMessage];
        });
      } catch (error) {
        console.error("Error processing property search:", error);

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
      }
    },
    [nlpService]
  );

  /**
   * Handle non-property queries
   */
  const handleNonPropertyQuery = useCallback(() => {
    const helpMessage: ChatMessage = {
      id: `help-${Date.now()}`,
      role: "assistant",
      content:
        "I specialize in helping you find properties! Try asking me something like:\n\n" +
        "• '3 bedroom condo in Toronto'\n" +
        "• 'House under $800k with a backyard'\n" +
        "• 'Modern apartment with white kitchen'\n\n" +
        "What are you looking for?",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, helpMessage]);
  }, []);

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
        if (isPropertySearchQuery(content)) {
          await processPropertySearch(content);
        } else {
          // Not a property search - provide helpful guidance
          handleNonPropertyQuery();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, processPropertySearch, handleNonPropertyQuery]
  );

  /**
   * Reset conversation and NLP context
   */
  const resetConversation = useCallback(() => {
    nlpService.resetContext();
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: new Date(),
      },
    ]);
    setIsLoading(false);
  }, [nlpService, welcomeMessage]);

  return {
    messages,
    isLoading,
    sendMessage,
    resetConversation,
  };
}
