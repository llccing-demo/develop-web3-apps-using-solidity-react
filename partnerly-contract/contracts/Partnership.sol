// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract Partnership {
  address[] public addresses;
  uint256[] public splitRatios;
  uint256 private splitRatiosTotal;

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
    splitRatiosTotal = getSplitRatiosTotal(_splitRatios);
    console.log("Constract is deployed");
  }

  function getSplitRatiosTotal(uint[] memory _splitRatios) private pure returns (uint256) {
    uint256 total = 0;
    for (uint256 i = 0; i < _splitRatios.length; i++) {
      require(
        _splitRatios[i] > 0,
        "Split ratio should be greater than zero"
      );
      total += _splitRatios[i];
    }

    return total;
  }
}