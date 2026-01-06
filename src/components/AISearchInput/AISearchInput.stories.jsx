import AISearchInput from "./AISearchInput";

export default {
  title: "pocs/AISearchInput/AISearchInput",
  component: AISearchInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An expanded AI search interface with multiline input, floating search button, and entity recognition chips.",
      },
    },
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Describe your dream home..." },
      },
    },
    initialValue: {
      control: "text",
      description: "Initial value for the input",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "" },
      },
    },
    entities: {
      control: "object",
      description: "Array of entity objects to display as chips",
      table: {
        type: { summary: "array" },
        defaultValue: { summary: "[]" },
      },
    },
    width: {
      control: "text",
      description: "Width of the component",
      table: {
        type: { summary: "string | number" },
        defaultValue: { summary: "800px" },
      },
    },
    onQueryChange: {
      action: "query changed",
      description: "Callback fired when query changes (debounced by 500ms)",
      table: {
        type: { summary: "function" },
      },
    },
    onSearch: {
      action: "search triggered",
      description: "Callback fired when search button is clicked",
      table: {
        type: { summary: "function" },
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "100%",
          minHeight: "600px",
          padding: "80px 40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

// Default - Shows inspiration suggestions when focused
export const Default = {
  args: {
    placeholder: "Describe your dream home...",
    initialValue: "",
    width: "800px",
    entities: [],
  },
};

// With Entity Chips - Shows parsed entities
export const WithEntityChips = {
  args: {
    placeholder: "Describe your dream home...",
    initialValue:
      "Looking for a spacious family home with 4 bedrooms, 3 bathrooms, at least 2500 square feet, with a budget around $750,000 in a quiet neighborhood with good schools",
    width: "800px",
    entities: [
      { type: "bedrooms", label: "4 bedrooms" },
      { type: "bathrooms", label: "3 bathrooms" },
      { type: "area", label: "2500+ sqft" },
      { type: "price", label: "~$750k" },
    ],
  },
};
