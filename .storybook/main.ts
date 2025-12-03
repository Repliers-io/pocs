import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
    "@storybook/addon-links",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  webpackFinal: async (config) => {
    // Replace MCP service with browser-compatible mock
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use browser mock instead of real MCP service (which requires Node.js)
      [path.resolve(__dirname, "../src/components/chatbot/services/mcpService.ts")]: path.resolve(__dirname, "../src/components/chatbot/services/mcpService.browser.ts"),
    };

    // Add fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
      fs: false,
      net: false,
      tls: false,
      process: false,
      stream: false,
      buffer: false,
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
