import type { Meta, StoryObj } from "@storybook/react";
import { Chatbot } from "./chatbot";

const meta: Meta<typeof Chatbot> = {
  title: "pocs/Chatbot/Real Estate Chatbot",
  component: Chatbot,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# Real Estate Chatbot PoC

An intelligent real estate chatbot widget that provides a floating chat interface for property search assistance.

## Features

- 🏠 **Floating Action Button** - Persistent button with smooth animations
- 💬 **Chat Interface** - Modal panel with warm, inviting design
- 📱 **Responsive** - Full-screen on mobile, panel on desktop
- 🎨 **Customizable** - Brand colors, logo, and messaging
- ♿ **Accessible** - Keyboard navigation and ARIA labels
- 🔄 **Mock Runtime** - Currently using mock responses (MCP integration coming soon)

## Future Integration

This component is designed to integrate with the Repliers MCP Server for:
- Natural language property search
- Real-time MLS data access
- Intelligent query understanding via Repliers NLP API

## Usage

Simply include the component in your application and it will render a floating chat button.
Customize with your brokerage branding and messaging.
        `,
      },
    },
  },
  argTypes: {
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
 * Default chatbot with standard branding and settings.
 * Click the floating button to open the chat interface.
 */
export const Default: Story = {
  args: {},
};

/**
 * Chatbot with custom branding including brokerage name and logo.
 * This demonstrates how to white-label the component for specific brokerages.
 */
export const CustomBranding: Story = {
  args: {
    brokerageName: "Acme Realty Group",
    brokerageLogo:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop",
    welcomeMessage:
      "Welcome to Acme Realty! I'm here to help you find your dream home. What are you looking for?",
    placeholder: "Tell me about your dream home...",
  },
};

/**
 * Chatbot positioned on the bottom-left instead of bottom-right.
 * Useful for pages where right side has other elements.
 */
export const LeftPositioned: Story = {
  args: {
    position: "bottom-left",
    brokerageName: "Downtown Properties",
  },
};

/**
 * Chatbot with a different brokerage and custom messaging.
 */
export const AlternativeBranding: Story = {
  args: {
    brokerageName: "Urban Living Real Estate",
    brokerageLogo:
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=100&h=100&fit=crop",
    welcomeMessage:
      "Hi there! Looking for the perfect urban property? I can help you search apartments, condos, and houses in the city.",
    placeholder: "e.g., 2 bed condo downtown with parking...",
    primaryColor: "#10B981", // Green color (future feature)
  },
};

/**
 * Mobile viewport demonstration.
 * The chat interface takes up the full screen on mobile devices.
 */
export const MobileView: Story = {
  args: {
    brokerageName: "Mobile Realty",
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "On mobile devices, the chat interface expands to fill the entire screen for better usability.",
      },
    },
  },
};

/**
 * Demonstration of the chatbot in a typical real estate website context.
 * The component integrates seamlessly into your existing design.
 */
export const InContext: Story = {
  args: {
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
              Your trusted real estate partner
            </p>
          </div>
        </header>

        {/* Mock website content */}
        <main className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              Find Your Dream Home
            </h2>
            <p className="text-xl text-gray-600">
              Browse thousands of properties or chat with our AI assistant for
              personalized recommendations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                  <h3 className="font-semibold text-lg">Property {i}</h3>
                  <p className="text-gray-600">3 bed • 2 bath • $750,000</p>
                </div>
              ))}
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
        story:
          "This story shows how the chatbot appears in a real website context. The floating button stays accessible while users browse properties.",
      },
    },
  },
};
