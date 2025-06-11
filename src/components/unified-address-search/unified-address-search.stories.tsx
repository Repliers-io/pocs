import type { Meta, StoryObj } from "@storybook/react";
import { unified-address-search } from "./unified-address-search";

/**
 * ## 👤 User Story
 *
 * As a user, I want to [describe the main user need this component addresses].
 *
 * This component helps users:
 * - [Benefit 1]
 * - [Benefit 2]
 * - [Benefit 3]
 *
 * ## 🚀 Quick Start
 *
 * 1. Install dependencies:
 * ```bash
 * npm install [list required dependencies]
 * ```
 *
 * 2. Import and use the component:
 * ```tsx
 * import { unified-address-search } from "./components/unified-address-search";
 *
 * function App() {
 *   return (
 *     <div className="container mx-auto p-4">
 *       <unified-address-search />
 *     </div>
 *   );
 * }
 * ```
 *
 * ## 💡 Key Features
 *
 * 1. **Feature 1** - Description of feature 1
 * 2. **Feature 2** - Description of feature 2
 * 3. **Feature 3** - Description of feature 3
 *
 * ## 🔧 Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | className | string | undefined | Additional CSS classes |
 *
 */

const meta: Meta<typeof unified-address-search> = {
  title: "Components/unified-address-search",
  component: unified-address-search,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes to apply to the component",
    },
  },
};

export default meta;
type Story = StoryObj<typeof unified-address-search>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};

export const WithCustomClass: Story = {
  args: {
    className: "border border-gray-300 p-4 rounded-lg",
  },
};

// Add more stories as needed
export const Example: Story = {
  args: {
    // Add example props here
  },
};
