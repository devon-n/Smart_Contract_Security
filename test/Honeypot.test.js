const HoneypotBank = artifacts.require("HoneypotBank");
const Honeypot = artifacts.require("Honeypot");
const BankAttack = artifacts.require("BankAttack");

const BN = web3.utils.BN;
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should();

// Init Contracts
let honeypotBank;
let honeypot;
let bankAttack;

// Set amounts
const eth5 = web3.utils.toWei('5', 'ether');
const eth1 = web3.utils.toWei('1', 'ether');


contract('Honeypot', ([deployWallet, investor1, investor2]) => {

    it('should revert the attackers transaction', async () => {
        // Deploy contracts
        honeypotBank = await HoneypotBank.new();
        honeypot = await Honeypot.new();
        bankAttack = await BankAttack.new();

        // Transfer 5 eth to the bank
        await honeypotBank.deposit({ from: deployWallet, value: eth5 });
        await bankAttack.receiveEth({ from: deployWallet, value: eth1 });

        // Check balances of contracts
        let balanceBank = await web3.eth.getBalance(honeypotBank.address); 
        let balanceReentrancy = await web3.eth.getBalance(bankAttack.address);

        // Check balances of both contracts
        assert.equal(balanceBank, eth5);
        assert.equal(balanceReentrancy, eth1);

        // Attack
        await bankAttack.attack().should.be.rejectedWith('revert');

        // Check balances
        balanceBank = await web3.eth.getBalance(honeypotBank.address); 
        balanceReentrancy = await web3.eth.getBalance(bankAttack.address);
        console.log('Bank: ', balanceBank);
        console.log('Reen: ', balanceReentrancy);
    });
});