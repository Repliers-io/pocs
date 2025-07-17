import type { StorybookConfig } from "@storybook/experimental-nextjs-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
  ],
  framework: {
    name: "@storybook/experimental-nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: async (config, { configType }) => {
    return {
      ...config,
      base: configType === "PRODUCTION" ? "/pocs/" : "/",
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@": path.resolve(__dirname, "../src"),
        },
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          ...(config.optimizeDeps?.include ?? []),
          "@hookform/resolvers/zod",
        ],
      },
      define: {
        // Explicitly prevent environment variables from being bundled
        // Only define safe, non-sensitive values here
        "process.env.NODE_ENV": JSON.stringify(
          process.env.NODE_ENV || "development"
        ),
        // Never define NEXT_PUBLIC_ variables in production Storybook builds
        ...(configType === "DEVELOPMENT" &&
          {
            // Only in development, allow specific environment variables if needed
            // "process.env.NEXT_PUBLIC_SOME_SAFE_VAR": JSON.stringify(process.env.NEXT_PUBLIC_SOME_SAFE_VAR),
          }),
      },
    };
  },
};
export default config;
