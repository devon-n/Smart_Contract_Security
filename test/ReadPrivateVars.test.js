const ReadPrivateVars = artifacts.require("ReadPrivateVars");

const BN = web3.utils.BN;
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should();

// Init Contracts
let readPrivateVars;

contract('ReadPrivateVars', ([deployWallet]) => {

    it('should read the private variables', async () => {
        readPrivateVars = await ReadPrivateVars.new(1090);
        let pass = await web3.eth.getStorageAt(readPrivateVars.address, 0,);
        pass = parseInt(pass);
        console.log('This is the pass: ', pass);
        assert.equal(pass, 1090);
    });
});