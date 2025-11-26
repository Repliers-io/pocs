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
 * @description A conversational AI chatbot for real estate websites that uses Repliers NLP API
 * to understand natural language property searches and display results.
 *
 * Features:
 * - Floating action button with smooth animations
 * - Modal chat interface (responsive: full-screen mobile, panel desktop)
 * - Natural language property search powered by Repliers NLP
 * - Context-aware multi-turn conversations using nlpId
 * - Beautiful property cards with images and details
 * - Visual search support (e.g., "modern white kitchen")
 * - Customizable branding (logo, colors, messages)
 * - Accessible and keyboard-navigable
 *
 * @param props - The component props
 * @returns JSX.Element
 *
 * @example
 * ```tsx
 * <Chatbot
 *   repliersApiKey="your_repliers_api_key"
 *   brokerageName="Acme Realty"
 *   brokerageLogo="/logo.png"
 *   position="bottom-right"
 * />
 * ```
 */
export function Chatbot({
  repliersApiKey,
  openaiApiKey, // TODO: Will be used in Step 3 for ChatGPT integration
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
  void openaiApiKey;

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
      />
    </>
  );
}

export default Chatbot;
