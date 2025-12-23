import type { PropertyListing } from "../types";

/**
 * OpenAI ChatGPT Service
 *
 * Handles conversational AI using OpenAI's ChatGPT API.
 * Works alongside Repliers NLP for property searches.
 *
 * @example
 * ```typescript
 * const service = new OpenAIService("your-openai-key");
 * const response = await service.chat("Hello!");
 * ```
 */

interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface SearchParameters {
  query: string; // Natural language search query that will be sent directly to NLP endpoint
}

interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
      tool_calls?: ToolCall[];
    };
    finish_reason: string;
  }>;
}

export interface ChatResponse {
  message: string;
  searchParams?: SearchParameters;
  needsSearch: boolean;
  toolCallId?: string; // ID of the tool call, needed for tool response
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl: string = "https://api.openai.com/v1";
  private conversationHistory: ChatMessage[] = [];
  private systemPrompt: string;

  constructor(apiKey: string, brokerageName: string = "Real Estate Assistant") {
    this.apiKey = apiKey;
    this.systemPrompt = this.createSystemPrompt(brokerageName);
    this.initializeConversation();
  }

  /**
   * Create system prompt that guides ChatGPT behavior
   */
  private createSystemPrompt(brokerageName: string): string {
    return `You are a helpful and friendly real estate assistant for ${brokerageName}.

Your role:
- Help users find their ideal property through natural conversation
- Ask clarifying questions about their needs (bedrooms, budget, location, features, amenities)
- **IMPORTANT**: Early on, determine if they want to BUY or RENT
- Gather as much relevant information as you can without being pushy (2-3 questions max)
- When you have enough information, use the search_properties tool with a natural language query
- After showing results, help users refine their search or discuss specific properties
- When users want to refine (add filters, change criteria), trigger a NEW search with updated query
- Be warm, professional, and focused on helping them find a home

Search Strategy:
- DON'T extract structured parameters - let the AI search engine handle that
- DO create a natural, conversational search query with all the details
- **CRITICAL**: ALWAYS include "for sale" OR "for rent"/"for lease" in EVERY query - NEVER omit this
- Include: buy/rent intent, location, bedrooms, bathrooms, price, property type, features, amenities
- Example good query: "horse farm for sale outside Toronto with a barn or stable"
- Example good query: "3 bedroom condo for sale in Toronto under $800k"
- Example good query: "house for rent with a pool and wine cellar in Orlando"
- Example BAD query: "3 bedroom condo in Toronto" (missing "for sale" or "for rent")

Refinement Strategy:
- When user wants to refine (e.g., "under $800k", "with a pool", "in different area"), IMMEDIATELY trigger a new search
- Combine the original search criteria with the new refinement
- **CRITICAL**: Always maintain "for sale" or "for rent" in refined queries
- Example: Previous search was "3 bedroom condo for sale in Toronto", user says "under $800k" → Search: "3 bedroom condo for sale in Toronto under $800k"
- Don't just discuss - actually search again with the refined criteria

Conversation Flow:
1. Greet and ask: buy or rent?
2. Ask about location and basic needs (bedrooms, price range)
3. Ask if there are any special features or amenities they want
4. When you have enough info (usually 2-3 exchanges), search with a natural language query
5. After results, if user refines criteria → immediately search again with updated query
6. Keep responses concise (2-3 sentences max) - this is a chat interface

Example conversations:
User: "Hi"
You: "Hello! I'm here to help you find your perfect property. Are you looking to buy or rent?"

User: "I want to buy a 3 bedroom condo"
You: "Great! Where would you like to search, and do you have a budget in mind?"

User: "Toronto"
You: [Call search_properties with query: "3 bedroom condo for sale in Toronto"]
     "Perfect! Let me find 3 bedroom condos for sale in Toronto."

[After results are shown]
User: "Under $800k"
You: [Call search_properties with query: "3 bedroom condo for sale in Toronto under $800k"]
     "Let me refine that search to condos under $800k."

User: "I'm looking for a horse farm"
You: "Wonderful! Are you looking to buy or rent, and where would you like to search?"

User: "Buy, outside Toronto. Need a barn or stable"
You: [Call search_properties with query: "horse farm for sale outside Toronto with barn or stable"]
     "Great! Let me search for horse farms for sale outside Toronto with barns or stables."`;
  }

  /**
   * Initialize conversation with system prompt
   */
  private initializeConversation(): void {
    this.conversationHistory = [
      {
        role: "system",
        content: this.systemPrompt,
      },
    ];
  }

  /**
   * Add context about property search results to the conversation
   * This helps ChatGPT discuss the properties shown
   */
  addPropertyContext(listings: PropertyListing[], query: string): void {
    const contextMessage = `[Property Search Results]
Query: "${query}"
Found ${listings.length} properties.

${listings.slice(0, 3).map((listing, i) => `
${i + 1}. MLS #${listing.mlsNumber}
   Price: $${listing.listPrice.toLocaleString()}
   ${listing.bedrooms} bed, ${listing.bathrooms} bath${listing.sqft ? `, ${listing.sqft} sqft` : ""}
   ${listing.address.streetNumber} ${listing.address.streetName}, ${listing.address.city}
   Type: ${listing.propertyType || "N/A"}
`).join("")}

${listings.length > 3 ? `\n... and ${listings.length - 3} more properties` : ""}

The user can see these property cards in the chat. Acknowledge the results and offer to help them refine or discuss specific properties.`;

    this.conversationHistory.push({
      role: "system",
      content: contextMessage,
    });
  }

  /**
   * Send a message to ChatGPT and get a response
   * Returns both the message and optionally search parameters if ChatGPT wants to search
   */
  async chat(userMessage: string): Promise<ChatResponse> {
    console.group("🤖 OpenAI ChatGPT API Call");
    console.log("User message:", userMessage);

    try {
      // Add user message to history
      this.conversationHistory.push({
        role: "user",
        content: userMessage,
      });

      console.log("Conversation history length:", this.conversationHistory.length);
      console.log("Sending to OpenAI...");

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: this.conversationHistory,
          temperature: 0.7,
          max_tokens: 150,
          tools: [
            {
              type: "function",
              function: {
                name: "search_properties",
                description:
                  "Search for real estate listings using natural language. Use this when you have gathered enough information from the user (buy/rent, location, and any preferences). Create a complete, natural language query that includes ALL the details the user has provided.",
                parameters: {
                  type: "object",
                  properties: {
                    query: {
                      type: "string",
                      description: "A complete natural language search query that includes all user requirements. Examples: '3 bedroom condo for sale in Toronto under $800k', 'horse farm for sale outside Toronto with barn or stable', 'house to rent with pool and wine cellar in Orlando'. Always include buy/rent, location, and all features/amenities mentioned.",
                    },
                  },
                  required: ["query"],
                },
              },
            },
          ],
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error(`❌ OpenAI API error: ${response.status}`);
        console.groupEnd();
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: ChatCompletionResponse = await response.json();
      const choice = data.choices[0];
      const assistantMessage = choice.message.content || "";
      const toolCalls = choice.message.tool_calls;

      // Check if ChatGPT wants to call the search tool
      if (toolCalls && toolCalls.length > 0) {
        const searchToolCall = toolCalls.find(
          (tc) => tc.function.name === "search_properties"
        );

        if (searchToolCall) {
          console.log("🔧 ChatGPT requested tool call: search_properties");
          const searchParams: SearchParameters = JSON.parse(
            searchToolCall.function.arguments
          );
          console.log("Search parameters:", searchParams);

          // Add assistant message with tool call to history
          this.conversationHistory.push({
            role: "assistant",
            content: assistantMessage,
            tool_calls: toolCalls,
          });

          console.log("✅ ChatGPT response with search request");
          console.groupEnd();

          return {
            message: assistantMessage || "Let me search for properties...",
            searchParams,
            needsSearch: true,
            toolCallId: searchToolCall.id, // Return tool call ID for response
          };
        }
      }

      // Regular response without tool call
      this.conversationHistory.push({
        role: "assistant",
        content: assistantMessage,
      });

      console.log("✅ ChatGPT response:", assistantMessage);
      console.groupEnd();

      return {
        message: assistantMessage,
        needsSearch: false,
      };
    } catch (error) {
      console.error("❌ ChatGPT error:", error);
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Add search results to conversation as tool response
   * This lets ChatGPT know the search was executed and what was found
   */
  addSearchResults(
    toolCallId: string,
    listings: PropertyListing[]
  ): void {
    const result = {
      found: listings.length,
      sample: listings.slice(0, 3).map((l) => ({
        mlsNumber: l.mlsNumber,
        price: l.listPrice,
        bedrooms: l.bedrooms,
        bathrooms: l.bathrooms,
        address: `${l.address.city}, ${l.address.province || ""}`,
      })),
    };

    this.conversationHistory.push({
      role: "tool",
      content: JSON.stringify(result),
      tool_call_id: toolCallId,
      name: "search_properties",
    });

    console.log("📊 Added search results to ChatGPT context:", result);
  }

  /**
   * Reset conversation history (start fresh)
   */
  resetConversation(): void {
    console.log("🔄 Resetting ChatGPT conversation");
    this.initializeConversation();
  }

  /**
   * Get conversation history for debugging
   */
  getConversationHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  /**
   * Trim conversation history to prevent context overflow
   * Keeps system prompt + last N messages
   */
  trimHistory(maxMessages: number = 10): void {
    if (this.conversationHistory.length > maxMessages + 1) {
      const systemPrompt = this.conversationHistory[0];
      const recentMessages = this.conversationHistory.slice(-(maxMessages));
      this.conversationHistory = [systemPrompt, ...recentMessages];
      console.log(`📝 Trimmed conversation history to ${this.conversationHistory.length} messages`);
    }
  }
}
