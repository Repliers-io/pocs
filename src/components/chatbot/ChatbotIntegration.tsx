"use client";

import React from "react";
import { useApiKeys } from "@/lib/api-keys-context";
import { Chatbot } from "./chatbot";

export function ChatbotIntegration() {
  const { repliersApiKey } = useApiKeys();

  // Ideally we would get OpenAI key from context or env as well
  // For now, we'll use an environment variable if exposed to the client
  // or rely on the user to provide it via context if we extend it.
  const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!repliersApiKey) {
    // Optionally return null or a placeholder if key is missing
    // For this PoC, we might want to show it anyway or handle the missing key inside Chatbot
    // But Chatbot requires the key.
    // Let's return null if no key is present to avoid errors, 
    // assuming the user sets it via some other UI in the app.
    return null; 
  }

  return (
    <Chatbot
      repliersApiKey={repliersApiKey}
      openaiApiKey={openaiApiKey}
      // mcpConfig can be passed here if we have it
    />
  );
}
