import type { Meta, StoryObj } from "@storybook/react";
import { ZipCodeData } from "./zip-code-data";

/**
 * # ZipCodeData Component
 *
 * A React component that provides real estate market analysis for a given zip code. It fetches data from Repliers API and uses OpenAI to analyze market trends.
 *
 * ## Complete Code
 *
 * You can find the complete working code for this component in the Repliers POCs repository:
 * [View on GitHub](https://github.com/Repliers-io/pocs/blob/main/src/components/zip-code-data/zip-code-data.tsx)
 *
 * ## Tech Stack
 * - React
 * - TypeScript
 * - Tailwind CSS
 * - Repliers API
 * - OpenAI API
 *
 * ## Required API Keys
 *
 * This component requires two API keys:
 *
 * 1. **Repliers API Key**
 *    - Sign up at [Repliers Developer Portal](https://dev.repliers.io)
 *    - Navigate to your dashboard to obtain your API key
 *    - Enter the key in the Repliers API Key input field
 *
 * 2. **OpenAI API Key**
 *    - Sign up at [OpenAI Platform](https://platform.openai.com)
 *    - Navigate to API Keys section to create a new key
 *    - Enter the key in the OpenAI API Key input field
 *
 * ## Component Structure
 *
 * The component consists of:
 * - Zip code input field
 * - Data display section showing:
 *   - Location and risk level
 *   - Average price and price change
 *   - Current inventory
 *   - Days on market
 *   - 3-month inventory forecast
 *
 * ## Usage Example
 *
 * ```tsx
 * import { ZipCodeData } from "./zip-code-data";
 *
 * function App() {
 *   return (
 *     <div className="container mx-auto p-4">
 *       <ZipCodeData />
 *     </div>
 *   );
 * }
 * ```
 *
 * ## Data Interface
 *
 * The component processes and displays the following data structure:
 *
 * ```typescript
 * interface ProcessedData {
 *   zipCode: string;
 *   riskLevel: string;
 *   location: string;
 *   averagePrice: number;
 *   priceChange: number;
 *   currentInventory: number;
 *   daysOnMarket: number;
 *   inventoryForecast: {
 *     month: string;
 *     value: number;
 *   }[];
 * }
 * ```
 *
 * ## Error Handling
 *
 * The component includes error handling for:
 * - Invalid API keys
 * - Network errors
 * - Invalid zip codes
 * - API rate limiting
 *
 * ## Styling
 *
 * The component uses Tailwind CSS for styling. Make sure your project has Tailwind CSS configured.
 *
 * ## Dependencies
 *
 * Required components:
 * - @/components/ui/input
 * - @/components/ui/button
 * - @/components/api-input/api-input
 * - ./data-display
 */

const meta: Meta<typeof ZipCodeData> = {
  title: "Components/ZipCodeData",
  component: ZipCodeData,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ZipCodeData>;

export const Default: Story = {
  args: {},
};
