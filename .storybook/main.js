module.exports = {
  typescript: {
    reactDocgen: "react-docgen",
  },
  stories: ["../src/ui-kit/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "@storybook/addon-styling",
      options: {
        postCss: true,
      },
    },
  ],
  babel: async (options) => {
    return {
      ...options,
    };
  },
  webpackFinal: async (config) => {
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    return config;
  },
};
