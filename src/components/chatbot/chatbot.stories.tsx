import type { Meta, StoryObj } from "@storybook/react";
import { Chatbot } from "./chatbot";
import { useState } from "react";

const meta: Meta<typeof Chatbot> = {
  title: "Components/Chatbot",
  component: Chatbot,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the input field",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Type your message..." },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Whether the chatbot is processing a response",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chatbot>;

export const Default: Story = {
  args: {
    placeholder: "Type your message...",
  },
};

export const WithInitialMessages: Story = {
  args: {
    initialMessages: [
      {
        id: "1",
        content: "Hello! How can I help you today?",
        role: "assistant",
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: "2",
        content: "I need help with my account",
        role: "user",
        timestamp: new Date(Date.now() - 30000),
      },
      {
        id: "3",
        content: "I'd be happy to help you with your account. What specifically do you need assistance with?",
        role: "assistant",
        timestamp: new Date(),
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    initialMessages: [
      {
        id: "1",
        content: "What's the weather like today?",
        role: "user",
        timestamp: new Date(),
      },
    ],
  },
};

export const Interactive: Story = {
  render: () => {
    const [messages, setMessages] = useState([
      {
        id: "1",
        content: "Hello! I'm your AI assistant. How can I help you today?",
        role: "assistant" as const,
        timestamp: new Date(),
      },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = (message: string) => {
      setIsLoading(true);

      // Simulate bot response after 1.5 seconds
      setTimeout(() => {
        const botMessage = {
          id: Date.now().toString(),
          content: `You said: "${message}". This is a demo response!`,
          role: "assistant" as const,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 1500);
    };

    return (
      <Chatbot
        initialMessages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo with simulated bot responses. Try sending a message!",
      },
    },
  },
};
