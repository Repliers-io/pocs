import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { PropertyListing } from "../types";
import type {
  ListToolsResult,
  CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * MCP Tool Call Interface
 * Represents a tool available from the Repliers MCP server
 */
export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/**
 * Search parameters for Repliers MCP search tool
 */
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
 * Repliers MCP Service
 *
 * Connects to the Repliers MCP Server and provides access to real estate tools:
 * - search: Search for properties with various filters
 * - get-a-listing: Get detailed information for a specific property
 * - find-similar-listings: Find comparable properties
 * - get-address-history: Get historical listing activity
 * - property-types-styles: Get supported property types and styles
 *
 * Architecture:
 * 1. Client connects to MCP server via stdio transport
 * 2. Server exposes tools following MCP protocol
 * 3. Service wraps tool calls with TypeScript types
 * 4. Results are normalized to PropertyListing interface
 *
 * @example
 * ```typescript
 * const mcp = new RepliersMCPService("/path/to/node", "/path/to/mcpServer.js", "api-key");
 * await mcp.connect();
 * const listings = await mcp.searchListings({
 *   city: "Toronto",
 *   bedrooms: 3,
 *   maxPrice: 800000
 * });
 * await mcp.disconnect();
 * ```
 */
export class RepliersMCPService {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private availableTools: MCPTool[] = [];
  private nodePath: string;
  private serverPath: string;
  private apiKey: string;
  private isConnected: boolean = false;

  /**
   * @param nodePath - Absolute path to node executable (e.g., "/usr/local/bin/node")
   * @param serverPath - Absolute path to Repliers MCP server script (e.g., "/path/to/mcpServer.js")
   * @param apiKey - Repliers API key
   */
  constructor(nodePath: string, serverPath: string, apiKey: string) {
    this.nodePath = nodePath;
    this.serverPath = serverPath;
    this.apiKey = apiKey;
  }

  /**
   * Connect to Repliers MCP Server
   * Establishes stdio transport and retrieves available tools
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("✅ Already connected to MCP server");
      return;
    }

    console.group("🔌 Connecting to Repliers MCP Server");
    console.log("Node path:", this.nodePath);
    console.log("Server path:", this.serverPath);

    try {
      // Create stdio transport
      this.transport = new StdioClientTransport({
        command: this.nodePath,
        args: [this.serverPath],
        env: {
          ...process.env,
          REPLIERS_API_KEY: this.apiKey,
        },
      });

      // Initialize client
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
      const toolsResult: ListToolsResult = await this.client.listTools();
      this.availableTools = toolsResult.tools as MCPTool[];

      console.log(
        `✅ Connected! Found ${this.availableTools.length} tools:`,
        this.availableTools.map((t) => t.name)
      );
      console.groupEnd();

      this.isConnected = true;
    } catch (error) {
      console.error("❌ Failed to connect to MCP server:", error);
      console.groupEnd();
      throw new Error(`MCP connection failed: ${error}`);
    }
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) return;

    console.log("🔌 Disconnecting from MCP server");
    try {
      if (this.client) {
        await this.client.close();
      }
      this.isConnected = false;
      this.client = null;
      this.transport = null;
      console.log("✅ Disconnected");
    } catch (error) {
      console.error("❌ Error during disconnect:", error);
    }
  }

  /**
   * Get list of available MCP tools
   */
  getAvailableTools(): MCPTool[] {
    return this.availableTools;
  }

  /**
   * Search for property listings using MCP search tool
   *
   * @param params - Search parameters (city, price range, bedrooms, etc.)
   * @returns Array of property listings
   */
  async searchListings(params: SearchParameters): Promise<PropertyListing[]> {
    if (!this.isConnected || !this.client) {
      throw new Error("MCP client not connected. Call connect() first.");
    }

    console.group("🏠 MCP Tool Call: search");
    console.log("Parameters:", params);

    try {
      const result = await this.client.callTool({
        name: "search",
        arguments: params as Record<string, unknown>,
      });

      console.log("✅ Search completed");

      // Parse tool result
      const listings = this.parseToolResult(result);
      console.log(`Found ${listings.length} properties`);
      console.groupEnd();

      return listings;
    } catch (error) {
      console.error("❌ MCP search failed:", error);
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Get detailed listing information by MLS number
   *
   * @param mlsNumber - MLS number or property ID
   * @returns Property listing details
   */
  async getListing(mlsNumber: string): Promise<PropertyListing | null> {
    if (!this.isConnected || !this.client) {
      throw new Error("MCP client not connected. Call connect() first.");
    }

    console.group("🏠 MCP Tool Call: get-a-listing");
    console.log("MLS Number:", mlsNumber);

    try {
      const result = await this.client.callTool({
        name: "get-a-listing",
        arguments: { mlsNumber } as Record<string, unknown>,
      });

      const listings = this.parseToolResult(result);
      console.log("✅ Listing retrieved");
      console.groupEnd();

      return listings[0] || null;
    } catch (error) {
      console.error("❌ MCP get-a-listing failed:", error);
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Find similar listings to a given property
   *
   * @param mlsNumber - MLS number to find similar properties for
   * @returns Array of similar property listings
   */
  async findSimilarListings(mlsNumber: string): Promise<PropertyListing[]> {
    if (!this.isConnected || !this.client) {
      throw new Error("MCP client not connected. Call connect() first.");
    }

    console.group("🏠 MCP Tool Call: find-similar-listings");
    console.log("MLS Number:", mlsNumber);

    try {
      const result = await this.client.callTool({
        name: "find-similar-listings",
        arguments: { mlsNumber } as Record<string, unknown>,
      });

      const listings = this.parseToolResult(result);
      console.log(`✅ Found ${listings.length} similar properties`);
      console.groupEnd();

      return listings;
    } catch (error) {
      console.error("❌ MCP find-similar-listings failed:", error);
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Parse MCP tool result into PropertyListing array
   * Handles the content array format from MCP and normalizes to our UI types
   */
  private parseToolResult(result: any): PropertyListing[] {
    try {
      // MCP returns content as array of text/image objects
      // We expect text content with JSON data
      if (!result.content || !Array.isArray(result.content)) {
        console.warn("No content in tool result");
        return [];
      }

      // Find text content
      const textContent = result.content.find((item: any) => item.type === "text");
      if (!textContent || !("text" in textContent)) {
        console.warn("No text content in tool result");
        return [];
      }

      // Parse JSON from text
      const data = JSON.parse(textContent.text);

      // Handle different response formats
      let rawListings: any[] = [];

      if (Array.isArray(data)) {
        rawListings = data;
      } else if (data.listings && Array.isArray(data.listings)) {
        rawListings = data.listings;
      } else if (data.listing) {
        rawListings = [data.listing];
      } else {
        console.warn("Unexpected data format:", data);
        return [];
      }

      // Normalize each listing to PropertyListing interface
      return rawListings.map((raw) => this.normalizeListingData(raw));
    } catch (error) {
      console.error("Error parsing tool result:", error);
      return [];
    }
  }

  /**
   * Normalize raw API listing to our UI interface
   * Same logic as RepliersNLPService.normalizeListingData()
   */
  private normalizeListingData(raw: any): PropertyListing {
    // Parse sqft string to number
    let sqft: number | undefined;
    if (raw.details?.sqft) {
      const sqftStr = raw.details.sqft.replace(/[^0-9-]/g, "");
      if (sqftStr.includes("-")) {
        const [min, max] = sqftStr.split("-").map(Number);
        sqft = Math.round((min + max) / 2);
      } else {
        sqft = parseInt(sqftStr, 10);
      }
    }

    // Normalize address structure
    const address = {
      streetNumber: raw.address?.streetNumber || "",
      streetName: raw.address?.streetName || "",
      streetSuffix: raw.address?.streetSuffix,
      city: raw.address?.city || "",
      province: raw.address?.province,
      postalCode: raw.address?.postalCode,
    };

    return {
      mlsNumber: raw.mlsNumber,
      listPrice: raw.listPrice,
      bedrooms: raw.details?.numBedrooms || 0,
      bathrooms: raw.details?.numBathrooms || 0,
      sqft,
      address,
      images: raw.images,
      propertyType: raw.details?.propertyType,
      status: raw.standardStatus,
      description: raw.details?.description,
      listDate: raw.listDate,
      daysOnMarket: raw.simpleDaysOnMarket || raw.daysOnMarket,
    };
  }

  /**
   * Check if MCP client is connected and ready
   */
  isReady(): boolean {
    return this.isConnected && this.client !== null;
  }
}
