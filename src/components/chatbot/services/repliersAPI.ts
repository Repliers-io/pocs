import type {
  NLPResponse,
  PropertyListing,
  ListingsResponse,
} from "../types";

/**
 * Repliers NLP Service
 *
 * Handles communication with Repliers NLP API for natural language property searches.
 * Maintains conversation context using nlpId for multi-turn conversations.
 *
 * @example
 * ```typescript
 * const service = new RepliersNLPService("your-api-key");
 *
 * // First query
 * const nlp1 = await service.processQuery("3 bedroom condo in Toronto");
 * const results1 = await service.searchListings(nlp1.request.url, nlp1.request.body);
 *
 * // Refine search (uses same nlpId for context)
 * const nlp2 = await service.processQuery("under $800k");
 * const results2 = await service.searchListings(nlp2.request.url, nlp2.request.body);
 * ```
 */
export class RepliersNLPService {
  private apiKey: string;
  private baseUrl: string = "https://api.repliers.io";
  private currentNlpId: string | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Process a natural language query using Repliers NLP endpoint
   *
   * @param prompt - User's natural language query (e.g., "3 bedroom condo in Toronto")
   * @returns NLP response with search URL, optional body params, and human-readable summary
   * @throws Error if NLP API returns error or query is irrelevant (406 status)
   */
  async processQuery(prompt: string): Promise<NLPResponse> {
    console.group("🧠 Repliers NLP API Call");
    console.log("Prompt:", prompt);
    console.log("Current nlpId:", this.currentNlpId || "none (new conversation)");

    try {
      const requestBody = {
        prompt,
        ...(this.currentNlpId && { nlpId: this.currentNlpId }),
      };

      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${this.baseUrl}/nlp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "repliers-api-key": this.apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 406) {
          console.error("❌ Query not relevant to property search (406)");
          console.groupEnd();
          throw new Error("IRRELEVANT_QUERY");
        }
        console.error(`❌ NLP API error: ${response.status}`);
        console.groupEnd();
        throw new Error(`NLP API error: ${response.status}`);
      }

      const data: NLPResponse = await response.json();
      this.currentNlpId = data.nlpId;

      console.log("✅ NLP Response:");
      console.log("  - nlpId:", data.nlpId);
      console.log("  - summary:", data.summary);
      console.log("  - url:", data.request.url);
      if (data.request.body?.imageSearchItems) {
        console.log(
          "  - imageSearchItems:",
          data.request.body.imageSearchItems
        );
      }
      console.groupEnd();

      return data;
    } catch (error) {
      console.error("❌ NLP processing error:", error);
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Execute property search using URL from NLP response
   *
   * @param url - Full URL from NLP response (includes search parameters)
   * @param body - Optional body with imageSearchItems for visual search
   * @returns Array of property listings
   * @throws Error if Listings API returns error
   */
  async searchListings(
    url: string,
    body?: NLPResponse["request"]["body"]
  ): Promise<PropertyListing[]> {
    console.group("🏠 Repliers Listings API Call");
    console.log("URL:", url);
    console.log("Body:", body ? JSON.stringify(body, null, 2) : "none");

    try {
      const response = await fetch(url, {
        method: body ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
          "repliers-api-key": this.apiKey,
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error(`❌ Listings API error: ${response.status}`);
        console.groupEnd();
        throw new Error(`Listings API error: ${response.status}`);
      }

      const data: ListingsResponse = await response.json();
      const listings = data.listings || [];

      console.log(`✅ Found ${listings.length} properties`);
      if (listings.length > 0) {
        console.log("First listing (full object):", listings[0]);
        console.log("First listing (parsed):", {
          mlsNumber: listings[0].mlsNumber,
          price: listings[0].listPrice,
          bedrooms: listings[0].bedrooms,
          bathrooms: listings[0].bathrooms,
          address: `${listings[0].address?.streetNumber} ${listings[0].address?.streetName}, ${listings[0].address?.city}`,
        });
      }
      console.groupEnd();

      return listings;
    } catch (error) {
      console.error("❌ Listings search error:", error);
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Reset conversation context
   * Call this when starting a new search or conversation
   */
  resetContext(): void {
    console.log("🔄 Resetting conversation context (clearing nlpId)");
    this.currentNlpId = null;
  }

  /**
   * Get current nlpId for debugging
   * @returns Current nlpId or null if no conversation context
   */
  getCurrentNlpId(): string | null {
    return this.currentNlpId;
  }
}
