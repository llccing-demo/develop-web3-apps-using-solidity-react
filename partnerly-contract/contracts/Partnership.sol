// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract Partnership {
  address[] public addresses;
  uint256[] public splitRatios;


  constructor(address[] memory _addresses, uint256[] memory _splitRatios) {
    require(
      _addresses.length > 1,
      "More than one address should be provided to establish a partnership"
    );

    require(
      _splitRatios.length == _addresses.length,
      "the address amount and the split ratio amount should be equal"
    );

    addresses = _addresses;
    splitRatios = _splitRatios;
    console.log("Constract is deployed");
  }
}