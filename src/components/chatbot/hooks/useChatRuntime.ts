import { useState, useMemo, useCallback } from "react";
import { RepliersNLPService } from "../services/repliersAPI";
import { OpenAIService, type ChatResponse } from "../services/openaiService";
import { getErrorMessage } from "../utils/errorHandling";
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
 * ARCHITECTURE:
 * 1. ChatGPT handles ALL conversation and extracts search parameters using function calling
 * 2. When ChatGPT identifies a property search, it returns a natural language query
 * 3. Repliers NLP API parses the query and executes the search
 * 4. Results are shown to user AND sent back to ChatGPT for discussion
 *
 * Flow:
 * User: "I want a 3 bedroom condo in Toronto under $800k"
 *   → ChatGPT creates query: "3 bedroom condo for sale in Toronto under $800k"
 *   → NLP API parses and searches
 *   → Results displayed to user
 *   → ChatGPT discusses: "I found 12 condos matching your criteria..."
 *
 * User: "Tell me about the first one"
 *   → ChatGPT responds naturally using context
 *
 * @param repliersApiKey - Repliers API key (for NLP service)
 * @param openaiApiKey - OpenAI API key (optional - for enhanced conversation)
 * @param brokerageName - Brokerage name for ChatGPT system prompt
 * @param welcomeMessage - Initial welcome message from assistant
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
    () => (openaiApiKey ? new OpenAIService(openaiApiKey, brokerageName) : null),
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
   * Execute property search using Repliers NLP API
   */
  const executeSearch = useCallback(
    async (query: string): Promise<PropertyListing[]> => {
      console.group("🔍 Executing Property Search");
      console.log("Natural language query:", query);
      console.log("Has ChatGPT:", !!chatGPT);

      try {
        // Send query directly to NLP endpoint - let it do all the intelligence
        const nlpResponse = await nlpService.processQuery(query);

        // Execute the search with URL and body from NLP
        const listings = await nlpService.searchListings(
          nlpResponse.request.url,
          nlpResponse.request.body
        );

        console.log(`✅ NLP search completed: ${listings.length} listings`);
        console.groupEnd();
        return listings;
      } catch (error) {
        console.error("❌ Search failed:", error);
        console.error("Error details:", error);
        console.groupEnd();
        throw error;
      }
    },
    [nlpService, chatGPT]
  );

  /**
   * Check if a query is specific enough for direct NLP search
   */
  const isQuerySpecificEnough = (query: string): boolean => {
    const lowerQuery = query.toLowerCase().trim();

    // Too short or too vague
    if (lowerQuery.length < 5) return false;

    // Common vague queries
    const vagueTerms = [
      'hello', 'hi', 'hey', 'help', 'thanks', 'thank you',
      'a house', 'a condo', 'a home', 'property', 'properties',
      'looking', 'want', 'need', 'search', 'find'
    ];

    // Check if it's just a vague term
    if (vagueTerms.some(term => lowerQuery === term)) return false;

    // Check if query has location or specific criteria
    // Good queries typically have: number of bedrooms, location, price, or property type with location
    const hasNumbers = /\d+/.test(query);
    const hasPrice = /\$|dollar|k\b|million/.test(lowerQuery);
    const hasLocation = lowerQuery.split(' ').length >= 3; // Rough heuristic

    return hasNumbers || hasPrice || hasLocation;
  };

  /**
   * Handle message with ChatGPT orchestration
   * NOTE: This is only called when chatGPT exists (WITH OpenAI flow)
   */
  const handleChatGPTMessage = useCallback(
    async (userMessage: string): Promise<ChatResponse> => {
      if (!chatGPT) {
        throw new Error("ChatGPT not initialized - should use direct NLP flow");
      }

      return await chatGPT.chat(userMessage);
    },
    [chatGPT]
  );

  /**
   * Send a message to the chatbot
   * TWO FLOWS:
   * 1. WITH OpenAI: ChatGPT conversation → decides when to search → NLP API
   * 2. WITHOUT OpenAI: Direct NLP search (checks if query is specific enough first)
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
        // FLOW 1: WITH CHATGPT - Full conversational AI
        if (chatGPT) {
          const chatResponse = await handleChatGPTMessage(content);

          // Check if ChatGPT wants to search
          if (chatResponse.needsSearch && chatResponse.searchParams) {
            console.log("🔧 ChatGPT requested search with query:", chatResponse.searchParams.query);

            // Show ChatGPT's message first
            if (chatResponse.message) {
              const gptMessage: ChatMessage = {
                id: `gpt-${Date.now()}`,
                role: "assistant",
                content: chatResponse.message,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, gptMessage]);
            }

            // Show loading message
            const searchingMessage: ChatMessage = {
              id: `searching-${Date.now()}`,
              role: "assistant",
              content: "Searching for properties...",
              timestamp: new Date(),
              isLoading: true,
            };
            setMessages((prev) => [...prev, searchingMessage]);

            // Execute search with natural language query
            const listings = await executeSearch(chatResponse.searchParams.query);

            // Remove loading message
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== searchingMessage.id)
            );

            // Send results back to ChatGPT as tool response
            if (chatResponse.toolCallId) {
              chatGPT.addSearchResults(chatResponse.toolCallId, listings);
              chatGPT.addPropertyContext(listings, chatResponse.searchParams.query);
            }

            // Add results message
            const resultMessage: ChatMessage = {
              id: `result-${Date.now()}`,
              role: "assistant",
              content: `I found ${listings.length} ${
                listings.length === 1 ? "property" : "properties"
              } matching your criteria!`,
              propertyResults: listings.length > 0 ? listings : undefined,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, resultMessage]);
          } else {
            // Regular conversation response
            const responseMessage: ChatMessage = {
              id: `response-${Date.now()}`,
              role: "assistant",
              content: chatResponse.message,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, responseMessage]);
          }

          // Trim ChatGPT history to prevent context overflow
          chatGPT.trimHistory(20);
        }
        // FLOW 2: WITHOUT CHATGPT - Direct NLP search
        else {
          console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
          console.log("🔧 DIRECT NLP MODE (No OpenAI Key)");
          console.log("User query:", content);
          console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

          // Check if query is specific enough
          const isSpecific = isQuerySpecificEnough(content);
          console.log("Query specific enough?", isSpecific);

          if (!isSpecific) {
            console.log("→ Showing guidance message");
            const guidanceMessage: ChatMessage = {
              id: `guidance-${Date.now()}`,
              role: "assistant",
              content: "Please provide more details for your search. Include location and criteria like:\n\n• '3 bedroom condo in Toronto'\n• 'House under $800k in Orlando'\n• '2 bedroom apartment in downtown Miami'\n• 'Waterfront property with dock in Tampa'",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, guidanceMessage]);
            setIsLoading(false);
            return;
          }

          // Execute direct NLP search
          console.log("→ Executing NLP search...");

          // Show loading message
          const searchingMessage: ChatMessage = {
            id: `searching-${Date.now()}`,
            role: "assistant",
            content: "Searching for properties...",
            timestamp: new Date(),
            isLoading: true,
          };
          setMessages((prev) => [...prev, searchingMessage]);

          // Execute search
          console.log("→ Calling executeSearch with query:", content);
          const listings = await executeSearch(content);
          console.log("→ Search returned", listings.length, "listings");

          // Remove loading message
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== searchingMessage.id)
          );

          // Add results message
          const resultMessage: ChatMessage = {
            id: `result-${Date.now()}`,
            role: "assistant",
            content: `I found ${listings.length} ${
              listings.length === 1 ? "property" : "properties"
            } matching your criteria!`,
            propertyResults: listings.length > 0 ? listings : undefined,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, resultMessage]);
          console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
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
    [isLoading, handleChatGPTMessage, executeSearch, chatGPT]
  );

  /**
   * Reset conversation and all contexts
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
