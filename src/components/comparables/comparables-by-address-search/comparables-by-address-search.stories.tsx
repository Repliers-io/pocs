import type { Meta, StoryObj } from "@storybook/react";
import { ComparablesByAddressSearch } from "./comparables-by-address-search";

/**
 * ## 👤 User Story
 *
 * As a real estate professional or home buyer, I want to search for comparable properties near a specific address so that I can understand market values and make informed decisions.
 *
 * This component helps users:
 * - **Find comparable properties** by searching near any address
 * - **Analyze market data** with detailed property information including price, size, and features
 * - **Compare properties** within a customizable radius to understand local market trends
 * - **Make informed decisions** with comprehensive property details and pricing per square foot
 *
 * ## 🚀 Quick Start
 *
 * 1. Install dependencies:
 * ```bash
 * npm install react @types/react
 * ```
 *
 * 2. Import and use the component:
 * ```tsx
 * import { ComparablesByAddressSearch } from "./components/comparables-by-address-search";
 *
 * function App() {
 *   const handleComparablesFound = (comparables) => {
 *     console.log("Found comparable properties:", comparables);
 *     // Process the comparable properties data
 *   };
 *
 *   return (
 *     <div className="container mx-auto p-4">
 *       <ComparablesByAddressSearch
 *         onComparablesFound={handleComparablesFound}
 *         maxResults={15}
 *         searchRadius={1.5}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * ## 💡 Key Features
 *
 * 1. **Google Places Integration** - Uses Google Places API for accurate address search and geocoding
 * 2. **Customizable Search Parameters** - Adjust search radius (0.1-5 miles) and maximum results (1-50)
 * 3. **Comprehensive Property Data** - Shows price, beds, baths, square footage, price per sqft, year built, and market timing
 * 4. **Visual Property Cards** - Clean, organized display of comparable properties with optional images
 * 5. **Real-time Search** - Loading states and error handling for smooth user experience
 * 6. **Mobile Responsive** - Optimized layout that works on all device sizes
 *
 * ## 🏠 Property Data Fields
 *
 * Each comparable property includes:
 * - **Address & Location** - Full address and distance from search location
 * - **Pricing** - Sale price and price per square foot
 * - **Property Details** - Beds, baths, square footage, year built
 * - **Market Data** - Days on market, last sold date, property type
 * - **Visual** - Optional property image
 *
 * ## 🔧 Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | className | string | undefined | Additional CSS classes for styling |
 * | onComparablesFound | function | undefined | Callback when comparable properties are found |
 * | maxResults | number | 10 | Maximum number of comparable properties to return (1-50) |
 * | searchRadius | number | 1.0 | Search radius in miles (0.1-5.0) |
 *
 * ## 🎯 Usage Examples
 *
 * ### Basic Usage
 * ```tsx
 * <ComparablesByAddressSearch />
 * ```
 *
 * ### With Custom Parameters
 * ```tsx
 * <ComparablesByAddressSearch
 *   maxResults={20}
 *   searchRadius={2.0}
 *   className="max-w-4xl mx-auto"
 * />
 * ```
 *
 * ### With Data Handler
 * ```tsx
 * <ComparablesByAddressSearch
 *   onComparablesFound={(comparables) => {
 *     // Save to state, send to analytics, etc.
 *     setMarketData(comparables);
 *   }}
 * />
 */

const meta: Meta<typeof ComparablesByAddressSearch> = {
  title: "POCS/Comparables/ComparablesByAddressSearch",
  component: ComparablesByAddressSearch,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A comprehensive component for searching comparable properties by address using Google Places API integration.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the component",
    },
    onComparablesFound: {
      action: "comparables-found",
      description:
        "Callback function called when comparable properties are found",
    },

    searchRadius: {
      control: { type: "number", min: 0.1, max: 5.0, step: 0.1 },
      description: "Search radius in miles",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComparablesByAddressSearch>;

export const Default: Story = {
  args: {
    searchRadius: 2.0,
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl mx-auto p-6">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "The default configuration with standard search parameters. Users can search for an address and find comparable properties within 2 km.",
      },
    },
  },
};
