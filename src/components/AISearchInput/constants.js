/**
 * Constants and configuration for AISearchInput component
 */

// Inspiration suggestions for the "Be inspired..." section
export const INSPIRATION_CHIPS = [
  'blue kitchen',
  'pink everything',
  'sunken living room',
  'gothic mansion',
  'midcentury design',
  'huge mansions',
  'mountain views',
  'wine cellar'
];

// Example searches for the "Or try searching for..." section
export const SEARCH_EXAMPLES = [
  'Victorian townhouse with a freestanding bath and fireplace',
  '4 bed house with a treehouse, 1 hour commute from London',
  'Hackney warehouse conversion with exposed brick & high ceilings'
];

/**
 * Entity configuration mapping entity types to their display properties
 * Each entity has:
 * - icon: Emoji representing the entity type
 * - getLabel: Function to format the entity value for display
 * - priority: Display order (lower numbers appear first)
 */
export const ENTITY_CONFIG = {
  location: {
    icon: '📍',
    getLabel: (value) => value,
    priority: 1
  },
  bedrooms: {
    icon: '🛏️',
    getLabel: (value) => `${value}+ Beds`,
    priority: 2
  },
  bathrooms: {
    icon: '🚿',
    getLabel: (value) => `${value}+ Baths`,
    priority: 3
  },
  property_type: {
    icon: '🏠',
    getLabel: (value) => value,
    priority: 4
  },
  price_min: {
    icon: '💰',
    getLabel: (value) => `Min $${value}k`,
    priority: 5
  },
  price_max: {
    icon: '💰',
    getLabel: (value) => `Max $${value}k`,
    priority: 6
  },
  sqft_min: {
    icon: '📐',
    getLabel: (value) => `${value}+ sqft`,
    priority: 7
  },
  amenities: {
    icon: '✨',
    getLabel: (value) => Array.isArray(value) ? value.join(', ') : value,
    priority: 8
  },
  proximity: {
    icon: '🚇',
    getLabel: (value) => Array.isArray(value) ? value.join(', ') : value,
    priority: 9
  },
  style_preferences: {
    icon: '🎨',
    getLabel: (value) => Array.isArray(value) ? value.join(', ') : value,
    priority: 10
  },
  commute_time: {
    icon: '⏱️',
    getLabel: (value) => value,
    priority: 11
  }
};

/**
 * OpenAI function calling definition for extracting search entities
 * Used to parse natural language queries into structured search parameters
 */
export const EXTRACT_ENTITIES_FUNCTION = {
  name: "extract_search_entities",
  description: "Extract real estate search entities from natural language query for display as filter chips. Parse the user's search text and identify key property search criteria.",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The geographic location mentioned (city, neighborhood, area, or region). Examples: 'Toronto', 'Downtown Manhattan', 'North London'"
      },
      bedrooms: {
        type: "number",
        description: "Minimum number of bedrooms requested. Extract from phrases like '3 bed', '4 bedroom', 'at least 2 bedrooms'"
      },
      bathrooms: {
        type: "number",
        description: "Minimum number of bathrooms requested. Extract from phrases like '2 bath', '3 bathroom', 'at least 1.5 baths'"
      },
      property_type: {
        type: "string",
        description: "Type of property mentioned. Must be one of the allowed values.",
        enum: ["House", "Condo", "Townhouse", "Apartment", "Detached", "Semi-Detached"]
      },
      price_min: {
        type: "number",
        description: "Minimum price in thousands (k). Extract from phrases like 'at least $500k', 'starting at $400,000', 'minimum $600k'"
      },
      price_max: {
        type: "number",
        description: "Maximum price in thousands (k). Extract from phrases like 'under $800k', 'max $1M', 'budget up to $750,000'"
      },
      sqft_min: {
        type: "number",
        description: "Minimum square footage. Extract from phrases like 'at least 2000 sqft', '1500+ square feet', 'minimum 1800 sq ft'"
      },
      amenities: {
        type: "array",
        items: {
          type: "string"
        },
        description: "List of desired amenities, features, or facilities. Examples: ['pool', 'gym', 'parking', 'balcony', 'fireplace', 'hardwood floors', 'granite countertops', 'stainless steel appliances']"
      },
      proximity: {
        type: "array",
        items: {
          type: "string"
        },
        description: "List of nearby locations, landmarks, or transit mentioned. Examples: ['subway', 'downtown', 'schools', 'parks', 'shopping', 'TTC', 'waterfront']"
      },
      style_preferences: {
        type: "array",
        items: {
          type: "string"
        },
        description: "List of architectural styles, design aesthetics, or vibes mentioned. Examples: ['modern', 'Victorian', 'midcentury', 'industrial', 'minimalist', 'rustic', 'exposed brick', 'high ceilings']"
      },
      commute_time: {
        type: "string",
        description: "Commute time or distance mentioned. Extract from phrases like '30 min to downtown', '1 hour from London', 'walking distance to office'"
      }
    },
    required: []
  }
};
