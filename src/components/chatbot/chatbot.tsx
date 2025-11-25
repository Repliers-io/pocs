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
 * Real Estate Chatbot Component
 *
 * @description A fully-featured chatbot widget for real estate websites with floating button and chat interface.
 * Built with assistant-ui and designed for integration with Repliers MCP Server.
 *
 * Features:
 * - Floating action button with smooth animations
 * - Modal chat interface (responsive: full-screen mobile, panel desktop)
 * - Warm, friendly design aesthetic
 * - Customizable branding (logo, colors, messages)
 * - Mock runtime (will be replaced with MCP integration)
 * - Accessible and keyboard-navigable
 *
 * @param props - The component props
 * @returns JSX.Element
 *
 * @example
 * ```tsx
 * <Chatbot
 *   brokerageName="Acme Realty"
 *   brokerageLogo="/logo.png"
 *   position="bottom-right"
 * />
 * ```
 */
export function Chatbot({
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

  // Suppress unused variable warning - primaryColor will be used in future theming implementation
  void primaryColor;

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
      />
    </>
  );
}

export default Chatbot;
