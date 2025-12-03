/**
 * Browser-compatible mock for MCP Service
 *
 * The real MCP service uses Node.js-specific modules (child_process, stdio)
 * that cannot run in the browser. This mock allows Storybook to run without errors.
 *
 * In a real browser environment, MCP functionality won't work anyway since it requires
 * spawning Node.js processes. The chatbot will automatically fall back to the direct
 * NLP API in this case.
 */

import type { PropertyListing } from "../types";

export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
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
  class?: "condo" | "residential" | "commercial";
  status?: "Active" | "Sold" | "Leased";
  minDate?: string;
  maxDate?: string;
}

/**
 * Browser Mock for Repliers MCP Service
 * Always returns empty results and logs warnings
 */
export class RepliersMCPService {
  private nodePath: string;
  private serverPath: string;
  private apiKey: string;
  private isConnected: boolean = false;

  constructor(nodePath: string, serverPath: string, apiKey: string) {
    this.nodePath = nodePath;
    this.serverPath = serverPath;
    this.apiKey = apiKey;

    console.warn(
      "⚠️ MCP Service is running in browser mode (mock). " +
      "MCP functionality requires Node.js and will not work in the browser. " +
      "The chatbot will automatically use the direct NLP API fallback."
    );
  }

  async connect(): Promise<void> {
    console.warn("⚠️ MCP Service: Cannot connect in browser environment");
    // Don't set isConnected to true - force fallback to NLP API
    this.isConnected = false;
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  getAvailableTools(): MCPTool[] {
    return [];
  }

  async searchListings(_params: SearchParameters): Promise<PropertyListing[]> {
    console.warn("⚠️ MCP Service: searchListings not available in browser");
    return [];
  }

  async getListing(_mlsNumber: string): Promise<PropertyListing | null> {
    console.warn("⚠️ MCP Service: getListing not available in browser");
    return null;
  }

  async findSimilarListings(_mlsNumber: string): Promise<PropertyListing[]> {
    console.warn("⚠️ MCP Service: findSimilarListings not available in browser");
    return [];
  }

  isReady(): boolean {
    return false; // Always false in browser to force NLP fallback
  }
}
