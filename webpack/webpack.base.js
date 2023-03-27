const path = require('path');
const webpack = require('webpack');
const webpackbar = require('webpackbar');
const eduCoreVersion = require('agora-edu-core/package.json').version;
const { ROOT_PATH, ALIAS } = require('./utils/index');
const { base } = require('./utils/loaders');
const rteVersion = require('agora-rte-sdk/package.json').version;

const classroomSdkVersion = require('../package.json').version;

module.exports = {
  externals: {
    'agora-electron-sdk': 'commonjs2 agora-electron-sdk',
    'agora-rdc-core': 'commonjs2 agora-rdc-core',
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    },
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@onlineclass': path.resolve(ROOT_PATH, 'src'),
      '@res': path.resolve(ROOT_PATH, 'src/resources'),
      ...ALIAS,
    },
  },
  module: {
    unknownContextCritical: false,
    rules: [...base],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpackbar(),
    new webpack.DefinePlugin({
      RTE_SDK_VERSION: JSON.stringify(rteVersion),

      EDU_SDK_VERSION: JSON.stringify(eduCoreVersion),
      CLASSROOM_SDK_VERSION: JSON.stringify(classroomSdkVersion),
    }),
  ],
  stats: {
    children: true,
  },
};
