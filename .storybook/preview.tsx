import type { Preview } from "@storybook/react";
import "../src/app/globals.css";
import React from "react";
import { ApiKeysProvider } from "../src/lib/api-keys-context";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ApiKeysProvider>
        <Story />
      </ApiKeysProvider>
    ),
  ],
};

export default preview;
