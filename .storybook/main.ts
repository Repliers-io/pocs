import type { StorybookConfig } from "@storybook/experimental-nextjs-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/experimental-nextjs-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // Replace MCP service with browser-compatible mock
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use browser mock instead of real MCP service (which requires Node.js)
      [path.resolve(__dirname, "../src/components/chatbot/services/mcpService.ts")]: path.resolve(__dirname, "../src/components/chatbot/services/mcpService.browser.ts"),
    };

    return config;
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  managerHead: (head) => `
    ${head}
    <link rel="icon" type="image/png" href="/favicon.png" />
  `,
};
export default config;
