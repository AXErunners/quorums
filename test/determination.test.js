const quorums = require('../');
const config = require('../lib/config');
require('chai').should();

describe('Determination', () => {
  describe('shuffleDeterministic', () => {});
  describe('getAllQuorums', () => {});
  describe('getQuorumForDapi', () => {});
  describe('getQuorumForUser', () => {});
  describe('getQuorum', () => {
    const blockhash = '000000000000001df67af19476f747e063e9c57d6f42132aeac385f7664f85cd';
    const txid = 'c43c2469e9ff0ca5916785a002711f12fc13acf31f0797091229d3a7b95d401a';

    it('Length of old quorum is equal to quorumSize', async () => {
      const mnList = quorums.getDynamicMnList();
      const oldQuorum = quorums.getQuorum(mnList, blockhash, txid);
      oldQuorum.nodes.length.should.equal(config.quorumSize);
    });
    it('Length of quorum is equal to quorumSize', async () => {
      const detMnList = quorums.getDeterministicMnList();
      const quorum = quorums.getQuorum(detMnList, blockhash, txid);
      quorum.nodes.length.should.equal(config.quorumSize);
    });
  });
  describe('getQuorums', () => {});
});
