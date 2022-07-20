// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Connector.sol";

error Kryptozombie__ALREADY_EXISTS();

contract Kryptozombie is ERC721Connector {
    // VARIABLES
    string[] public kryptoZombie;
    mapping(string => bool) kryptoZombieExists;

    // FUNCTIONS
    function mint(string memory _kryptoZombie) public {
        if (kryptoZombieExists[_kryptoZombie])
            revert Kryptozombie__ALREADY_EXISTS();

        kryptoZombie.push(_kryptoZombie);
        uint256 _id = kryptoZombie.length - 1;

        _mint(msg.sender, _id);
        kryptoZombieExists[_kryptoZombie] = true;
    }

    constructor() ERC721Connector("KryptoZombie", "KPZ") {}
}
