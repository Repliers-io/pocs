/**
 * HTTP/SSE-based MCP Service Client
 * Connects to a running MCP server via HTTP/SSE transport
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import type { PropertyListing } from "../types";

export interface SearchParameters {
  query?: string;
  city?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  class?: "condo" | "residential" | "commercial";
  status?: "Active" | "Sold" | "Leased";
  minDate?: string;
  maxDate?: string;
}

/**
 * Repliers MCP Service - HTTP/SSE Client
 * Connects to a running MCP server via HTTP/SSE
 */
export class RepliersMCPServiceHttp {
  private client: Client | null = null;
  private transport: SSEClientTransport | null = null;
  private serverUrl: string;
  private isConnected: boolean = false;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }

  async connect(): Promise<void> {
    try {
      console.log(`[MCP HTTP] Connecting to ${this.serverUrl}...`);

      // Create SSE client transport
      this.transport = new SSEClientTransport(
        new URL(this.serverUrl)
      );

      // Create MCP client
      this.client = new Client(
        {
          name: "repliers-chatbot-client",
          version: "1.0.0",
        },
        {
          capabilities: {},
        }
      );

      // Connect to server
      await this.client.connect(this.transport);

      // List available tools
      const tools = await this.client.listTools();
      console.log(`[MCP HTTP] Connected! Available tools:`, tools.tools.map(t => t.name));

      this.isConnected = true;
    } catch (error) {
      console.error("[MCP HTTP] Failed to connect:", error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.transport = null;
      this.isConnected = false;
      console.log("[MCP HTTP] Disconnected");
    }
  }

  isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  /**
   * Search for property listings using MCP "search" tool
   */
  async searchListings(params: SearchParameters): Promise<PropertyListing[]> {
    if (!this.client || !this.isConnected) {
      throw new Error("MCP client not connected");
    }

    try {
      console.log("[MCP HTTP] Calling search tool with params:", params);

      const result = await this.client.callTool({
        name: "search",
        arguments: params as unknown as Record<string, unknown>,
      }) as any;

      console.log("[MCP HTTP] Search result:", result);

      // Parse the result
      if (result.content && result.content.length > 0) {
        const textContent = result.content.find((c: any) => c.type === "text");
        if (textContent && "text" in textContent) {
          try {
            const data = JSON.parse(textContent.text);
            return this.normalizeListings(data.listings || data);
          } catch (e) {
            console.error("[MCP HTTP] Failed to parse search results:", e);
            return [];
          }
        }
      }

      return [];
    } catch (error) {
      console.error("[MCP HTTP] Search failed:", error);
      throw error;
    }
  }

  /**
   * Get a single listing by MLS number
   */
  async getListing(mlsNumber: string): Promise<PropertyListing | null> {
    if (!this.client || !this.isConnected) {
      throw new Error("MCP client not connected");
    }

    try {
      console.log(`[MCP HTTP] Getting listing ${mlsNumber}`);

      const result = await this.client.callTool({
        name: "get-a-listing",
        arguments: { mlsNumber },
      }) as any;

      if (result.content && result.content.length > 0) {
        const textContent = result.content.find((c: any) => c.type === "text");
        if (textContent && "text" in textContent) {
          try {
            const data = JSON.parse(textContent.text);
            const normalized = this.normalizeListings([data]);
            return normalized[0] || null;
          } catch (e) {
            console.error("[MCP HTTP] Failed to parse listing:", e);
            return null;
          }
        }
      }

      return null;
    } catch (error) {
      console.error("[MCP HTTP] Get listing failed:", error);
      throw error;
    }
  }

  /**
   * Find similar listings to a given MLS number
   */
  async findSimilarListings(mlsNumber: string): Promise<PropertyListing[]> {
    if (!this.client || !this.isConnected) {
      throw new Error("MCP client not connected");
    }

    try {
      console.log(`[MCP HTTP] Finding similar listings to ${mlsNumber}`);

      const result = await this.client.callTool({
        name: "find-similar-listings",
        arguments: { mlsNumber },
      }) as any;

      if (result.content && result.content.length > 0) {
        const textContent = result.content.find((c: any) => c.type === "text");
        if (textContent && "text" in textContent) {
          try {
            const data = JSON.parse(textContent.text);
            return this.normalizeListings(data.listings || data);
          } catch (e) {
            console.error("[MCP HTTP] Failed to parse similar listings:", e);
            return [];
          }
        }
      }

      return [];
    } catch (error) {
      console.error("[MCP HTTP] Find similar listings failed:", error);
      throw error;
    }
  }

  /**
   * Normalize raw listings from API to PropertyListing format
   */
  private normalizeListings(rawListings: any[]): PropertyListing[] {
    return rawListings
      .map((raw) => {
        try {
          return {
            mlsNumber: raw.mlsNumber,
            listPrice: raw.listPrice,
            bedrooms: raw.details?.numBedrooms || 0,
            bathrooms: raw.details?.numBathrooms || 0,
            sqft: this.parseSqft(raw.details?.sqft),
            address: {
              streetNumber: raw.address?.streetNumber || "",
              streetName: raw.address?.streetName || "",
              streetSuffix: raw.address?.streetSuffix,
              city: raw.address?.city || "",
              province: raw.address?.province,
              postalCode: raw.address?.postalCode,
            },
            images: raw.images || [],
            propertyType: raw.details?.propertyType,
            status: raw.standardStatus || raw.status,
            description: raw.details?.description,
            listDate: raw.listDate,
            daysOnMarket: raw.daysOnMarket || raw.simpleDaysOnMarket,
          } as PropertyListing;
        } catch (error) {
          console.error("[MCP HTTP] Failed to normalize listing:", error);
          return null;
        }
      })
      .filter((listing): listing is PropertyListing => listing !== null);
  }

  /**
   * Parse sqft string from API (e.g., "1200-1400" or "5000 +")
   */
  private parseSqft(sqftString?: string): number | undefined {
    if (!sqftString) return undefined;

    // Remove any non-numeric characters except dash and period
    const cleaned = sqftString.replace(/[^\d\-\.]/g, "");

    // Handle range (e.g., "1200-1400") - take the first number
    if (cleaned.includes("-")) {
      const firstNum = cleaned.split("-")[0];
      return parseInt(firstNum, 10);
    }

    // Handle single number
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? undefined : parsed;
  }
}
