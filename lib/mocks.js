const rs = require('randomstring');
const sha256 = require('sha256');
const config = require('./config');
const ip = require('ip');

const getMnList = () => {
  const basePort = 3000;
  const arr = [];
  const localIp = ip.address();

  for (let i = 0; i < config.quorumSize * config.dapiMultiplicator; i += 1) {
    arr.push({
      vin: `2fb6c98b37f1fce1c35b556e5f175dd77939f08c1687ad468d37fc677d297dd6-${i}`,
      status: 'ENABLED',
      rank: rs.generate({ length: 3, charset: 'numeric' }),
      ip: `${localIp}:${basePort + i}`,
      protocol: 70208,
      payee: `y${rs.generate({ length: 34, charset: 'hex' })}`,
      activeseconds: 384154,
      lastseen: 1508750134,
    });
  }

  return arr;
};

const getDynamicMnList = () => {
  const basePort = 3000;
  const arr = [];
  const localIp = ip.address();

  for (let i = 0; i < config.quorumSize * config.dapiMultiplicator; i += 1) {
    arr.push({
      vin: `${sha256(`${new Date().getHours()}-${new Date().getMinutes()}-${i}`)}`,
      status: 'ENABLED',
      rank: i,
      ip: `${localIp}:${basePort + i}`,
      protocol: 70208,
      payee: 'y_dummyaddress',
      activeseconds: 384154,
      lastseen: 1508750134,
    });
  }

  return arr;
};

const getDeterministicMnList = () => {
  const basePort = 3000;
  const arr = [];
  const localIp = ip.address();

  for (let i = 0; i < config.quorumSize * config.dapiMultiplicator; i += 1) {
    arr.push({
      proRegTxHash: `${sha256(`${new Date().getHours()}-${new Date().getMinutes()}-${i}`)}`,
      keyIDOperator: `${rs.generate({ length: 40, charset: 'hex' })}`,
      keyIDVoting: `${rs.generate({ length: 40, charset: 'hex' })}`,
      service: `${localIp}`,
      port: basePort,
      isValid: true,
    });
  }

  return arr;
};

module.exports = {
  getDynamicMnList,
  getDeterministicMnList,
  getMnList,
};
