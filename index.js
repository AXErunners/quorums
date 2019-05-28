const { getQuorum, getQuorums } = require('./lib/determination');
const { validate } = require('./lib/validation');
const {
  resolveVinFromIp, getHash, getAverageHash, getRefHeight, getHeartBeatInterval, getPOWAveragingNum,
} = require('./lib/utils');
const { getDynamicMnList } = require('./lib/mocks');
const { getDeterministicMnList } = require('./lib/mocks');
const { getConfig } = require('./lib/config');

module.exports = {
  getQuorum,
  getQuorums,
  validate,
  resolveVinFromIp,
  getHash,
  getAverageHash,
  getRefHeight,
  getHeartBeatInterval,
  getDynamicMnList,
  getDeterministicMnList,
  getPOWAveragingNum,
  getConfig,
};
