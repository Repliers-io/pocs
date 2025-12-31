"use client";

import React from "react";
import { ChatbotProps } from "./types";
import { FloatingChatButton } from "./components/FloatingChatButton";
import { ChatPanel } from "./components/ChatPanel";
import { PropertyPanel } from "./components/PropertyPanel";
import { usePanelState } from "./hooks/usePanelState";
import { useChatRuntime } from "./hooks/useChatRuntime";
import {
  DEFAULT_BROKERAGE_NAME,
  DEFAULT_WELCOME_MESSAGE,
  DEFAULT_PLACEHOLDER,
} from "./utils/constants";

/**
 * Real Estate Chatbot Component - Dual Panel UI
 *
 * A conversational AI chatbot with modern Claude/ChatGPT-style interface.
 *
 * Architecture:
 * - FloatingChatButton: Circular button in bottom right
 * - ChatPanel: Slides in from right (configurable width, default 500px)
 * - PropertyPanel: Slides in from left (fills remaining space)
 * - Dual-panel system for chat + property details/listings
 *
 * Features:
 * - Claude-style chat UI with smooth animations
 * - Property details panel for selected properties
 * - All listings grid view
 * - Responsive: full screen mobile, side-by-side desktop
 * - Independent panel close/open states
 * - Configurable chat panel width
 *
 * @param props - The component props
 * @returns JSX.Element
 *
 * @example
 * ```tsx
 * <Chatbot
 *   repliersApiKey="your_repliers_api_key"
 *   openaiApiKey="your_openai_api_key"
 *   brokerageName="Acme Realty"
 *   width="600px"
 * />
 * ```
 */
export function Chatbot({
  repliersApiKey,
  openaiApiKey,
  brokerageName = DEFAULT_BROKERAGE_NAME,
  brokerageLogo,
  primaryColor,
  position = "bottom-right",
  welcomeMessage = DEFAULT_WELCOME_MESSAGE,
  placeholder = DEFAULT_PLACEHOLDER,
  width = "500px",
}: ChatbotProps) {
  // Panel state management
  const [panelState, panelActions] = usePanelState();

  // Chat runtime (messages, loading, send message)
  const { messages, isLoading, sendMessage } = useChatRuntime(
    repliersApiKey,
    openaiApiKey,
    brokerageName,
    welcomeMessage
  );

  // Suppress unused variable warnings
  void primaryColor;
  void brokerageLogo;

  return (
    <>
      {/* Floating Chat Button */}
      <FloatingChatButton
        isOpen={panelState.chatOpen}
        onClick={panelActions.toggleChat}
        position={position}
      />

      {/* Chat Panel - Right side */}
      <ChatPanel
        isOpen={panelState.chatOpen}
        onClose={panelActions.closeChat}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
        placeholder={placeholder}
        onPropertyClick={panelActions.openPropertyDetail}
        onShowAllListings={panelActions.openPropertyGrid}
        width={width}
      />

      {/* Property Panel - Left side */}
      <PropertyPanel
        isOpen={panelState.propertyPanelOpen}
        onClose={panelActions.closePropertyPanel}
        mode={panelState.propertyPanelMode}
        selectedProperty={panelState.selectedProperty}
        allListings={panelState.allListings}
        onPropertyClick={panelActions.openPropertyDetail}
        chatPanelWidth={width}
      />
    </>
  );
}

export default Chatbot;
