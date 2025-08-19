import type { Meta, StoryObj } from "@storybook/react";
import { AutocompleteSearch } from "./autocomplete-search";

const SAMPLE_API_KEY = "pxI19UMy9zfw9vz5lRxoGpjJWXrMnm";

const meta: Meta<typeof AutocompleteSearch> = {
  title:
    "Tutorials/Configuring the AutocompleteSearch Component with the Repliers API",
  component: AutocompleteSearch,
  parameters: {
    layout: "fullscreen",
    docs: {
      page: () => null, // Use MDX file instead
    },
  },
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
    apiKey: SAMPLE_API_KEY,
    placeholder: "Search for properties, cities, or neighborhoods...",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "30px",
          paddingBottom: "530px",
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "🎯 **This is the main interactive demo!** Try searching for properties, cities, or neighborhoods. The component makes real API calls using your provided API key. **Great search terms to try:** city names like 'Toronto' or 'Vancouver', addresses, or MLS numbers.",
      },
    },
  },
};
