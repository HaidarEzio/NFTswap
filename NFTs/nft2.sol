// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT2 is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("DINO2", "D2") {
        mint("PUT YOUR 2nd WALLET ADDRESS HERE", 420);
    }

    function mint(address to, uint256 id) private returns (bool) {
        _safeMint(to, id);
        _setTokenURI(id, "blooh");

        return true;
    }
}
