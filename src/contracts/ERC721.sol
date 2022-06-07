// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error ERC721__ADDRESS_ZERO();
error ERC721__ALREADY_MINTED();

contract ERC721 {
    // STATE VARIABLE

    mapping(uint256 => address) private _tokenOwner;
    mapping(address => uint256) private _ownedTokenCount;

    // EVENTS
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    // FUNCTIONS
    function _mint(address to, uint256 tokenId) internal {
        if (to == address(0)) revert ERC721__ADDRESS_ZERO();

        if (_tokenOwner[tokenId] != address(0)) {
            revert ERC721__ALREADY_MINTED();
        }

        _tokenOwner[tokenId] = to;
        _ownedTokenCount[to]++;
        emit Transfer(address(0), to, tokenId);
    }
}
