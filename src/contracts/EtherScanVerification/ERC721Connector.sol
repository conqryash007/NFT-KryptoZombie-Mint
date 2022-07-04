// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721Metadata.sol";
import "./ERC721Enumerable.sol";

import "./ERC165.sol";

contract ERC721Connector is ERC721Metadata, ERC721Enumerable, ERC165 {
    constructor(string memory name, string memory symbol)
        ERC721Metadata(name, symbol)
    {}

    // ERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC721).interfaceId ||
            interfaceId == type(IERC721Enumerable).interfaceId ||
            interfaceId == type(IERC721Metadata).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
