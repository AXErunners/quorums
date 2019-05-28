const { message } = require('@axerunners/axecore-lib');
const _ = require('lodash');
const { getQuorum } = require('./determination');

const Validate = (data, signature, quorumData) =>
  new Promise(((resolve) => {
    if (message(JSON.stringify(data)).verify(quorumData.refAddr, signature)) {
      const quorum = getQuorum(quorumData.mnList, quorumData.calcHash, data.txId);

      // todo: temp until rpc to get outpoint
      // let vin = quorumsUtil.resolveVinFromPort(quorumData.mnList, qTempPort);
      if (quorumData.proRegTxHash) {
        resolve(Boolean(_.find(quorum, q => q.proRegTxHash === quorumData.proRegTxHash)));
      } else if (quorumData.vin) {
        resolve(Boolean(_.find(quorum, q => q.vin === quorumData.vin)));
      }
    } else {
      resolve(false);
    }
  }));

const validate = (data, signature, quorumData) =>
  Validate(data, signature, quorumData);

module.exports = {
  validate,
};
