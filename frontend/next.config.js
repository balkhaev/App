const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(process.env));

    return config;
  },
};
