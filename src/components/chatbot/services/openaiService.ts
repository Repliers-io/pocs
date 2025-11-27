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
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
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
- When users describe what they're looking for, the system will automatically search and show properties
- Discuss property details, neighborhoods, and answer real estate questions
- Be warm, professional, and focused on helping them find a home

Important:
- You DON'T need to execute searches yourself - the system handles that
- When property results are shown, acknowledge them and offer to help refine the search
- Keep responses concise (2-3 sentences max) - this is a chat interface
- Guide the conversation toward understanding their property needs

Example conversation:
User: "Hi"
You: "Hello! I'm here to help you find your perfect property. What are you looking for?"

User: "3 bedroom condo"
You: "Great! I'll search for 3 bedroom condos. Any specific location or budget in mind?"
[System shows property results automatically]

User: "Under $800k in Toronto"
You: "Perfect! Here are condos in Toronto with 3 bedrooms under $800k. Would you like to refine by neighborhood or features?"
[System shows refined results]`;
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
   */
  async chat(userMessage: string): Promise<string> {
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
          model: "gpt-4o-mini", // Fast, affordable, great for chat
          messages: this.conversationHistory,
          temperature: 0.7,
          max_tokens: 150, // Keep responses concise for chat
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error(`❌ OpenAI API error: ${response.status}`);
        console.groupEnd();
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: ChatCompletionResponse = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Add assistant response to history
      this.conversationHistory.push({
        role: "assistant",
        content: assistantMessage,
      });

      console.log("✅ ChatGPT response:", assistantMessage);
      console.groupEnd();

      return assistantMessage;
    } catch (error) {
      console.error("❌ ChatGPT error:", error);
      console.groupEnd();
      throw error;
    }
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
