import type { Meta, StoryObj } from "@storybook/react";
import { Chatbot } from "./chatbot";

// Use same sample key as map-listings component
const SAMPLE_REPLIERS_API_KEY = "pxI19UMy9zfw9vz5lRxoGpjJWXrMnm";

const meta: Meta<typeof Chatbot> = {
  title: "pocs/Chatbot/Real Estate Chatbot",
  component: Chatbot,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Real Estate Chatbot

An intelligent, conversational AI chatbot for real estate websites powered by Repliers NLP API
and optional ChatGPT integration.

## ✨ Features

- 🗣️ **Natural Language Search** - "3 bedroom condo in Toronto under $800k"
- 🤖 **ChatGPT Integration** - Natural conversation (optional, add OpenAI key)
- 🔄 **Context-Aware** - Multi-turn refinement maintains conversation context
- 🎨 **Visual Search** - Search by aesthetics: "modern white kitchen"
- 🏠 **Beautiful UI** - Responsive property cards with images
- 🎨 **White-Label Ready** - Customizable branding, logo, and colors
- 📱 **Mobile Optimized** - Full-screen on mobile, panel on desktop

## 🚀 Quick Start

1. **Try the Working Demo** story below
2. **(Optional)** Add your OpenAI API key for ChatGPT conversation
3. Search: "3 bedroom condo in Toronto"
4. Refine: "Under $800k"

## 🎯 Example Queries

- "3 bedroom condo in Toronto"
- "House under $800k with a backyard"
- "Modern apartment with white kitchen"
- "Show me properties in the Annex"

## 🔑 API Keys

- **Repliers API**: Sample key provided - [get yours here](https://repliers.com)
- **OpenAI API** (optional): For ChatGPT conversation - [get key](https://platform.openai.com)

## 🔧 Integration

Copy the entire \`src/components/chatbot\` directory into your project. All dependencies
are self-contained for easy integration.

\`\`\`tsx
import { Chatbot } from '@/components/chatbot';

<Chatbot
  repliersApiKey="your-key"
  brokerageName="Your Realty"
  brokerageLogo="https://your-site.com/logo.png"
/>
\`\`\`
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
      description:
        "OpenAI API key (optional - enables ChatGPT for natural conversation). Get yours at platform.openai.com",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined (uses fallback responses)" },
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
      description: "Primary brand color (future feature)",
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
 * **Working Demo**
 *
 * A fully functional chatbot with NLP-powered property search.
 * This demonstrates the core functionality with all features enabled.
 *
 * **Try these queries:**
 * - "Hello!" (if you add an OpenAI API key)
 * - "3 bedroom condo in Toronto"
 * - "House under $800k with a backyard"
 * - "Modern apartment with white kitchen"
 * - "Show me properties in the Annex"
 *
 * **NEW: Unique Keyword Searches:**
 * - "I'm looking for a horse farm in Orlando"
 * - "House with pool and wine cellar"
 * - "Property with home theater"
 * - "Waterfront property with dock"
 *
 * **To enable ChatGPT conversation:**
 * Add your OpenAI API key in the controls below for natural, intelligent dialogue.
 *
 * **Check the browser console** to see API calls and keyword extraction!
 */
export const WorkingDemo: Story = {
  args: {
    repliersApiKey: SAMPLE_REPLIERS_API_KEY,
    openaiApiKey: undefined, // ⬅️ Paste your OpenAI API key here to enable ChatGPT!
    brokerageName: "Smart Homes Realty",
    welcomeMessage:
      "Hi! I'm your AI real estate assistant. Tell me what you're looking for!",
    placeholder: "e.g., 3 bedroom house in Toronto under $800k...",
  },
  parameters: {
    docs: {
      description: {
        story: `
This is a complete, working demonstration of the chatbot with all features:

- **Natural Language Search**: Ask in plain English
- **Multi-Turn Conversations**: Refine searches with context
- **Visual Search**: Search by aesthetics (e.g., "modern kitchen")
- **ChatGPT Integration**: Add your OpenAI key for intelligent conversation
- **Beautiful UI**: Responsive property cards with images

**Getting Started:**
1. Try a search query like "3 bedroom condo in Toronto"
2. (Optional) Add your OpenAI API key for ChatGPT conversation
3. Watch the console to see API calls in action
        `,
      },
    },
  },
};

/**
 * **Custom Branding**
 *
 * This story shows how to white-label the chatbot with your brokerage's branding.
 * Customize the name, logo, colors, welcome message, and button position.
 *
 * **Perfect for:**
 * - Adding to your real estate website
 * - White-labeling for clients
 * - Matching your brand identity
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
    position: "bottom-right",
  },
  parameters: {
    docs: {
      description: {
        story: `
Customize every aspect of the chatbot to match your brand:

**Branding Options:**
- \`brokerageName\`: Your company name in the header
- \`brokerageLogo\`: URL to your logo image
- \`welcomeMessage\`: Custom greeting message
- \`placeholder\`: Custom input placeholder text
- \`primaryColor\`: Brand color (future feature)
- \`position\`: "bottom-right" or "bottom-left"

**Example Integration:**
\`\`\`tsx
<Chatbot
  repliersApiKey="your-key"
  openaiApiKey="your-openai-key"
  brokerageName="Your Realty"
  brokerageLogo="https://your-site.com/logo.png"
  welcomeMessage="Welcome! How can I help you find your dream home?"
  position="bottom-right"
/>
\`\`\`
        `,
      },
    },
  },
};
