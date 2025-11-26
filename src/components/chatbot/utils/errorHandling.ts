import type { PropertyListing } from "../types";

/**
 * Get user-friendly error message from various error types
 * Converts technical errors into helpful messages for chat users
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === "IRRELEVANT_QUERY") {
      return "I can help you find properties! Try asking about homes, condos, or apartments for sale. For example: '3 bedroom condo in Toronto' or 'house under $800k'.";
    }
    if (error.message.includes("API error")) {
      return "Sorry, I'm having trouble connecting to the property search service. Please try again in a moment.";
    }
    if (error.message.includes("401") || error.message.includes("403")) {
      return "There's an issue with the API configuration. Please contact support.";
    }
    if (error.message.includes("timeout")) {
      return "The search is taking longer than expected. Please try again.";
    }
  }
  return "Sorry, something went wrong. Please try again or rephrase your search.";
}

/**
 * Detect if a user message is a property search query
 * Uses keyword matching to determine if we should call the NLP API
 */
export function isPropertySearchQuery(message: string): boolean {
  const keywords = [
    // Property types
    "house",
    "home",
    "condo",
    "apartment",
    "townhouse",
    "property",
    "listing",
    "real estate",

    // Search terms
    "looking for",
    "find",
    "search",
    "show me",
    "want",
    "need",
    "interested in",

    // Specifications
    "bed",
    "bedroom",
    "bath",
    "bathroom",
    "sqft",
    "square feet",
    "price",
    "budget",
    "under",
    "over",
    "between",

    // Features
    "kitchen",
    "garage",
    "parking",
    "backyard",
    "pool",
    "basement",
    "balcony",
    "fireplace",

    // Locations
    "in",
    "near",
    "around",
    "toronto",
    "downtown",
    "neighborhood",
  ];

  const lowerMessage = message.toLowerCase();
  return keywords.some((keyword) => lowerMessage.includes(keyword));
}

/**
 * Format price in Canadian dollars
 * Example: 749000 → "$749,000"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format property address as a single line
 * Example: "123 Main St, Toronto, ON"
 */
export function formatAddress(address: PropertyListing["address"]): string {
  const streetParts = [
    address.streetNumber,
    address.streetName,
    address.streetSuffix,
  ]
    .filter(Boolean)
    .join(" ");

  const cityProvince = [address.city, address.province]
    .filter(Boolean)
    .join(", ");

  return `${streetParts}, ${cityProvince}`;
}

/**
 * Get Repliers CDN image URL with size class
 * Uses 'small' class for fast loading in chat previews
 * @see https://help.repliers.com/en/article/listing-images-implementation-guide-198p8u8/
 */
export function getImageUrl(imageUrl: string | undefined): string | undefined {
  if (!imageUrl) return undefined;

  // Normalize the URL - if it's relative, prepend CDN domain
  let fullUrl = imageUrl;
  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    // Remove leading slash if present
    const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    fullUrl = `https://cdn.repliers.io/${cleanPath}`;
  }

  // If already has a size parameter, return as-is
  if (fullUrl.includes("class=")) return fullUrl;

  // Add small class for chat preview
  const separator = fullUrl.includes("?") ? "&" : "?";
  return `${fullUrl}${separator}class=small`;
}

/**
 * Format sqft with proper formatting
 * Example: 1200 → "1,200 sq ft"
 */
export function formatSqft(sqft: number | undefined): string {
  if (!sqft) return "";
  return `${sqft.toLocaleString()} sq ft`;
}

/**
 * Get property summary text for accessibility
 * Example: "3 bedroom, 2 bathroom condo at 123 Main St, Toronto"
 */
export function getPropertySummary(listing: PropertyListing): string {
  const type = listing.propertyType || "property";
  const address = formatAddress(listing.address);
  return `${listing.bedrooms} bedroom, ${listing.bathrooms} bathroom ${type} at ${address}`;
}
