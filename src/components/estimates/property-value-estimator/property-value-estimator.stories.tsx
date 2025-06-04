import type { Meta, StoryObj } from "@storybook/react";
import { PropertyValueEstimator } from "./property-value-estimator";

/**
 *
 * ## 👤 User Story
 *
 * As a real estate professional, I want to collect detailed property information and get instant property value estimates.
 *
 * This component helps real estate professionals:
 * - Collect comprehensive property details
 * - Get instant property value estimates
 * - Make data-driven decisions about property values
 * - Provide accurate property assessments to clients
 *
 * This component provides real-time property value estimates using Repliers API data and a comprehensive property details form.
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
 *
 * 3. Copy the component files:
 *    - `property-value-estimator.tsx`
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
 * ## 📦 Component Structure
 *
 * The component consists of three main parts:
 *
 * 1. Property Information Form - Collects detailed property data
 * 2. API Integration - Handles communication with Repliers API
 * 3. Results Display - Shows the estimate results
 *
 * ## 💡 Key Features
 *
 * 1. **Comprehensive Property Details**
 *    - Address information
 *    - Property specifications
 *    - Lot dimensions
 *    - Tax information
 *
 * 2. **Real-time Estimates**
 *    - Instant property value estimates
 *    - High and low value ranges
 *    - Confidence scores
 *
 * 3. **Interactive UI**
 *    - Form validation
 *    - Real-time updates
 *    - Loading states
 *    - Error handling
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
 * 1. **Setup Form Schema**
 * ```ts
 * const formSchema = z.object({
 *   streetNumber: z.string().min(1, "Street number is required"),
 *   streetName: z.string().min(1, "Street name is required"),
 *   city: z.string().min(1, "City is required"),
 *   zip: z.string().min(5, "Valid ZIP code is required"),
 *   // ... other form fields
 * });
 * ```
 *
 * 2. **Add State Management**
 * ```ts
 * const form = useForm<z.infer<typeof formSchema>>({
 *   resolver: zodResolver(formSchema),
 *   defaultValues: {
 *     streetNumber: "",
 *     streetName: "",
 *     // ... other default values
 *   },
 * });
 * ```
 *
 * 3. **Implement API Integration**
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
 *
 * ## 🔍 Error Handling
 *
 * The component includes comprehensive error handling for:
 * - Form validation errors
 * - API errors
 * - Network issues
 * - Invalid property data
 * - API rate limiting
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
