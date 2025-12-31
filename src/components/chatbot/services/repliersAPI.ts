import type {
  NLPResponse,
  PropertyListing,
  PropertyAddress,
  RawPropertyListing,
  ListingsResponse,
} from "../types";

/**
 * Normalize raw API listing to our UI interface
 * Passes through ALL raw data while adding convenient normalized fields
 */
function normalizeListingData(raw: RawPropertyListing): PropertyListing {
  // Parse sqft string to number for convenient access
  // Examples: "5000 +", "1200-1400", "2500"
  let sqft: number | undefined;
  if (raw.details?.sqft) {
    const sqftStr = raw.details.sqft.replace(/[^0-9-]/g, ""); // Remove non-numeric except dash
    if (sqftStr.includes("-")) {
      // Range like "1200-1400" - take the average
      const [min, max] = sqftStr.split("-").map(Number);
      sqft = Math.round((min + max) / 2);
    } else {
      sqft = parseInt(sqftStr, 10);
    }
  }

  // Format images with area prefix per Repliers Image Guide
  // https://help.repliers.com/en/article/listing-images-implementation-guide-198p8u8/
  let images = raw.images;
  if (images && images.length > 0 && raw.address?.area) {
    const area = raw.address.area.toLowerCase();
    images = images.map(img => {
      // If already has path, return as-is; otherwise add area prefix
      if (img.includes('/')) return img;
      return `${area}/${img}`;
    });
  }

  // Return ALL raw data plus convenient normalized fields at top level
  return {
    ...raw, // Pass through EVERYTHING from the API
    images, // Use formatted images with area prefix
    // Add convenient top-level fields for easy access
    bedrooms: raw.details?.numBedrooms || 0,
    bathrooms: raw.details?.numBathrooms || 0,
    sqft,
    propertyType: raw.details?.propertyType,
    status: raw.standardStatus, // Use "Active" instead of "A"
    description: raw.details?.description,
    daysOnMarket: raw.simpleDaysOnMarket || raw.daysOnMarket,
  };
}

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
   * @param prompt - User's natural language query (e.g., "3 bedroom condo for sale in Toronto under $800k")
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
      console.log("Full response:", JSON.stringify(data, null, 2));
      console.log("  - nlpId:", data.nlpId);
      console.log("  - summary:", data.summary);
      console.log("  - url:", data.request.url);
      if (data.request.body) {
        console.log("  - body:", JSON.stringify(data.request.body, null, 2));
        if (data.request.body.imageSearchItems) {
          console.log(
            "  - imageSearchItems:",
            data.request.body.imageSearchItems
          );
        }
      } else {
        console.log("  - body: none");
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
   * @param body - Optional body with imageSearchItems or other params from NLP
   * @returns Array of property listings
   * @throws Error if Listings API returns error
   */
  async searchListings(
    url: string,
    body?: NLPResponse["request"]["body"]
  ): Promise<PropertyListing[]> {
    // Add select=* to get ALL fields from API
    const fullUrl = url.includes('?') ? `${url}&select=*` : `${url}?select=*`;

    console.group("🏠 Repliers Listings API Call");
    console.log("URL:", fullUrl);
    console.log("Body:", body ? JSON.stringify(body, null, 2) : "none");

    try {
      const response = await fetch(fullUrl, {
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
      const rawListings = data.listings || [];

      console.log(`✅ Found ${rawListings.length} properties`);
      if (rawListings.length > 0) {
        console.log("First listing (raw API response):", rawListings[0]);

        // Normalize the data
        const normalized = normalizeListingData(rawListings[0]);
        console.log("First listing (normalized for UI):", {
          mlsNumber: normalized.mlsNumber,
          price: normalized.listPrice,
          bedrooms: normalized.bedrooms,
          bathrooms: normalized.bathrooms,
          sqft: normalized.sqft,
          propertyType: normalized.propertyType,
          status: normalized.status,
          address: `${normalized.address.streetNumber} ${normalized.address.streetName}, ${normalized.address.city}`,
        });
      }
      console.groupEnd();

      // Normalize all listings before returning
      return rawListings.map(normalizeListingData);
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
