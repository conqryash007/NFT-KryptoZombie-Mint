// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Connector.sol";

error Kryptobird__ALREADY_EXISTS();

contract Kryptobird is ERC721Connector {
    // VARIABLES
    string[] public krytoBird;
    mapping(string => bool) krytoBirdExists;

    // EVENTS

    // FUNCTIONS
    function mint(string memory _krytoBird) public {
        if (krytoBirdExists[_krytoBird]) revert Kryptobird__ALREADY_EXISTS();

        krytoBird.push(_krytoBird);
        uint256 _id = krytoBird.length - 1;

        _mint(msg.sender, _id);
        krytoBirdExists[_krytoBird] = true;
    }

    constructor() ERC721Connector("KryptoBird", "KBZ") {}
}
