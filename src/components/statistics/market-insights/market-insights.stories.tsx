import type { Meta, StoryObj } from "@storybook/react";
import { MarketInsights } from "./market-insights";

const meta: Meta<typeof MarketInsights> = {
  title: "POCS/Reports/Market Insights Report",
  component: MarketInsights,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MarketInsights>;

export const MarketInsightsByMLS: Story = {
  args: {
    by: "mls#",
  },
};

export const MarketInsightsByAddress: Story = {
  args: {
    by: "address",
  },
};
