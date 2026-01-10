import { useState } from 'react';
import AISearchInput from "./AISearchInput";
import ResultsPanel from "./ResultsPanel";

export default {
  title: "pocs/AISearchInput/AISearchInput",
  component: AISearchInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An expanded AI search interface with multiline input, floating search button, and inspiration chips.",
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Describe your dream home..." },
      },
    },
    initialValue: {
      control: "text",
      description: "Initial value for the input",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "" },
      },
    },
    width: {
      control: "text",
      description: "Width of the component",
      table: {
        type: { summary: "string | number" },
        defaultValue: { summary: "800px" },
      },
    },
    openaiApiKey: {
      control: "text",
      description: "OpenAI API key for entity extraction",
      table: {
        type: { summary: "string" },
      },
    },
    repliersApiKey: {
      control: "text",
      description: "Repliers API key for property search",
      table: {
        type: { summary: "string" },
      },
    },
    onQueryChange: {
      action: "query changed",
      description: "Callback fired when query changes (debounced by 500ms)",
      table: {
        type: { summary: "function" },
      },
    },
    onSearch: {
      action: "search triggered",
      description: "Callback fired when search button is clicked (deprecated)",
      table: {
        type: { summary: "function" },
      },
    },
    onSearchComplete: {
      action: "search complete",
      description: "Callback with full search results: { query, entities, results, summary, conversationId }",
      table: {
        type: { summary: "function" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100%",
          minHeight: "600px",
          padding: "80px 40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

// Mock search results for testing
const mockSearchResults = {
  query: "3 bedroom condo in Toronto under $800k",
  entities: {
    location: "Toronto",
    bedrooms: 3,
    property_type: "Condo",
    price_max: 800000
  },
  results: [
    {
      mlsNumber: "C5234567",
      listPrice: 749000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1200,
      address: {
        streetNumber: "123",
        streetName: "King",
        streetSuffix: "St",
        city: "Toronto",
        province: "ON"
      },
      images: ["https://via.placeholder.com/400x300"],
      propertyType: "Condo",
      status: "Active",
      daysOnMarket: 5
    },
    {
      mlsNumber: "C5234568",
      listPrice: 695000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1100,
      address: {
        streetNumber: "456",
        streetName: "Queen",
        streetSuffix: "St W",
        city: "Toronto",
        province: "ON"
      },
      images: [],
      propertyType: "Condo",
      status: "Active",
      daysOnMarket: 12
    },
    {
      mlsNumber: "C5234569",
      listPrice: 795000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1350,
      address: {
        streetNumber: "789",
        streetName: "Bay",
        streetSuffix: "St",
        city: "Toronto",
        province: "ON"
      },
      images: ["https://via.placeholder.com/400x300"],
      propertyType: "Condo",
      status: "Active",
      daysOnMarket: 3
    },
    {
      mlsNumber: "C5234570",
      listPrice: 775000,
      bedrooms: 3,
      bathrooms: 2.5,
      sqft: 1280,
      address: {
        streetNumber: "321",
        streetName: "Yonge",
        streetSuffix: "St",
        city: "Toronto",
        province: "ON"
      },
      images: ["https://via.placeholder.com/400x300"],
      propertyType: "Condo",
      status: "Pending",
      daysOnMarket: 8
    },
    {
      mlsNumber: "C5234571",
      listPrice: 729000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1150,
      address: {
        streetNumber: "555",
        streetName: "Bloor",
        streetSuffix: "St W",
        city: "Toronto",
        province: "ON"
      },
      images: ["https://via.placeholder.com/400x300"],
      propertyType: "Condo",
      status: "Active",
      daysOnMarket: 2
    },
    {
      mlsNumber: "C5234572",
      listPrice: 799000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1400,
      address: {
        streetNumber: "888",
        streetName: "Spadina",
        streetSuffix: "Ave",
        city: "Toronto",
        province: "ON"
      },
      images: [],
      propertyType: "Condo",
      status: "Active",
      daysOnMarket: 15
    }
  ],
  summary: "Searching for 3 bedroom condos in Toronto under $800,000",
  conversationId: "abc123"
};

const mockEmptyResults = {
  query: "10 bedroom castle in Toronto",
  entities: {
    location: "Toronto",
    bedrooms: 10,
    property_type: "Castle"
  },
  results: [],
  summary: "Searching for 10 bedroom castles in Toronto",
  conversationId: "xyz789"
};

// Default - Shows inspiration suggestions when focused
export const Default = {
  args: {
    placeholder: "Describe your dream home...",
    initialValue: "",
    width: "800px",
  },
};

// WithResultsPanel - Execute a search to see results in bottom sheet
export const WithResultsPanel = {
  args: {
    ...Default.args,
    initialValue: "3 bedroom condo in Toronto under $800k"
  },
  parameters: {
    docs: {
      description: {
        story: 'Execute a search to see results displayed in a slide-up bottom sheet panel. The panel slides up smoothly and displays property cards in a responsive grid. Click the overlay or X button to close.'
      }
    }
  }
};

// EmptyResults - Shows empty state
export const EmptyResults = {
  args: {
    ...Default.args,
    initialValue: "10 bedroom castle in Toronto"
  },
  parameters: {
    docs: {
      description: {
        story: 'Execute a search with no results to see the empty state in the bottom sheet panel.'
      }
    }
  }
};

// PanelOnly - Test panel component directly
const PanelOnlyComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
      >
        Open Results Panel
      </button>
      <ResultsPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        results={mockSearchResults}
        onPropertyClick={(p) => console.log('Clicked:', p)}
        onRefineSearch={() => {
          setIsOpen(false);
          console.log('Refine search');
        }}
      />
    </div>
  );
};

export const PanelOnly = {
  render: () => <PanelOnlyComponent />,
  parameters: {
    docs: {
      description: {
        story: 'Direct test of the ResultsPanel component. Click the button to open the panel, test all interactions including closing, property clicks, and refine search.'
      }
    }
  }
};

// PanelWithEmptyState - Test empty state panel
const PanelEmptyStateComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
      >
        Open Empty Results Panel
      </button>
      <ResultsPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        results={mockEmptyResults}
        onPropertyClick={(p) => console.log('Clicked:', p)}
        onRefineSearch={() => {
          setIsOpen(false);
          console.log('Refine search');
        }}
      />
    </div>
  );
};

export const PanelWithEmptyState = {
  render: () => <PanelEmptyStateComponent />,
  parameters: {
    docs: {
      description: {
        story: 'Test the empty state of the ResultsPanel when no properties are found.'
      }
    }
  }
};
