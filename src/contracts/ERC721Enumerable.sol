// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";

error ERC721Enumerable__Index_OutBound();
error ERC721Enumerable__Owner_Index_OutBound();

contract ERC721Enumerable is ERC721 {
    uint256[] private _allTokens;

    // mapping from tokenId to position in _allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;

    // mapping of owner to list of all owner token ids
    mapping(address => uint256[]) private _ownedTokens;

    // mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    function _mint(address to, uint256 tokenId) internal override {
        super._mint(to, tokenId);

        _addTokensToAllEnumeration(tokenId);
        _addTokensToOwnerEnumeration(to, tokenId);
    }

    function _addTokensToAllEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;

        _allTokens.push(tokenId);
    }

    function _addTokensToOwnerEnumeration(address to, uint256 tokenId) private {
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;

        _ownedTokens[to].push(tokenId);
    }

    function _totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }

    function _tokekenByIndex(uint256 index) public view returns (uint256) {
        if (index >= _allTokens.length)
            revert ERC721Enumerable__Index_OutBound();
        return _allTokens[index];
    }

    function _tokenOfOwnerByIndex(address owner, uint256 index)
        public
        view
        returns (uint256)
    {
        if (index >= balanceOf(owner))
            revert ERC721Enumerable__Owner_Index_OutBound();

        return _ownedTokens[owner][index];
    }
}
