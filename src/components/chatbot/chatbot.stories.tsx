import type { Meta, StoryObj } from "@storybook/react";
import { Chatbot } from "./chatbot";

// Use same sample key as map-listings component
const SAMPLE_REPLIERS_API_KEY = "pxI19UMy9zfw9vz5lRxoGpjJWXrMnm";

const meta: Meta<typeof Chatbot> = {
  title: "pocs/Chatbot/Real Estate Chatbot",
  component: Chatbot,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Real Estate Chatbot with NLP Integration

A conversational AI chatbot for real estate websites that uses **Repliers NLP API** to understand natural language property searches and display results in real-time.

## ✨ Features

- 🗣️ **Natural Language Understanding** - Ask in plain English: "3 bedroom condo in Toronto"
- 🔄 **Context-Aware Conversations** - Multi-turn refinement using nlpId
- 🎨 **Visual Search** - Search by aesthetics: "modern white kitchen"
- 🏠 **Beautiful Property Cards** - Images, specs, and details
- 📱 **Fully Responsive** - Full-screen on mobile, panel on desktop
- 🎨 **Customizable Branding** - Logo, colors, and messaging
- ♿ **Accessible** - Keyboard navigation and ARIA labels

## 🧠 How It Works

1. **User types query**: "3 bedroom condo in Toronto under $800k"
2. **Repliers NLP API** processes the natural language
3. **Property search** executes with extracted criteria
4. **Results display** in beautiful property cards inline

## 🔑 API Key

This demo uses a **sample Repliers API key**. For production, get your own key at [repliers.com](https://repliers.com).

## 🎯 Try These Queries

- "3 bedroom condo in Toronto"
- "House under $800k with a backyard"
- "Modern apartment with white kitchen"
- "Show me properties in the Annex"
- "2 bed 2 bath with parking"

## 🔗 Multi-Turn Conversations

The chatbot maintains context across messages:
1. "I want a condo"
2. "Make it 3 bedrooms"
3. "Under $800k"

Each message refines the previous search!
        `,
      },
    },
  },
  argTypes: {
    repliersApiKey: {
      control: "text",
      description: "Repliers API key (required for property search)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Sample key provided" },
      },
    },
    openaiApiKey: {
      control: "text",
      description: "OpenAI API key (optional - for enhanced conversation, Step 3)",
      table: {
        type: { summary: "string" },
      },
    },
    brokerageName: {
      control: "text",
      description: "Name of the brokerage to display in chat header",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Real Estate Assistant" },
      },
    },
    brokerageLogo: {
      control: "text",
      description: "URL to brokerage logo image",
      table: {
        type: { summary: "string" },
      },
    },
    primaryColor: {
      control: "color",
      description: "Primary brand color (future feature - Step 3)",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "#3B82F6" },
      },
    },
    position: {
      control: "radio",
      options: ["bottom-right", "bottom-left"],
      description: "Position of the floating button",
      table: {
        type: { summary: "bottom-right | bottom-left" },
        defaultValue: { summary: "bottom-right" },
      },
    },
    welcomeMessage: {
      control: "text",
      description: "Custom welcome message from the assistant",
      table: {
        type: { summary: "string" },
        defaultValue: {
          summary:
            "Hi! I'm your AI real estate assistant. Tell me what you're looking for and I'll help you find the perfect home.",
        },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the message input",
      table: {
        type: { summary: "string" },
        defaultValue: {
          summary: "e.g., 3 bedroom house in Toronto under $800k...",
        },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chatbot>;

/**
 * **Basic Property Search**
 *
 * This story demonstrates the core NLP-powered property search functionality.
 * The chatbot understands natural language and returns real property listings.
 *
 * **Try these queries:**
 * - "3 bedroom condo in Toronto"
 * - "House under $800k with a backyard"
 * - "Modern apartment with white kitchen"
 * - "Show me properties in the Annex"
 *
 * **Check the browser console** to see NLP API calls and responses!
 */
export const BasicPropertySearch: Story = {
  args: {
    repliersApiKey: SAMPLE_REPLIERS_API_KEY,
    brokerageName: "Acme Realty",
    welcomeMessage:
      "Hi! I'm your AI real estate assistant. Tell me what you're looking for!",
  },
};

/**
 * **Custom Branding**
 *
 * This story shows how to white-label the chatbot with your brokerage's branding.
 * Customize the name, logo, colors, and welcome message.
 */
export const CustomBranding: Story = {
  args: {
    repliersApiKey: SAMPLE_REPLIERS_API_KEY,
    brokerageName: "Luxury Homes Toronto",
    brokerageLogo:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop",
    welcomeMessage:
      "Welcome to Luxury Homes Toronto! Let me help you find your dream property in the heart of the city.",
    placeholder: "Describe your dream home...",
    primaryColor: "#1e40af",
  },
};

/**
 * **Left Position**
 *
 * Sometimes you need the chat button on the left side of the screen.
 * This story demonstrates the position customization.
 */
export const LeftPositioned: Story = {
  args: {
    repliersApiKey: SAMPLE_REPLIERS_API_KEY,
    brokerageName: "Downtown Properties",
    position: "bottom-left",
  },
};

/**
 * **Multi-Turn Conversation Demo**
 *
 * This story demonstrates context-aware conversations using Repliers' nlpId feature.
 * The chatbot maintains context across multiple messages!
 *
 * **Try this conversation flow:**
 * 1. Type: "I want a condo"
 * 2. Then: "3 bedrooms"
 * 3. Then: "In Toronto"
 * 4. Then: "Under $800k"
 *
 * Each message refines the previous search using the same nlpId.
 * Check the browser console to see the nlpId being passed!
 */
export const MultiTurnConversation: Story = {
  args: {
    repliersApiKey: SAMPLE_REPLIERS_API_KEY,
    brokerageName: "Smart Homes Realty",
    welcomeMessage:
      "Hi! Start by telling me what type of property you're interested in, then we can refine from there.",
  },
  parameters: {
    docs: {
      description: {
        story: `
The chatbot uses Repliers' **nlpId** feature to maintain conversation context.
Each refinement builds on previous queries, making the search feel natural and conversational.

Open your browser console to see the nlpId being maintained across messages!
        `,
      },
    },
  },
};

/**
 * **Visual Search Demo**
 *
 * The chatbot supports aesthetic/visual property searches!
 * Try searching for properties by their appearance.
 *
 * **Try these visual queries:**
 * - "Condo with modern white kitchen"
 * - "House with hardwood floors"
 * - "Apartment with marble countertops"
 *
 * The NLP API will include imageSearchItems in the request,
 * ranking properties by visual match. Check the console!
 */
export const VisualSearch: Story = {
  args: {
    repliersApiKey: SAMPLE_REPLIERS_API_KEY,
    brokerageName: "Design-Forward Homes",
    welcomeMessage:
      "Looking for a specific style or aesthetic? Describe the look you want!",
    placeholder: "e.g., modern kitchen, hardwood floors...",
  },
  parameters: {
    docs: {
      description: {
        story: `
Visual search allows users to find properties based on aesthetics.
The Repliers NLP API extracts visual preferences and uses imageSearchItems
to rank properties by visual similarity.
        `,
      },
    },
  },
};

/**
 * **Mobile View**
 *
 * This story demonstrates the mobile-responsive design.
 * On mobile, the chat interface expands to fill the entire screen
 * for an optimal user experience.
 */
export const MobileView: Story = {
  args: {
    repliersApiKey: SAMPLE_REPLIERS_API_KEY,
    brokerageName: "Mobile Realty",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: `
On mobile devices, the chat interface takes up the full screen.
Property cards stack vertically for easy scrolling.
        `,
      },
    },
  },
};

/**
 * **In Real Estate Website Context**
 *
 * This story shows how the chatbot looks when embedded in a typical
 * real estate website. The floating button stays accessible while
 * users browse properties on the page.
 */
export const InContext: Story = {
  args: {
    repliersApiKey: SAMPLE_REPLIERS_API_KEY,
    brokerageName: "Premier Properties",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Mock website header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Premier Properties
            </h1>
            <p className="text-sm text-gray-600">
              Find your dream home with AI assistance
            </p>
          </div>
        </header>

        {/* Mock website content */}
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              AI-Powered Property Search
            </h2>
            <p className="text-xl text-gray-600">
              Chat with our AI assistant to find properties that match your
              exact needs. Just describe what you're looking for in natural
              language!
            </p>

            {/* Mock property cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">Property {i}</h3>
                    <p className="text-gray-600">3 bed • 2 bath • $750,000</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 p-8 bg-blue-600 text-white rounded-2xl">
              <h3 className="text-2xl font-bold mb-2">
                Try Our AI Chat Assistant
              </h3>
              <p className="text-blue-100">
                Click the chat button in the bottom right to get started!
              </p>
            </div>
          </div>
        </main>

        {/* Chatbot will appear as floating button */}
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: `
This story shows how the chatbot integrates seamlessly into a real estate website.
The floating button stays accessible while users browse the page.
        `,
      },
    },
  },
};

/**
 * **Error Handling Demo**
 *
 * This story has an invalid API key to demonstrate error handling.
 * Try sending a property search query to see the user-friendly error message.
 *
 * The chatbot gracefully handles API errors without crashing.
 */
export const ErrorHandling: Story = {
  args: {
    repliersApiKey: "invalid_api_key_for_demo",
    brokerageName: "Error Demo",
    welcomeMessage: "Try searching for a property to see error handling in action.",
  },
  parameters: {
    docs: {
      description: {
        story: `
This story uses an invalid API key to demonstrate error handling.
Try searching for properties to see how errors are handled gracefully
with user-friendly messages.
        `,
      },
    },
  },
};
