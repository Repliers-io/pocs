import type { Meta, StoryObj } from "@storybook/react";
import { UnifiedAddressSearch } from "./unified-address-search";

/**
 * ## 👤 User Story
 *
 * As a user, I want to search for and select addresses with proper validation and formatting.
 *
 * This component helps users:
 * - Search for addresses using Google Places Autocomplete
 * - Get properly formatted address components (street number, name, suffix, city, state, etc.)
 * - View a breakdown of the selected address components
 *
 * ## 🚀 Quick Start
 *
 * 1. Ensure you have a valid Google Places API key
 *
 * 2. Import and use the component:
 * ```tsx
 * import { UnifiedAddressSearch } from "./components/unified-address-search";
 *
 * function App() {
 *   const handlePlaceSelect = (place) => {
 *     console.log('Selected address:', place);
 *     // place.address contains:
 *     // - streetNumber
 *     // - streetName
 *     // - streetSuffix
 *     // - city
 *     // - state
 *     // - postalCode
 *     // - country
 *   };
 *
 *   return (
 *     <div className="container mx-auto p-4">
 *       <UnifiedAddressSearch
 *         onPlaceSelect={handlePlaceSelect}
 *         displayAddressComponents={true}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * ## 💡 Key Features
 *
 * 1. **Google Places Integration** - Uses Google Places Autocomplete API for accurate address suggestions
 * 2. **Address Component Parsing** - Automatically splits addresses into their components (street number, name, suffix, etc.)
 * 3. **Visual Feedback** - Optional display of parsed address components below the search input
 * 4. **TypeScript Support** - Fully typed component with proper interfaces for address data
 *
 * ## 🔧 Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | onPlaceSelect | (place: PlaceDetails) => void | required | Callback function when an address is selected |
 * | placeholder | string | "Enter an address..." | Placeholder text for the search input |
 * | className | string | undefined | Additional CSS classes to apply to the component |
 * | disabled | boolean | false | Whether the search input is disabled |
 * | displayAddressComponents | boolean | false | Whether to show the address components breakdown below the input |
 *
 * ## 📦 PlaceDetails Interface
 *
 * ```typescript
 * interface PlaceDetails {
 *   address: {
 *     streetNumber: string;
 *     streetName: string;
 *     streetSuffix: string;
 *     city: string;
 *     state: string;
 *     postalCode: string;
 *     country: string;
 *   };
 *   formattedAddress: string;
 *   placeId: string;
 *   geometry?: {
 *     lat: number;
 *     lng: number;
 *   };
 * }
 * ```
 */

const meta: Meta<typeof UnifiedAddressSearch> = {
  title: "Components/Useful Components/Unified Address Search",
  component: UnifiedAddressSearch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onPlaceSelect: {
      action: "selected",
      description: "Callback function when an address is selected",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the component",
    },
    disabled: {
      control: "boolean",
      description: "Whether the search input is disabled",
    },
    displayAddressComponents: {
      control: "boolean",
      description:
        "Whether to show the address components breakdown below the input",
    },
  },
};

export default meta;
type Story = StoryObj<typeof UnifiedAddressSearch>;

export const Default: Story = {
  args: {
    placeholder: "Enter an address...",
    displayAddressComponents: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};
