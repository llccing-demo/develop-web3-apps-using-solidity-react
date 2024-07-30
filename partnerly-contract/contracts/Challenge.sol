// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract Challenge {
  uint256 private targetAmount = 2;

  constructor(uint256 _amount) {
    require(
      _amount == targetAmount,
      "Error"
    );

    console.log("Challenge contract deployed");
  }
}