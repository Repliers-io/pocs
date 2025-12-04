import path from "path";
import type { MCPConfig } from "../types";

/**
 * Get MCP configuration for the embedded Repliers MCP Server
 *
 * This automatically detects the node path and constructs the absolute path
 * to the embedded MCP server in the chatbot directory.
 *
 * @param repliersApiKey - Repliers API key to pass to MCP server via environment
 * @returns MCP configuration object ready to use
 */
export function getEmbeddedMCPConfig(repliersApiKey: string): MCPConfig {
  // In browser context, we can't use process.execPath
  // This config is meant for Node.js environments (like Storybook's Node.js runtime)
  const nodePath = process.execPath || "/usr/local/bin/node";

  // Get absolute path to the embedded MCP server
  // This assumes we're running from the project root
  const serverPath = path.resolve(
    __dirname,
    "../mcp-server/mcpServer.js"
  );

  return {
    mode: "stdio",
    enabled: true,
    nodePath,
    serverPath,
  };
}

/**
 * Check if we're in a Node.js environment where MCP can run
 * MCP requires Node.js and can't run in browser
 */
export function isMCPSupported(): boolean {
  return typeof process !== "undefined" && typeof process.execPath !== "undefined";
}

/**
 * Sample MCP configuration for documentation/examples
 * This shows the structure but won't work without updating paths
 */
export const SAMPLE_MCP_CONFIG: MCPConfig = {
  mode: "stdio",
  enabled: false,
  nodePath: "/usr/local/bin/node",
  serverPath: "/path/to/mcp-server/mcpServer.js",
};
