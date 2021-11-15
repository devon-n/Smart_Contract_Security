const Bank = artifacts.require("Bank");
const Reentrancy = artifacts.require("Reentrancy");

const BN = web3.utils.BN;
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should();

// Init Contracts
var bank;
var reentrancy;

// Set amounts
const eth5 = web3.utils.toWei('5', 'ether');
const eth1 = web3.utils.toWei('1', 'ether');



contract('Bank',  ([deployWallet, wallet, investor1, investor2, investor3]) => {

    beforeEach( async () => {
        // Deploy contracts
        bank = await Bank.new();
        reentrancy = await Reentrancy.new(bank.address);

        // Transfer funds
        await bank.deposit({ from: deployWallet, value: eth5 });
        await reentrancy.receiveEth({ from: deployWallet, value: eth1 });
    });

    describe('Testing the attack', () => {
        it('should only withdraw 1 ether', async () => {

            // Check balances of contracts
            let balanceBank = await web3.eth.getBalance(bank.address); 
            let balanceReentrancy = await web3.eth.getBalance(reentrancy.address);

            // Check balances of both contracts
            assert.equal(balanceBank, eth5);
            assert.equal(balanceReentrancy, eth1);

            // Attack
            await reentrancy.attack().should.be.rejectedWith('revert');

            // Check balances
            balanceBank = await web3.eth.getBalance(bank.address); 
            balanceReentrancy = await web3.eth.getBalance(reentrancy.address);
            console.log('Bank: ', balanceBank);
            console.log('Reen: ', balanceReentrancy);
        });
    });
});