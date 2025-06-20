import type { Meta, StoryObj } from "@storybook/react";
import { PropertyValueEstimator } from "./property-value-estimator";

/**
 *
 * ## 👤 User Story
 *
 * As a real estate professional, I want to collect detailed property information and get instant property value estimates with smart address autocomplete.
 *
 * This component helps real estate professionals:
 * - Search for addresses using Google Places Autocomplete
 * - Collect comprehensive property details
 * - Get instant property value estimates
 * - Make data-driven decisions about property values
 * - Provide accurate property assessments to clients
 *
 * This component provides real-time property value estimates using Repliers API data and features an integrated unified address search for accurate address input.
 *
 * ## 🎥 Video Demo
 *
 * Watch a demo of this component in action: [View Demo Video](https://www.loom.com/share/503d120372d2445786922c0a4f89cc3f?sid=e0ca72d9-0b25-46e9-9366-ac1ae3e87919)
 *
 * ## 🚀 Quick Start
 *
 * 1. Install dependencies:
 * ```bash
 * npm install @hookform/resolvers zod react-hook-form @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot
 * ```
 *
 * 2. Set up UI Components:
 *    - If you have your own component library, you can use your existing components
 *    - If not, copy our UI components:
 *      - Basic UI components (buttons, inputs, etc.): [View UI Components](https://github.com/Repliers-io/pocs/tree/main/src/components/ui)
 *      - Unified Address Search component: [View Component](https://github.com/Repliers-io/pocs/tree/main/src/components/unified-address-search)
 *
 * 3. Copy the component files:
 *    - `property-value-estimator.tsx`
 *    - `unified-address-search.tsx` (for address autocomplete)
 *    - Required UI components (either from your library or ours)
 *
 * 4. Add to your project:
 *
 * ```tsx
 * import { PropertyValueEstimator } from "./components/property-value-estimator";
 *
 * function App() {
 *   return (
 *     <div className="container mx-auto p-4">
 *       <PropertyValueEstimator />
 *     </div>
 *   );
 * }
 * ```
 *
 * ## 🔑 Required API Keys
 *
 * ### Repliers API Key
 * - Sign up at [Repliers Developer Portal](https://dev.repliers.io)
 * - Get your API key from the dashboard
 * - Set up your environment variable:
 * ```env
 * NEXT_PUBLIC_REPLIERS_API_KEY=your_api_key_here
 * ```
 *
 * ### Google Places API Key (for Address Search)
 * - Create a Google Cloud Project
 * - Enable the Places API
 * - Generate an API key with Places API access
 * - **Important**: Restrict your API key to your domain for security
 * - The component includes a hardcoded key for demo purposes (restricted to specific domains)
 *
 * ## 📦 Component Structure
 *
 * The component consists of four main parts:
 *
 * 1. **Unified Address Search** - Google Places autocomplete with proper address parsing
 * 2. **Property Information Form** - Collects detailed property data
 * 3. **API Integration** - Handles communication with Repliers API
 * 4. **Results Display** - Shows the estimate results
 *
 * ## 💡 Key Features
 *
 * ### 🎯 Smart Address Input
 * 1. **Google Places Autocomplete** - Real-time address suggestions as you type
 * 2. **Automatic Address Parsing** - Intelligently splits addresses into components:
 *    - Street number
 *    - Street name
 *    - Street suffix (St, Ave, Dr, etc.)
 *    - City
 *    - State
 *    - ZIP/Postal code
 * 3. **Visual Component Display** - Shows parsed address components for verification
 * 4. **Form Integration** - Automatically populates form fields with parsed address data
 *
 * ### 📋 Comprehensive Property Details
 * 1. **Property Specifications**
 *    - Property type, style, and year built
 *    - Square footage and room counts
 *    - Basement and construction details
 * 2. **Lot Information**
 *    - Lot dimensions (width and depth)
 *    - Property features (pool, garage, etc.)
 * 3. **Tax Information**
 *    - Annual tax amounts
 *
 * ### ⚡ Real-time Estimates
 * 1. **Instant property value estimates**
 * 2. **High and low value ranges**
 * 3. **Confidence scores with quality indicators**
 * 4. **Error range percentages**
 *
 * ### 🎨 Interactive UI
 * 1. **Form validation with real-time feedback**
 * 2. **Loading states and progress indicators**
 * 3. **Comprehensive error handling**
 * 4. **Responsive design**
 *
 * ## 🏠 Address Search Integration
 *
 * The PropertyValueEstimator uses the UnifiedAddressSearch component to provide intelligent address input:
 *
 * ```tsx
 * <UnifiedAddressSearch
 *   onPlaceSelect={handlePlaceSelect}
 *   displayAddressComponents={true}
 *   placeholder="Enter property address..."
 *   disabled={isLoading}
 * />
 * ```
 *
 * ### Address Selection Flow:
 * 1. User types an address in the search field
 * 2. Google Places API provides real-time suggestions
 * 3. User selects an address from the dropdown
 * 4. Component automatically parses the address into structured components
 * 5. Form fields are automatically populated with the parsed data
 * 6. Visual feedback shows the parsed address components for verification
 *
 * ### Parsed Address Structure:
 * ```typescript
 * interface AddressComponents {
 *   streetNumber: string;    // e.g., "123"
 *   streetName: string;      // e.g., "Main"
 *   streetSuffix: string;    // e.g., "Street", "Ave", "Dr"
 *   city: string;           // e.g., "Toronto"
 *   state: string;          // e.g., "ON"
 *   postalCode: string;     // e.g., "M5V 3A8"
 *   country: string;        // e.g., "Canada"
 * }
 * ```
 *
 * ## 📊 Data Structure
 *
 * The component processes and displays data in this format:
 *
 * ```ts
 * interface EstimateResponse {
 *   estimate: number;
 *   estimateLow: number;
 *   estimateHigh: number;
 *   confidence: number;
 *   address: {
 *     city: string;
 *     streetName: string;
 *     streetNumber: string;
 *     zip: string;
 *   };
 *   details: {
 *     basement1: string;
 *     driveway: string;
 *     exteriorConstruction1: string;
 *     exteriorConstruction2: string;
 *     extras: string[];
 *     heating: string;
 *     numBathrooms: number;
 *     numBedrooms: number;
 *     numFireplaces: string;
 *     numGarageSpaces: number;
 *     numParkingSpaces: number;
 *     propertyType: string;
 *     sqft: number;
 *     style: string;
 *     swimmingPool: string;
 *     yearBuilt: string;
 *   };
 *   lot: {
 *     depth: number;
 *     width: number;
 *   };
 *   taxes: {
 *     annualAmount: number;
 *   };
 * }
 * ```
 *
 * ## 🔧 Implementation Steps
 *
 * 1. **Setup Form Schema with Address Structure**
 * ```ts
 * const formSchema = z.object({
 *   address: z.object({
 *     streetNumber: z.string().min(1, "Street number is required"),
 *     streetName: z.string().min(1, "Street name is required"),
 *     streetSuffix: z.string().optional(),
 *     city: z.string().min(1, "City is required"),
 *     state: z.string().optional(),
 *     zip: z.string().min(5, "Valid ZIP code is required"),
 *   }),
 *   // ... other form fields
 * });
 * ```
 *
 * 2. **Integrate Address Selection Handler**
 * ```ts
 * const handlePlaceSelect = (place: PlaceDetails) => {
 *   // Update form with parsed address components
 *   form.setValue("address", {
 *     streetNumber: place.address.streetNumber,
 *     streetName: place.address.streetName,
 *     streetSuffix: place.address.streetSuffix,
 *     city: place.address.city,
 *     state: place.address.state,
 *     zip: place.address.postalCode,
 *   });
 * };
 * ```
 *
 * 3. **Add UnifiedAddressSearch to Form**
 * ```tsx
 * <FormField
 *   control={form.control}
 *   name="address"
 *   render={() => (
 *     <FormItem>
 *       <FormLabel>Property Address</FormLabel>
 *       <FormControl>
 *         <UnifiedAddressSearch
 *           onPlaceSelect={handlePlaceSelect}
 *           displayAddressComponents={true}
 *           placeholder="Enter property address..."
 *           disabled={isLoading}
 *         />
 *       </FormControl>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 * ```
 *
 * 4. **Implement API Integration**
 * ```ts
 * const fetchEstimate = async (data: FormData) => {
 *   const response = await fetch("/api/estimates", {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       "REPLIERS-API-KEY": process.env.NEXT_PUBLIC_REPLIERS_API_KEY!,
 *     },
 *     body: JSON.stringify(data),
 *   });
 *   return response.json();
 * };
 * ```
 *
 * ## 🎨 Styling
 *
 * The component uses Tailwind CSS and shadcn/ui for styling. Make sure to include these dependencies:
 *
 * ```bash
 * npm install tailwindcss @tailwindcss/forms @radix-ui/react-label @radix-ui/react-select
 * ```
 *
 * ## 🛠️ Dependencies
 *
 * Required packages:
 * - React
 * - TypeScript
 * - Tailwind CSS
 * - React Hook Form
 * - Zod
 * - Radix UI components
 * - Repliers API Client
 * - Google Places API (for address search)
 *
 * ## 🔍 Error Handling
 *
 * The component includes comprehensive error handling for:
 * - Form validation errors
 * - API errors (both Repliers and Google Places)
 * - Network issues
 * - Invalid property data
 * - API rate limiting
 * - Google Maps loading failures
 *
 * ## 📝 Related Components
 *
 * - **UnifiedAddressSearch**: The address autocomplete component used within this estimator
 *   - [View Component Documentation](https://github.com/Repliers-io/pocs/blob/main/src/components/unified-address-search)
 *   - [View Component Code](https://github.com/Repliers-io/pocs/blob/main/src/components/unified-address-search/unified-address-search.tsx)
 *
 * ## 📝 Full Component Code
 *
 * For the complete implementation of this component, including all the code and functionality, visit:
 * [View Full Component Code](https://github.com/Repliers-io/pocs/blob/main/src/components/estimates/property-value-estimator/property-value-estimator.tsx)
 *
 */

const meta: Meta<typeof PropertyValueEstimator> = {
  title: "PoCs/Estimates/Property Value Estimator",
  component: PropertyValueEstimator,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[800px] p-4">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PropertyValueEstimator>;

export const WorkingDemo: Story = {
  args: {},
};
