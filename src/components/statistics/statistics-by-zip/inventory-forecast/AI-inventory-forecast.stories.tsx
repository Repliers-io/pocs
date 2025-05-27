import type { Meta, StoryObj } from "@storybook/react";
import { AIInventoryForecast } from "./AI-inventory-forecast";

/**
 *
 * This component provides real-time real estate market analysis for any given zip code using Repliers API data and OpenAI's analysis capabilities.
 *
 * ## 🎥 Video Demo
 *
 * Watch a demo of this component in action: [View Demo Video](https://www.loom.com/share/503d120372d2445786922c0a4f89cc3f?sid=e0ca72d9-0b25-46e9-9366-ac1ae3e87919)
 *
 * ## 🚀 Quick Start
 *
 * 1. Install dependencies:
 * ```bash
 * npm install openai lucide-react
 * ```
 *
 * 2. Copy the component files:
 * - `AI-inventory-forecast.tsx`
 * - `data-display.tsx`
 * - Required UI components from your component library
 *
 * 3. Add to your project:
 * ```tsx
 * import { AIInventoryForecast } from "./components/AI-inventory-forecast";
 *
 * function App() {
 *   return (
 *     <div className="container mx-auto p-4">
 *       <AIInventoryForecast />
 *     </div>
 *   );
 * }
 * ```
 *
 * ## 🔑 Required API Keys
 *
 * ### 1. Repliers API Key
 * - Sign up at [Repliers Developer Portal](https://dev.repliers.io)
 * - Get your API key from the dashboard
 * - The component will prompt for this key
 *
 * ### 2. OpenAI API Key
 * - Sign up at [OpenAI Platform](https://platform.openai.com)
 * - Create an API key in the dashboard
 * - The component will prompt for this key
 *
 * ## 📦 Component Structure
 *
 * The component consists of three main parts:
 *
 * 1. API Key Inputs - Handles authentication for both Repliers and OpenAI APIs
 * 2. Zip Code Input - Allows users to enter their target location
 * 3. Data Display - Shows the analysis results and forecasts
 *
 * ## 💡 Key Features
 *
 * 1. **Real-time Market Analysis**
 *    - Current inventory levels
 *    - Price trends
 *    - Days on market
 *    - Risk assessment
 *
 * 2. **AI-Powered Forecasting**
 *    - 3-month inventory projections
 *    - Market trend analysis
 *    - Risk level assessment
 *
 * 3. **Interactive UI**
 *    - Secure API key input
 *    - Real-time data updates
 *    - Loading states
 *    - Error handling
 *
 * ## 📊 Data Structure
 *
 * The component processes and displays data in this format:
 *
 * ```ts
 * interface ProcessedData {
 *   zipCode: string;
 *   riskLevel: string;
 *   location: string;
 *   averagePrice: number;
 *   priceChange: number;
 *   sixMonthAverage: number;
 *   sixMonthChange: number;
 *   yearOverYearAverage: number;
 *   yearOverYearChange: number;
 *   currentInventory: number;
 *   daysOnMarket: number;
 *   inventoryForecast: {
 *     month: string;
 *     value: number;
 *   }[];
 * }
 * ```
 *
 * ## 🔧 Implementation Steps
 *
 * 1. **Setup API Integration**
 * ```ts
 * // Configure API endpoints
 * const REPLIERS_API_URL = 'https://dev.repliers.io/listings';
 * const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
 * ```
 *
 * 2. **Add State Management**
 * ```ts
 * const [apiKey, setApiKey] = useState("");
 * const [openaiApiKey, setOpenaiApiKey] = useState("");
 * const [zipCode, setZipCode] = useState("");
 * const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
 * ```
 *
 * 3. **Implement Data Fetching**
 * ```ts
 * const fetchRepliersData = async (zipCode: string) => {
 *   const response = await fetch(
 *     `${REPLIERS_API_URL}?zip=${zipCode}&statistics=cnt-available,avg-soldPrice,med-daysOnMarket`,
 *     {
 *       headers: {
 *         "REPLIERS-API-KEY": apiKey,
 *         "Content-Type": "application/json"
 *       }
 *     }
 *   );
 *   return response.json();
 * };
 * ```
 *
 * 4. **Add AI Analysis**
 * ```ts
 * const analyzeWithAI = async (data: any) => {
 *   const response = await fetch(OPENAI_API_URL, {
 *     method: "POST",
 *     headers: {
 *       "Authorization": `Bearer ${openaiApiKey}`,
 *       "Content-Type": "application/json"
 *     },
 *     body: JSON.stringify({
 *       model: "gpt-4",
 *       messages: [
 *         {
 *           role: "system",
 *           content: "Analyze real estate data and return structured insights"
 *         },
 *         {
 *           role: "user",
 *           content: JSON.stringify(data)
 *         }
 *       ]
 *     })
 *   });
 *   return response.json();
 * };
 * ```
 *
 * ## 🎨 Styling
 *
 * The component uses Tailwind CSS for styling. Make sure to include these dependencies:
 *
 * ```bash
 * npm install tailwindcss @tailwindcss/forms
 * ```
 *
 * ## 🛠️ Dependencies
 *
 * Required packages:
 * - React
 * - TypeScript
 * - Tailwind CSS
 * - Lucide React (for icons)
 * - Repliers API Client
 * - OpenAI API Client
 *
 * ## 🔍 Error Handling
 *
 * The component includes comprehensive error handling for:
 * - Invalid API keys
 * - Network errors
 * - Invalid zip codes
 * - API rate limiting
 * - Data processing errors
 *
 */

const meta: Meta<typeof AIInventoryForecast> = {
  title: "PoCs/Statistics/Statistics by Zip/AI Inventory Forecast",
  component: AIInventoryForecast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AIInventoryForecast>;

export const WorkingDemo: Story = {
  args: {},
};
