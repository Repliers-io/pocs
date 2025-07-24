import type { Meta, StoryObj } from "@storybook/react";
import { AutocompleteSearch } from "./autocomplete-search";

const meta: Meta<typeof AutocompleteSearch> = {
  title:
    "Tutorials/Configuring the Autocomplete Search Component with Repliers API",
  component: AutocompleteSearch,
  parameters: {
    layout: "centered",
    docs: {
      title: "Tutorial",
      description: {
        component: `

[**View the full code repository on GitHub**](https://github.com/repliersio/pocs)

This tutorial focuses on understanding the API calls, requests, and responses involved in building a real estate autocomplete search. The UI component is already fully designed and coded out for you—feel free to use or adapt it in your own projects!

---

Autocomplete search is essential for real estate applications because it:

- **Searches the database of listings** - Users can find specific properties by address, MLS number, or partial matches
- **Helps with regional searches** - When users want to browse listings in a certain area but don't know exact addresses, location autocomplete provides cities, neighborhoods, and areas
- **Improves user experience** - Reduces typing, prevents errors, and provides instant feedback
- **Increases conversion rates** - Makes property discovery faster and more intuitive

## Tech Stack Overview

This tutorial uses:
- **React 18** with TypeScript for type safety
- **Next.js 14** for the development environment
- **Tailwind CSS** for styling
- **Repliers API** for real estate data
- **Lucide React** for icons

## API Implementation

The component makes concurrent API calls to two Repliers endpoints:

### 1. Listings Endpoint
\`\`\`http
GET https://dev.repliers.io/listings?search={query}&searchFields=address.streetNumber,address.streetName,mlsNumber,address.city&fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images&fuzzysearch=true&status=A&status=U
\`\`\`

**What we're requesting:**
- Search across street numbers, street names, MLS numbers, and cities
- Return only active (A) and under contract (U) listings
- Include property details, **garage info (number of garage spaces)**, images, and status information
- Use fuzzy search for better matching

### 2. Locations Autocomplete Endpoint
\`\`\`http
GET https://dev.repliers.io/locations/autocomplete?search={query}&addContext=city
\`\`\`

**What we're requesting:**
- Search for cities, neighborhoods, and areas
- Include city context for neighborhoods to show "Neighborhood in City, State" format
- Return geographic coordinates for mapping

Both requests execute simultaneously using \`Promise.all()\` with a 400ms debounce to prevent excessive API calls.

## Tutorial Steps

### Step 1: Clone and Setup the Repository

First, you'll need to clone this repository to your local machine:

1. **Fork the repository** on GitHub by clicking the "Fork" button in the top right
2. **Clone your fork** locally:
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/pocs.git
   cd pocs
   \`\`\`
3. **Set up the remote** to track the original repository:
   \`\`\`bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/pocs.git
   \`\`\`
4. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

📚 **Resources:**
- [GitHub's Forking Guide](https://docs.github.com/en/get-started/quickstart/fork-a-repo)
- [Git Clone Documentation](https://git-scm.com/docs/git-clone)

### Step 2: Local Development Setup

1. **Create environment file**:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. **Add your Repliers API key** to \`.env.local\`:
   \`\`\`env
   NEXT_PUBLIC_REPLIERS_API_KEY=your_api_key_here
   \`\`\`

3. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Start Storybook** (in a new terminal):
   \`\`\`bash
   npm run storybook
   \`\`\`

**Important:** The component automatically looks for the API key in \`NEXT_PUBLIC_REPLIERS_API_KEY\` environment variable during development. This is a convenience feature for local development only - in production, you should always pass the API key as a prop.

### Step 3: Understanding the API Calls

Let's examine the actual API requests and responses:

#### Listings API Request
\`\`\`typescript
const listingsResponse = await fetch(
  \`https://dev.repliers.io/listings?search=\${encodeURIComponent(query)}&searchFields=address.streetNumber,address.streetName,mlsNumber,address.city&fields=address.*,mlsNumber,listPrice,details.numBedrooms,details.numBedroomsPlus,details.numBathrooms,details.numBathroomsPlus,details.numGarageSpaces,details.propertyType,type,lastStatus,images&fuzzysearch=true&status=A&status=U\`,
  {
    headers: {
      "REPLIERS-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  }
);
\`\`\`

**Parameters explained:**
- \`search\`: The user's input query
- \`searchFields\`: Which fields to search within (street numbers, names, MLS numbers, cities)
- \`fields\`: Which fields to return (optimized for performance, including \`details.numGarageSpaces\` for garage info)
- \`fuzzysearch=true\`: Enables fuzzy matching for better results
- \`status=A&status=U\`: Only active and under contract listings

#### Locations API Request
\`\`\`typescript
const locationsResponse = await fetch(
  \`https://dev.repliers.io/locations/autocomplete?search=\${encodeURIComponent(query)}&addContext=city\`,
  {
    headers: {
      "REPLIERS-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  }
);
\`\`\`

**Parameters explained:**
- \`search\`: The user's input query
- \`addContext=city\`: Include city information for neighborhoods

#### Example Responses

**Listings Response:**
\`\`\`json
{
  "listings": [
    {
      "mlsNumber": "X12151945",
      "listPrice": 1250000,
      "address": {
        "streetNumber": "13",
        "streetName": "Fire Route 123",
        "city": "Trent Lakes",
        "state": "Ontario"
      },
      "details": {
        "numBedrooms": 3,
        "numBathrooms": 2,
        "numGarageSpaces": 2,
        "propertyType": "Single Family"
      },
      "type": "Sale",
      "lastStatus": "New"
    }
  ]
}
\`\`\`

**Locations Response:**
\`\`\`json
{
  "locations": [
    {
      "name": "Toronto",
      "type": "city",
      "address": {
        "state": "ON",
        "city": "Toronto"
      }
    },
    {
      "name": "Toronto Gore Rural Estate",
      "type": "neighborhood",
      "address": {
        "state": "ON",
        "city": "Brampton"
      }
    }
  ]
}
\`\`\`

## Key Implementation Details

- **Debouncing**: 400ms delay prevents excessive API calls
- **Minimum query length**: 3 characters required for both endpoints
- **Error handling**: Comprehensive error states for API failures
- **Loading states**: Skeleton loaders during API calls
- **Categorized results**: Properties, Cities, Neighborhoods, Areas
- **Mobile responsive**: Works on all device sizes

## Next Steps

This tutorial provides a foundation for building real estate search features. You can extend this by:

- Adding click handlers for result selection
- Implementing search history
- Adding filters for price range, property type, etc.
- Integrating with mapping services
- Building saved searches functionality

For more information, see the [official Repliers API documentation](https://help.repliers.com/en/article/building-an-autocomplete-search-feature-with-repliers-apis-1eaoxyl/).
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

export const WorkingExample: Story = {
  args: {
    placeholder: "Search for properties, cities, or neighborhoods...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "This is the working autocomplete search component you'll build in this tutorial. **Note:** You need a valid Repliers API key in your `.env.local` file for this to work with real data.",
      },
    },
  },
};
