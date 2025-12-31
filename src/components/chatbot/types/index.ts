// ============================================================================
// Chatbot Component Props
// ============================================================================

export interface ChatbotProps {
  /** Repliers API key (required for property search) */
  repliersApiKey: string;
  /** OpenAI API key (optional - for enhanced conversation) */
  openaiApiKey?: string;
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
  /** Width of the chat panel (e.g., "500px", "50%") - defaults to "500px" */
  width?: string;
}


// ============================================================================
// Repliers NLP API Types
// ============================================================================

/**
 * Image search item for aesthetic/visual property searches
 * Example: "modern white kitchen" or "hardwood floors"
 */
export interface ImageSearchItem {
  type: string;
  value: string;
  boost: number;
}

/**
 * Response from Repliers NLP endpoint
 * Contains the search URL, optional body params, and human-readable summary
 */
export interface NLPResponse {
  request: {
    url: string;
    body?: {
      imageSearchItems?: ImageSearchItem[];
      keywords?: string[];
    };
  };
  nlpId: string;
  summary: string;
}

// ============================================================================
// Property Listing Types
// ============================================================================

/**
 * Property address structure from Repliers API
 */
export interface PropertyAddress {
  streetNumber: string;
  streetName: string;
  streetSuffix?: string;
  city: string;
  province?: string;
  postalCode?: string;
}

/**
 * Raw property listing from Repliers API
 * This is the actual structure returned by the API
 */
export interface RawPropertyListing {
  mlsNumber: string;
  listPrice: number;
  address: {
    streetNumber: string;
    streetName: string;
    streetSuffix?: string;
    city: string;
    province?: string;
    postalCode?: string;
    area?: string;
    district?: string;
  };
  details: {
    numBedrooms: number;
    numBathrooms: number;
    numBedroomsPlus?: number;
    numBathroomsPlus?: number;
    propertyType: string;
    sqft?: string; // Note: API returns string like "5000 +" or "1200-1400"
    description?: string;
  };
  images?: string[];
  status: string; // Single letter: "A" = Active
  standardStatus: string; // Full text: "Active"
  listDate?: string;
  daysOnMarket?: number;
  simpleDaysOnMarket?: number;
}

/**
 * Normalized property listing for UI components
 * This is what our components expect to work with
 */
export interface PropertyListing {
  mlsNumber: string;
  listPrice: number;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  address: PropertyAddress;
  images?: string[];
  propertyType?: string;
  status?: string;
  description?: string;
  listDate?: string;
  daysOnMarket?: number;
}

/**
 * Response from Repliers Listings API
 */
export interface ListingsResponse {
  listings: RawPropertyListing[];
  total?: number;
  page?: number;
  pageSize?: number;
}

// ============================================================================
// Chat Message Types
// ============================================================================

/**
 * Chat message with optional property results
 * Used in the chat runtime to display messages and property cards
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  propertyResults?: PropertyListing[];
  timestamp: Date;
  isLoading?: boolean;
  error?: boolean;
}

// Legacy Message type for backwards compatibility
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

// ============================================================================
// Component Props for Sub-components
// ============================================================================

export interface PropertyCardProps {
  listing: PropertyListing;
  onViewDetails?: (listing: PropertyListing) => void;
}

export interface PropertyResultsProps {
  listings: PropertyListing[];
  onViewDetails?: (listing: PropertyListing) => void;
}
