export interface ChatbotProps {
  /** Name of the brokerage to display in header */
  brokerageName?: string;
  /** URL to brokerage logo image */
  brokerageLogo?: string;
  /** Primary brand color (hex or Tailwind color) */
  primaryColor?: string;
  /** Position of the floating button */
  position?: "bottom-right" | "bottom-left";
  /** Custom welcome message from the assistant */
  welcomeMessage?: string;
  /** Placeholder text for input field */
  placeholder?: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

// Placeholder for future MCP integration
export interface PropertyListing {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  imageUrl?: string;
  description?: string;
  // TODO: Add more fields as needed for MCP integration
}

// Placeholder for future MCP tool calls
export interface MCPToolCall {
  toolName: string;
  parameters: Record<string, unknown>;
  result?: unknown;
  // TODO: Expand this when implementing MCP integration
}

export interface FloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
  position?: "bottom-right" | "bottom-left";
}

export interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  brokerageName: string;
  brokerageLogo?: string;
  welcomeMessage: string;
  placeholder: string;
}
