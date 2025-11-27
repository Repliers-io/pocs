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
 * @description A conversational AI chatbot for real estate websites that combines:
 * - Repliers NLP API for natural language property searches
 * - OpenAI ChatGPT for intelligent conversation (optional)
 *
 * Features:
 * - Floating action button with smooth animations
 * - Modal chat interface (responsive: full-screen mobile, panel desktop)
 * - Natural language property search powered by Repliers NLP
 * - Intelligent conversation with ChatGPT (when API key provided)
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
 * // With ChatGPT
 * <Chatbot
 *   repliersApiKey="your_repliers_api_key"
 *   openaiApiKey="your_openai_api_key"
 *   brokerageName="Acme Realty"
 *   brokerageLogo="/logo.png"
 *   position="bottom-right"
 * />
 *
 * // Without ChatGPT (fallback to simple responses)
 * <Chatbot
 *   repliersApiKey="your_repliers_api_key"
 *   brokerageName="Acme Realty"
 * />
 * ```
 */
export function Chatbot({
  repliersApiKey,
  openaiApiKey,
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
      />
    </>
  );
}

export default Chatbot;
