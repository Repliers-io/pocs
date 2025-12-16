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
  query?: string;
  city?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  type?: "sale" | "lease"; // For sale or for lease
  class?: "condo" | "residential" | "commercial"; // Broad property classification
  keywords?: string[]; // Lifestyle/feature keywords (e.g., "horse", "wine cellar", "pool")
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
- Ask clarifying questions about their needs (bedrooms, budget, location, features)
- **IMPORTANT**: Early on, determine if they want to BUY (type: "sale") or RENT (type: "lease")
- When you have enough information, use the search_properties tool to find listings
- Discuss property details, neighborhoods, and answer real estate questions
- Be warm, professional, and focused on helping them find a home

Important:
- ALWAYS set type to "sale" for buying or "lease" for renting (never leave it unset)
- Use the "class" parameter for broad categorization:
  - "condo" for condominiums/apartments
  - "residential" for houses/townhouses/single-family homes
  - "commercial" for commercial properties
- Use "propertyType" for specific types like "House", "Townhouse", "Apartment"
- **KEYWORDS**: Extract lifestyle/feature keywords that aren't captured by standard filters:
  - Amenities: "pool", "wine cellar", "home theater", "gym", "sauna"
  - Lifestyle: "horse farm", "equestrian", "waterfront", "golf course"
  - Features: "fireplace", "hardwood floors", "granite counters", "stainless steel"
  - Outdoor: "deck", "patio", "garden", "yard", "balcony"
- Use the search_properties tool when you understand what the user wants
- Build up search parameters from conversation (city, bedrooms, price, etc.)
- Keep responses concise (2-3 sentences max) - this is a chat interface
- Guide the conversation toward understanding their property needs

Example conversations:
User: "Hi"
You: "Hello! I'm here to help you find your perfect property. Are you looking to buy or rent?"

User: "I want to buy a 3 bedroom condo"
You: "Great! Where would you like to search?"

User: "Toronto under $800k"
You: [Call search_properties with city: "Toronto", bedrooms: 3, maxPrice: 800000, class: "condo", type: "sale"]
     "Perfect! Let me find 3 bedroom condos for sale in Toronto under $800k for you."

User: "I'm looking for a horse farm in Orlando"
You: [Call search_properties with city: "Orlando", type: "sale", keywords: ["horse", "farm", "equestrian", "stable", "barn"]]
     "Great! Let me search for horse farms and equestrian properties for sale in Orlando."

User: "House with pool and wine cellar"
You: [Call search_properties with type: "sale", class: "residential", keywords: ["pool", "wine cellar"]]
     "I'll find houses with pools and wine cellars for you! What's your preferred location?"`;
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
                  "Search for real estate listings based on user criteria. Use this when the user provides enough information to search (location, price, bedrooms, etc.)",
                parameters: {
                  type: "object",
                  properties: {
                    city: {
                      type: "string",
                      description: "City name (e.g., 'Toronto', 'Vancouver')",
                    },
                    province: {
                      type: "string",
                      description: "Province/state code (e.g., 'ON', 'BC', 'CA')",
                    },
                    minPrice: {
                      type: "number",
                      description: "Minimum price in dollars",
                    },
                    maxPrice: {
                      type: "number",
                      description: "Maximum price in dollars",
                    },
                    bedrooms: {
                      type: "number",
                      description: "Number of bedrooms",
                    },
                    bathrooms: {
                      type: "number",
                      description: "Number of bathrooms",
                    },
                    propertyType: {
                      type: "string",
                      description:
                        "Property type (e.g., 'Condo', 'House', 'Townhouse', 'Apartment')",
                    },
                    type: {
                      type: "string",
                      enum: ["sale", "lease"],
                      description: "REQUIRED: Use 'sale' for buying, 'lease' for renting. Never leave unset.",
                    },
                    class: {
                      type: "string",
                      enum: ["condo", "residential", "commercial"],
                      description: "Broad property classification: 'condo' for condominiums, 'residential' for houses/townhouses, 'commercial' for commercial properties",
                    },
                    keywords: {
                      type: "array",
                      items: { type: "string" },
                      description: "Lifestyle/feature keywords for unique property characteristics not covered by standard filters. Examples: ['pool', 'wine cellar'], ['horse', 'farm', 'equestrian'], ['waterfront', 'dock'], ['home theater'], ['fireplace', 'hardwood floors']. Extract ALL relevant amenities, features, and lifestyle terms from user's query.",
                    },
                  },
                  required: [],
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
