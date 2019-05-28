/* eslint no-param-reassign: ["error", { "props": false }] */

const _ = require('lodash');
const sha256 = require('sha256');
const bigInt = require('big-integer');
const ip = require('ip');
const config = require('./config');

const resolveVinFromIp = (mnList) => {
  const localip = ip.address();
  if (mnList[0].proRegTxHash) {
    const match = _.find(mnList, mn => mn.service === localip);
    return match ? match.proRegTxHash : null;
  }
  const match = _.find(mnList, mn => mn.ip === localip);
  return match ? match.vin : null;
};

const resolveVinFromPort = (mnList, port) => {
  if (mnList[0].proRegTxHash) {
    const match = _.find(mnList, mn => mn.port === port);
    return match ? match.proRegTxHash : null;
  }
  const match = _.find(mnList, mn => mn.ip.indexOf(port) > -1);
  return match ? match.vin : null;
};

const getHash = obj => sha256(typeof obj === 'string' ? obj : JSON.stringify(obj));
const getPOWAveragingNum = () => config.POWAveragingNum;
const getHeartBeatInterval = () => config.heartbeatInterval;
const getRefHeight = lastHeight => lastHeight - config.quorumRefHeight;

// 1: to discuss - weakness in using blockhash as leading zeros will penalise/reward mns with vin
// collateral closer to extremes in the search space mitigate by stripping leading zeros and pad
// with equal amount from end of the hash?

// 2: to discuss - weakness in same mn's in same quorums while for the same mnLists

// As per (1) remove zeros and pad with end to get a truly random value within the 256-bit search
// space. We can also hash the blockhash for same effect with slightly more - albeit negligible -
// overhead for clients
const getTrulyRandomBlockHash = (blockHash) => {
  const leadingZeros = _.takeWhile(blockHash.split(''), e => e === '0').length;
  const trulyRandomBlockHash =
    blockHash.substring(blockHash.length - leadingZeros, blockHash.length)
    + blockHash.substring(leadingZeros, blockHash.length);
  return trulyRandomBlockHash;
};

const revHex = (s) => {
  let r = '';
  let i = 0;
  for (; i < s.length; i += 2) { r = s.slice(i, i + 2) + r; }
  return r;
};

// TODO: Rethink the algorithm to avoid potentially unnecessary mutation
const getAverageHash = (array) => {
  let avgHash = bigInt.zero;
  array.forEach((element) => {
    let hash;

    if (element.hash) {
      hash = revHex(getTrulyRandomBlockHash(element.hash));
    } else if (element.proRegTxHash) {
      hash = (element.proRegTxHash.includes('-') ?
        element.proRegTxHash.substring(0, element.proRegTxHash.indexOf('-')) :
        element.proRegTxHash);
    } else if (element.vin) {
      hash = (element.vin.includes('-') ?
        element.vin.substring(0, element.vin.indexOf('-')) :
        element.vin);
    } else {
      throw new Error('unexpected input for getAverageHash()');
    }

    const bigint = bigInt(hash, 16);
    avgHash = avgHash.add(bigint);
  });

  avgHash = avgHash.divide(bigInt(array.length));
  return avgHash.toString(16);
};

module.exports = {
  resolveVinFromIp,
  resolveVinFromPort,
  getHash,
  getPOWAveragingNum,
  getHeartBeatInterval,
  getRefHeight,
  getAverageHash,
};
