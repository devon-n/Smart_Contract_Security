const Unsafe = artifacts.require("Unsafe");
const ForceSend = artifacts.require("ForceSend");

const BN = web3.utils.BN;
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should();

// Init Contracts
let unsafe;
let forceSend;
const eth1 = web3.utils.toWei('1', 'ether');

contract('unsafe', ([deployWallet]) => {

    beforeEach( async () => {
        
        // Deploy Contracts
        unsafe = await Unsafe.new();
        forceSend = await ForceSend.new();
        await forceSend.receiveEth({ from: deployWallet, value: eth1 });
    });

    describe('Trying to force send eth', () => {
        it('should let the attack happen', async () => {
            // Check balances of contracts
            let balanceunsafe = await web3.eth.getBalance(unsafe.address); 
            let balanceforceSend = await web3.eth.getBalance(forceSend.address); 
            assert.equal(balanceunsafe, 0);
            assert.equal(balanceforceSend, eth1);

            await forceSend.kill(unsafe.address);

            balanceunsafe = await web3.eth.getBalance(unsafe.address);
            assert.equal(balanceunsafe, balanceforceSend);
        });
    });
});