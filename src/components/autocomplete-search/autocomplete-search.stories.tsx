import type { Meta, StoryObj } from "@storybook/react";
import { AutocompleteSearch } from "./autocomplete-search";

const meta: Meta<typeof AutocompleteSearch> = {
  title: "Components/Useful Components/AutocompleteSearch",
  component: AutocompleteSearch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Autocomplete Search Using Repliers API

A production-ready React component that implements the [Repliers API autocomplete search pattern](https://help.repliers.com/en/article/building-an-autocomplete-search-feature-with-repliers-apis-1eaoxyl/).

## API Implementation

This component follows the official Repliers guide and implements concurrent API calls to:

### 1. Listings Endpoint
\`\`\`
GET /listings?q={query}&limit={maxResults}&fields=mls_id,list_price,address,property_details,listing_status,photos
\`\`\`

### 2. Locations Autocomplete Endpoint  
\`\`\`
GET /locations/autocomplete?q={query}&limit={maxResults}
\`\`\`

Both requests are executed simultaneously using \`Promise.all()\` for optimal performance, with a 400ms debounce to prevent excessive API calls.

## Quick Start

\`\`\`tsx
import { AutocompleteSearch } from "./components/autocomplete-search";

function App() {
  return (
    <AutocompleteSearch 
      apiKey="your-repliers-api-key"
      onListingSelect={(listing) => console.log('Selected:', listing)}
      onLocationSelect={(location) => console.log('Selected:', location)}
    />
  );
}
\`\`\`

## Key Features

- Debounced search with concurrent API calls
- Categorized results (Properties, Cities, Neighborhoods, Areas)
- Error handling and loading states
- Mobile responsive design
- TypeScript support with full type definitions
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    apiKey: {
      control: "text",
      description: "Your Repliers API key (required)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "required" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input",
      table: {
        type: { summary: "string" },
        defaultValue: {
          summary: "Search for properties, cities, or neighborhoods...",
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AutocompleteSearch>;

export const Default: Story = {
  args: {
    apiKey: "your-repliers-api-key-here",
    placeholder: "Search for properties, cities, or neighborhoods...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default autocomplete search component. **Note:** You need a valid Repliers API key for this to work with real data.",
      },
    },
  },
};
