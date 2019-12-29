const webpack = require('webpack');

module.exports = {
  env: {
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
  },
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));

    return config;
  },
};
