// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract ChallengeRatiosSplit {
    uint256[] public splitRatios;

    constructor(uint256[] memory _splitRatios) {
        require(
            _splitRatios.length > 2,
            "More than two address should be provided to establish a partnership"
        );

        checkSplitRatios(_splitRatios);

        splitRatios = _splitRatios;
        console.log("Constract is deployed");
    }

    function checkSplitRatios(uint256[] memory _splitRatios) private pure {
        for (uint256 i = 0; i < _splitRatios.length; i++) {
            require(
                _splitRatios[i] > 5,
                "Split ratio should be greater than five"
            );
        }
    }
}
