// SPDX-License-Identifier: MIT
pragma solidity 0.6.10;

contract ReadPrivateVars {
    uint256 private password;

    constructor(uint256 _password) public {
        password = _password;
    }
}