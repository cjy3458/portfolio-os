import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    // Tailwind CSS v4 via Vite plugin
    config.plugins = [...(config.plugins ?? []), tailwindcss()];

    // @/* path alias
    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        "@": path.resolve(__dirname, ".."),
        "next/image": path.resolve(__dirname, "./mocks/next-image.tsx"),
      },
    };
    return config;
  },
};

export default config;
