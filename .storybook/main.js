const path = require('path');
const { ROOT_PATH } = require('../webpack/utils');

module.exports = {
  typescript: {
    reactDocgen: 'react-docgen',
  },
  stories: [path.resolve(ROOT_PATH, 'src/ui-kit/components/**/*.stories.@(ts|tsx)')],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          // When using postCSS 8
          implementation: require('postcss'),
        },
      },
    },
  ],
  // babel: async (options) => {
  //   return {
  //     ...options,
  //   };
  // },
  webpackFinal: async (config) => {
    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
};
