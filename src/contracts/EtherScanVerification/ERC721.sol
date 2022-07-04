// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error ERC721__ADDRESS_ZERO();
error ERC721__ALREADY_MINTED();
error ERC721__INVALID_USER();
error ERC721__NOT_OWNER();
error ERC721__SAME_ADDRESS();

import "./IERC721.sol";

contract ERC721 is IERC721 {
    // STATE VARIABLE

    mapping(uint256 => address) private _tokenOwner;
    mapping(address => uint256) private _ownedTokenCount;

    mapping(uint256 => address) private _tokenApproval;

    // FUNCTIONS

    function balanceOf(address _owner) public view returns (uint256) {
        if (_owner == address(0)) revert ERC721__INVALID_USER();

        return _ownedTokenCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public view returns (address) {
        address owner = _tokenOwner[_tokenId];
        if (owner == address(0)) revert ERC721__INVALID_USER();

        return owner;
    }

    function _mint(address to, uint256 tokenId) internal virtual {
        if (to == address(0)) revert ERC721__ADDRESS_ZERO();

        if (_tokenOwner[tokenId] != address(0)) {
            revert ERC721__ALREADY_MINTED();
        }

        _tokenOwner[tokenId] = to;
        _ownedTokenCount[to]++;
        emit Transfer(address(0), to, tokenId);
    }

    function _transferFrom(
        address _from,
        address _to,
        uint256 tokenId
    ) internal {
        if (_to == address(0)) revert ERC721__ADDRESS_ZERO();

        if (_tokenOwner[tokenId] != _from) revert ERC721__NOT_OWNER();

        _ownedTokenCount[_from] -= 1;
        _ownedTokenCount[_to] += 1;

        _tokenOwner[tokenId] = _to;

        emit Transfer(_from, _to, tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 tokenId
    ) public {
        _transferFrom(_from, _to, tokenId);
    }

    function approve(address _to, uint256 _tokenId) public {
        address owner = ownerOf(_tokenId);

        if (_to == owner) revert ERC721__SAME_ADDRESS();

        if (msg.sender != owner) revert ERC721__NOT_OWNER();

        _tokenApproval[_tokenId] = _to;

        emit Approval(owner, _to, _tokenId);
    }
}
