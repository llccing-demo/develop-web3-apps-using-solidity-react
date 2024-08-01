// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract ChallengeAcceptPayments {
  constructor() {
    console.log("Constract is deployed");
  }

  receive() external payable {}
}