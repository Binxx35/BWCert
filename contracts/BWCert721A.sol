// SPDX-License-Identifier: MIT

/***
Looking for a crypto / web3 ERP solution?
Search no further: www.bitwave.io
We are hiring great engineering talent, check out our careers page for opportunities!
***/

pragma solidity ^0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/***
BETA CONTRACT NOT FOR MAINNET DEPLOYMENT
 */
contract BWCert721A is ERC721A, Ownable {
    string private baseExtension = ".json";
    string public baseURI = "ipfs://QmXYLJ2xZ3E9oLXRxVkwSEWxog7gnRtFVttQ5aEFAL5P1N/";
    
    constructor() ERC721A("Bitwave Certificate", "BWC") {}

    function mint(uint256 quantity) public onlyOwner {
        _safeMint(msg.sender, quantity);
    }

    function withdraw() external payable onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override onlyOwner {
        require(msg.sender == from);
        ERC721A.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override onlyOwner {
        require(msg.sender == from);
        ERC721A.safeTransferFrom(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();
        string memory stringTokenId = Strings.toString(tokenId);
        return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseURI, stringTokenId, baseExtension)) : '';
    }
}
