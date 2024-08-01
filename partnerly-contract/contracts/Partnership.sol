// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract Partnership {
  address payable[] public addresses;
  uint256[] public splitRatios;
  uint256 private splitRatiosTotal;

  constructor(address payable[] memory _addresses, uint256[] memory _splitRatios) {
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

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function withdraw() public {
    uint256 balance = getBalance();
    uint256 addressesLength = addresses.length;
    
    // console.log("before Balance: %s", balance);

    require(balance > 0, "Insufficient balance");

    require(balance >= splitRatiosTotal, "Balance should be greater than the total split ratio");

    for (uint256 i = 0; i < addressesLength; i++) {
      addresses[i].transfer(
        (balance/splitRatiosTotal) * splitRatios[i]
      );
    }

    // console.log("after Balance: %s", getBalance());
  }

  receive() external payable {
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