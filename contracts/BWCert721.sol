// SPDX-License-Identifier: MIT

/***
Looking to for a crypto / web3 ERP solution?
Search no further: www.bitwave.io
We are hiring as well, check out our careers page too for great opportunities!
***/

pragma solidity ^0.8.4;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


/***
BETA CONTRACT NOT FOR MAINNET DEPLOYMENT
 */
contract BWCert721 is ERC721, Ownable {

    string private baseExtension = ".json";
    string public baseURI = "ipfs://QmXYLJ2xZ3E9oLXRxVkwSEWxog7gnRtFVttQ5aEFAL5P1N/";

    uint256 internal _currentIndex;

    constructor() ERC721("Bitwave Certificate", "BWC") {}

    function currentTokenId() private returns (uint256) {
        return _currentIndex += 1;
    }

    function mint(address to) public onlyOwner {
        _safeMint(to, currentTokenId());
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
        ERC721.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override onlyOwner {
        require(msg.sender == from);
        ERC721.safeTransferFrom(from, to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId));
        string memory stringTokenId = Strings.toString(tokenId);
        return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseURI, stringTokenId, baseExtension)) : '';
    }
}
