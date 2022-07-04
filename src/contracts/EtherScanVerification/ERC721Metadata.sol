// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC721Metadata.sol";

contract ERC721Metadata is IERC721Metadata {
    string private _name;
    string private _symbol;

    constructor(string memory m_name, string memory m_symbol) {
        _name = m_name;
        _symbol = m_symbol;
    }

    function name() external view returns (string memory) {
        return _name;
    }

    function symbol() external view returns (string memory) {
        return _symbol;
    }
}
