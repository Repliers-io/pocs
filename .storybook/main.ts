import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // Configure path aliases and service mocks
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Next.js @ alias for src directory
      "@": path.resolve(__dirname, "../src"),
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
