// TODO: Figure out a better approach for conditional requires or default configs
/* eslint-disable */
let config;

try {
  config = require('./config.json');
  console.info('Using config from config.json');
} catch (e) {
  console.warn('No config.json file was provided in lib/config');
  console.warn('Using default config instead');
  config = require('./default.config.json');
}

module.exports = config;
