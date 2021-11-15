// SPDX-License-Identifier: MIT
pragma solidity ^0.6.10;

contract Bank {

  mapping(address => uint256) public balances;

  bool internal locked;
  modifier noReentrant() {
    require(!locked, 'No reentrancy');
    locked = true;
    _;
    locked = false;
  }

  function deposit() payable public {
    balances[msg.sender] += msg.value;
  }

  function withdraw(uint256 _amount) public noReentrant {
    require(balances[msg.sender] >= _amount, 'Insufficient Funds');

    balances[msg.sender] -= _amount; // Reduce balances before balance is sent to stop reentrancy attacks

    (bool sent, ) = msg.sender.call{value: _amount}("");
    require(sent, 'Failed to send Ether');

    // balances[msg.sender] -= _amount; // Reducing the balance after sent is vulnerable to reentrancy
  }

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }
}

contract Reentrancy {

  event debug(uint8 number);
  Bank public bank;

  constructor(address _bankAddress) public {
    bank = Bank(_bankAddress);
  }

  function receiveEth() payable public {
  }

  fallback() external payable {
    if(address(bank).balance >= 1 ether) {
      bank.withdraw(1 ether);
    }
  }

  function attack() external payable {
    require(msg.value >= 1 ether);
    bank.deposit{value: 1 ether}();
    bank.withdraw(1 ether);
  }
}
