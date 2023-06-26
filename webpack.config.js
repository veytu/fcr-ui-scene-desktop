const webpackMerge = require('webpack-merge');
const path = require('path');
const baseConfig = require('agora-common-libs/presets/webpack.config.base.js');
const ROOT_PATH = path.resolve(__dirname, './');
const fs = require('fs');
const uiKitPath = path.resolve(ROOT_PATH, '../agora-scenario-ui-kit');
const uiKitDesktopPath = path.resolve(ROOT_PATH, '../agora-scenario-ui-kit-desktop');
const alias = {};
if (fs.existsSync(uiKitPath)) {
  alias['@components'] = path.resolve(ROOT_PATH, '../agora-scenario-ui-kit/src/components');
  alias['@ui-kit-utils'] = path.resolve(ROOT_PATH, '../agora-scenario-ui-kit/src/utils');
} else if (fs.existsSync(uiKitDesktopPath)) {
  alias['@components'] = path.resolve(ROOT_PATH, '../agora-scenario-ui-kit-desktop/src/components');
  alias['@ui-kit-utils'] = path.resolve(ROOT_PATH, '../agora-scenario-ui-kit-desktop/src/utils');
}
const config = {
  entry: {
    onlineclass_sdk: './src/index',
  },
  output: {
    path: path.resolve(ROOT_PATH, 'lib'),
    publicPath: './',
    filename: '[name].bundle.js',
    libraryTarget: 'umd',
    clean: true,
  },
  resolve: {
    alias: {
      '@res': path.resolve(ROOT_PATH, './src/resources'),
      '@onlineclass': path.resolve(ROOT_PATH, './src'),
      ...alias,
    },
  },
};

const mergedConfig = webpackMerge.merge(baseConfig, config);
module.exports = mergedConfig;
