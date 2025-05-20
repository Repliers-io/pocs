import type { Meta, StoryObj } from "@storybook/react";
import { ZipCodeData } from "./zip-code-data";

const meta: Meta<typeof ZipCodeData> = {
  title: "Components/ZipCodeData",
  component: ZipCodeData,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ZipCodeData>;

export const Default: Story = {
  args: {},
};
