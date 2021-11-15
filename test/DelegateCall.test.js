const HackMe = artifacts.require("Hackme");
const Lib = artifacts.require("Lib");
const Attack = artifacts.require("Attack");

const BN = web3.utils.BN;
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should();

// Init Contracts
let hackMe;
let lib;
let attack;


contract('Delegate Call', ([deployWallet]) => {

    it('should update the owner of hackMe to be the attack contract address', async () => {
        // Deploy contracts
        lib = await Lib.new();
        hackMe = await HackMe.new(lib.address);
        attack = await Attack.new(hackMe.address);
        
        // Get owner
        const hackMeOwner = await hackMe.owner();
        assert.equal(deployWallet, hackMeOwner);

        // Print owner
        console.log('Owner: ', hackMeOwner);
        console.log('Deployer Address: ', deployWallet);

        // Attack
        console.log('Attacking')
        await attack.attack();
        const newHackMeOwner = await hackMe.owner();
        assert.equal(newHackMeOwner, attack.address);
        
        // Print owner
        console.log('Owner: ', newHackMeOwner);
        console.log('Attack contract Address: ',attack.address);
    });
});