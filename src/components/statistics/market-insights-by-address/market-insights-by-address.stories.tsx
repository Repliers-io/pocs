import type { Meta, StoryObj } from "@storybook/react";
import { MarketInsightsByAddress } from "./market-insights-by-address";

const meta: Meta<typeof MarketInsightsByAddress> = {
  title: "POCS/Statistics/Market Insights By Address",
  component: MarketInsightsByAddress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MarketInsightsByAddress>;

export const WorkingDemo: Story = {
  args: {},
};
