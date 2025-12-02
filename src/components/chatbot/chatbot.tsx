import React, { useState } from "react";
import { ChatbotProps } from "./types";
import { FloatingButton } from "./components/FloatingButton";
import { ChatWidget } from "./components/ChatWidget";
import {
  DEFAULT_BROKERAGE_NAME,
  DEFAULT_WELCOME_MESSAGE,
  DEFAULT_PLACEHOLDER,
} from "./utils/constants";

/**
 * Real Estate Chatbot Component (Step 4: MCP Integration)
 *
 * @description A conversational AI chatbot for real estate websites that combines:
 * - OpenAI ChatGPT for natural, human-friendly conversation
 * - Repliers MCP Server for property searches (with NLP fallback)
 *
 * Architecture (Step 4):
 * 1. ChatGPT handles ALL conversation and extracts search parameters
 * 2. When ready to search, ChatGPT returns structured parameters
 * 3. MCP Service executes search using Repliers MCP Server tools
 * 4. Results are shown to user AND sent back to ChatGPT for discussion
 *
 * Features:
 * - Floating action button with smooth animations
 * - Modal chat interface (responsive: full-screen mobile, panel desktop)
 * - Natural conversation powered by ChatGPT with function calling
 * - Property search via Repliers MCP Server (or NLP fallback)
 * - Beautiful property cards with images and details
 * - Customizable branding (logo, colors, messages)
 * - Accessible and keyboard-navigable
 *
 * @param props - The component props
 * @returns JSX.Element
 *
 * @example
 * ```tsx
 * // With MCP Server (recommended)
 * <Chatbot
 *   repliersApiKey="your_repliers_api_key"
 *   openaiApiKey="your_openai_api_key"
 *   mcpConfig={{
 *     enabled: true,
 *     nodePath: "/usr/local/bin/node",
 *     serverPath: "/path/to/mcp-server/mcpServer.js"
 *   }}
 *   brokerageName="Acme Realty"
 * />
 *
 * // Without MCP (falls back to NLP API)
 * <Chatbot
 *   repliersApiKey="your_repliers_api_key"
 *   openaiApiKey="your_openai_api_key"
 *   brokerageName="Acme Realty"
 * />
 * ```
 */
export function Chatbot({
  repliersApiKey,
  openaiApiKey,
  mcpConfig,
  brokerageName = DEFAULT_BROKERAGE_NAME,
  brokerageLogo,
  primaryColor, // TODO: Apply primaryColor to theme when implementing custom theming
  position = "bottom-right",
  welcomeMessage = DEFAULT_WELCOME_MESSAGE,
  placeholder = DEFAULT_PLACEHOLDER,
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  // Suppress unused variable warnings - these will be used in future implementations
  void primaryColor;
  void mcpConfig; // Passed through to ChatWidget

  return (
    <>
      <FloatingButton isOpen={isOpen} onClick={toggleChat} position={position} />
      <ChatWidget
        isOpen={isOpen}
        onClose={closeChat}
        brokerageName={brokerageName}
        brokerageLogo={brokerageLogo}
        welcomeMessage={welcomeMessage}
        placeholder={placeholder}
        repliersApiKey={repliersApiKey}
        openaiApiKey={openaiApiKey}
        mcpConfig={mcpConfig}
      />
    </>
  );
}

export default Chatbot;
