import { useState, useMemo, useCallback, useEffect } from "react";
import { RepliersNLPService } from "../services/repliersAPI";
// import { RepliersMCPService } from "../services/mcpService"; // Removed for client-side compatibility
import { RepliersMCPServiceHttp } from "../services/mcpService.http";
import { OpenAIService, type ChatResponse } from "../services/openaiService";
import { getErrorMessage } from "../utils/errorHandling";
import { DEFAULT_WELCOME_MESSAGE } from "../utils/constants";
import type { ChatMessage, PropertyListing, MCPConfig } from "../types";

export interface ChatRuntime {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => void;
  resetConversation: () => void;
}

/**
 * Chat Runtime Hook with ChatGPT + MCP Integration (Step 4)
 *
 * NEW ARCHITECTURE:
 * 1. ChatGPT handles ALL conversation and extracts search parameters using function calling
 * 2. When ChatGPT identifies a property search, it returns structured search parameters
 * 3. MCP Service executes the search using Repliers MCP Server
 * 4. Results are shown to user AND sent back to ChatGPT for discussion
 *
 * Flow:
 * User: "I want a 3 bedroom condo in Toronto under $800k"
 *   → ChatGPT extracts: { city: "Toronto", bedrooms: 3, maxPrice: 800000, propertyType: "Condo" }
 *   → MCP searches with these parameters
 *   → Results displayed to user
 *   → ChatGPT discusses: "I found 12 condos matching your criteria..."
 *
 * User: "Tell me about the first one"
 *   → ChatGPT responds naturally using context
 *
 * Fallback: If no MCP config, uses direct Repliers NLP API
 *
 * @param repliersApiKey - Repliers API key (for fallback NLP service)
 * @param openaiApiKey - OpenAI API key (REQUIRED for Step 4)
 * @param mcpConfig - MCP server configuration (node path, server path)
 * @param brokerageName - Brokerage name for ChatGPT system prompt
 * @param welcomeMessage - Initial welcome message from assistant
 */
export function useChatRuntime(
  repliersApiKey: string,
  openaiApiKey?: string,
  mcpConfig?: MCPConfig,
  brokerageName: string = "Real Estate Assistant",
  welcomeMessage: string = DEFAULT_WELCOME_MESSAGE
): ChatRuntime {
  // Initialize services (memoized to avoid recreating on every render)
  const nlpService = useMemo(
    () => new RepliersNLPService(repliersApiKey),
    [repliersApiKey]
  );

  const mcpService = useMemo(() => {
    if (!mcpConfig?.enabled) return null;

    // HTTP/SSE mode
    if (mcpConfig.mode === "http") {
      return new RepliersMCPServiceHttp(mcpConfig.serverUrl);
    }

    // Stdio mode (legacy) - Not supported in browser environment
    if (mcpConfig.mode === "stdio") {
      console.warn("MCP stdio mode is not supported in browser environment. Please use 'http' mode.");
      return null;
    }

    return null;
  }, [mcpConfig, repliersApiKey]);

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
  const [mcpConnected, setMcpConnected] = useState(false);

  // Connect to MCP server on mount
  useEffect(() => {
    if (mcpService && !mcpConnected) {
      console.log("🔌 Attempting to connect to MCP server...");
      mcpService
        .connect()
        .then(() => {
          setMcpConnected(true);
          console.log("✅ MCP server connected successfully");
        })
        .catch((error) => {
          console.error("❌ Failed to connect to MCP server:", error);
          console.log("⚠️ Will fall back to direct NLP API");
        });
    }

    // Cleanup on unmount
    return () => {
      if (mcpService && mcpConnected) {
        mcpService.disconnect();
      }
    };
  }, [mcpService, mcpConnected]);

  /**
   * Execute property search using MCP or fallback to NLP
   */
  const executeSearch = useCallback(
    async (query: string): Promise<PropertyListing[]> => {
      console.group("🔍 Executing Property Search");
      console.log("Natural language query:", query);
      console.log("MCP connected:", mcpConnected);
      console.log("MCP service available:", !!mcpService);

      try {
        // TODO: Add MCP support with natural language query when available
        // For now, always use NLP API as it's designed for natural language
        console.log("Using NLP API");

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
        console.groupEnd();
        throw error;
      }
    },
    [mcpService, mcpConnected, nlpService]
  );

  /**
   * Handle message with ChatGPT orchestration
   */
  const handleChatGPTMessage = useCallback(
    async (userMessage: string): Promise<ChatResponse> => {
      if (!chatGPT) {
        // Fallback if no OpenAI key
        return {
          message:
            "I specialize in helping you find properties! Try asking me something like '3 bedroom condo in Toronto' or 'house under $800k with a backyard'.",
          needsSearch: false,
        };
      }

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
        // Step 1: Send to ChatGPT
        const chatResponse = await handleChatGPTMessage(content);

        // Step 2: Check if ChatGPT wants to search
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
          // IMPORTANT: This must happen BEFORE displaying results to user
          // OpenAI requires tool response after tool_call
          if (chatGPT && chatResponse.toolCallId) {
            chatGPT.addSearchResults(chatResponse.toolCallId, listings);
            // Also add property context so ChatGPT can discuss the results
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
