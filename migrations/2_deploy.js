const Bank = artifacts.require("Bank");
const Reentrancy = artifacts.require("Reentrancy");
const Unsafe = artifacts.require("Unsafe");
const ForceSend = artifacts.require("ForceSend");
const ReadPrivateVars = artifacts.require("ReadPrivateVars");
const HackMe = artifacts.require("Hackme");
const Lib = artifacts.require("Lib");
const Attack = artifacts.require("Attack");
const KingOfEther = artifacts.require("KingOfEther");
const KingAttack = artifacts.require("KingAttack");

module.exports = async (deployer) => {
    await deployer.deploy(Bank);
    const bank = await Bank.deployed();

    bank.deposit({ value: 5000000000000000000 });
    const balance = await web3.eth.getBalance(Bank.address);
    
    await deployer.deploy(Reentrancy, Bank.address);

    // Force send ether
    await deployer.deploy(Unsafe);
    await deployer.deploy(ForceSend);

    // Private Vars
    await deployer.deploy(ReadPrivateVars, 1090);

    // Delegate Call
    await deployer.deploy(Lib);
    const lib = await Lib.deployed();
    await deployer.deploy(HackMe, Lib.address);
    await deployer.deploy(Attack, HackMe.address);

    // Denial of service
    await deployer.deploy(KingOfEther);
    await deployer.deploy(KingAttack);
};
