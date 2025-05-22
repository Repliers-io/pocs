import type { Meta, StoryObj } from "@storybook/react";
import { EstimatesForm } from "./generic-property-estimates";

const meta: Meta<typeof EstimatesForm> = {
  title: "PoCs/Generic Property Estimates",
  component: EstimatesForm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A comprehensive form component for collecting property details and generating real estate estimates.

## Features

- **Address Information**: Collects street number, name, city, and ZIP code
- **Property Details**: Captures essential property features like:
  - Number of bedrooms and bathrooms
  - Square footage
  - Property type and style
  - Heating and exterior construction details
  - Additional features (basement, driveway, pool, etc.)
- **Lot Information**: Records lot dimensions
- **Tax Information**: Captures annual tax amounts
- **Real-time API Integration**: Connects to the Repliers API for instant property estimates
- **Responsive Design**: Adapts to different screen sizes
- **Form Validation**: Built-in validation using Zod schema
- **Error Handling**: Displays API errors and validation messages
- **Loading States**: Shows loading indicators during API calls

## Usage

\`\`\`tsx
import { EstimatesForm } from "@/components/generic-property-estimates";

export default function MyPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <EstimatesForm />
    </div>
  );
}
\`\`\`

## API Integration

The component integrates with the Repliers API to provide property estimates. Make sure to set up your environment variables:

\`\`\`env
NEXT_PUBLIC_REPLIERS_API_KEY=your_api_key_here
\`\`\`

## Response Format

The API returns an estimate object with the following structure:

\`\`\`typescript
interface EstimateResponse {
  estimate: number;       
  estimateLow: number;    
  estimateHigh: number;   
  confidence: number;      
  address: {
    city: string;
    streetName: string;
    streetNumber: string;
    zip: string;
  };
  details: {
    basement1: string;
    driveway: string;
    exteriorConstruction1: string;
    exteriorConstruction2: string;
    extras: string[];
    heating: string;
    numBathrooms: number;
    numBedrooms: number;
    numFireplaces: string;
    numGarageSpaces: number;
    numParkingSpaces: number;
    propertyType: string;
    sqft: number;
    style: string;
    swimmingPool: string;
    yearBuilt: string;
  };
  lot: {
    depth: number;
    width: number;
  };
  taxes: {
    annualAmount: number;
  };
}
\`\`\`

## Styling

The component uses Tailwind CSS for styling and is built on top of shadcn/ui components. It follows a clean, modern design with:

- Responsive grid layouts
- Clear visual hierarchy
- Consistent spacing and typography
- Accessible form controls
- Clear error and success states

## Best Practices

1. Always wrap the component in a container with appropriate max-width
2. Ensure the API key is properly set in your environment variables
3. Handle API errors appropriately in your application
4. Consider implementing rate limiting for production use
5. Test the form with various property types and sizes
        `,
      },
    },
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
type Story = StoryObj<typeof EstimatesForm>;

export const WorkingDemo: Story = {
  args: {},
};
