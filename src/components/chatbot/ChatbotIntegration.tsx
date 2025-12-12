"use client";

import React from "react";
import { useApiKeys } from "@/lib/api-keys-context";
import { Chatbot } from "./chatbot";

export function ChatbotIntegration() {
  const { repliersApiKey } = useApiKeys();

  if (!repliersApiKey) {
    return null;
  }

  return (
    <Chatbot
      repliersApiKey={repliersApiKey}
      openaiApiKey={undefined}
    />
  );
}
