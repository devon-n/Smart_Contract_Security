const KingOfEther = artifacts.require("KingOfEther");
const KingAttack = artifacts.require("KingAttack");

const BN = web3.utils.BN;
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should();

// Init Contracts
let kingOfEther;
let kingAttack;

contract('King Of Ether', ([deployWallet, investor1, investor2]) => {

    it('should update the owner of hackMe to be the attack contract address', async () => {
        // Deploy contracts
        kingOfEther = await KingOfEther.new();
        kingAttack = await KingAttack.new();

        // Create king
        await kingOfEther.claimThrone({from: deployWallet, value: web3.utils.toWei('1', 'ether')});
        let currentKing = await kingOfEther.king();
        assert.equal(currentKing, deployWallet);
        console.log(currentKing);
        console.log(deployWallet);

        // Attack
        await kingAttack.attack(kingOfEther.address, { from: investor1, value: web3.utils.toWei('2', 'ether')});
        currentKing = await kingOfEther.king();
        console.log(currentKing);
        console.log(kingAttack.address);
        assert.equal(currentKing, kingAttack.address);

        // Try become king again
        await kingOfEther.claimThrone({from: deployWallet, value: web3.utils.toWei('3', 'ether')}).should.be.rejectedWith('revert');
    });
});