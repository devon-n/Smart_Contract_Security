// SPDX-License-Identifier: MIT
pragma solidity ^0.6.10;

contract Unsafe {
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

contract ForceSend {
    function kill(address payable addr) public payable {
        selfdestruct(addr);
    }

    function receiveEth() payable public {
    }
}

contract Safe {

    uint public balance;

    function deposit() payable public { // Use a function to deposit ether which relies on a variable rather than address(this).balance
        balance += msg.value;
    }
    function getBalance() public view returns (uint256) {
        return balance;
    }
}