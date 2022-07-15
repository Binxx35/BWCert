// SPDX-License-Identifier: MIT

/***
Looking for a crypto / web3 ERP solution?
Search no further: www.bitwave.io
We are hiring great engineering talent, check out our careers page for opportunities!
***/

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

 /// @title A modified ERC721 token for Bitwave Certification.
 /// @author Inish Crisson
 /// @author Jesse Farese
 /// @author Kunz Mainali
 /// @dev This contract is a modified version of the ERC721 contract.
 /// @notice This beta contract is pending review, not for mainnet deployment.
contract BWCert721Modified is ERC721, Ownable {

    // Pending image finalisation, presently placeholder.
    string public baseURI = "ipfs://QmTZ1mYb4rnfGbYHxBfSabhtxLUjKW3ySi6z2ri73bZHWb/";

    /// @notice A mapping to facilitate pre-approval functionality.
    /// @notice NFT transfers require approval from Bitwave & the owner of the NFT.
    mapping (uint => address) public bitwaveApprovals;

    /// @notice Constructor, sets name and symbol.
    constructor() ERC721("Bitwave Certificate", "BWC") {}

    /// @notice iterating uint for tokenId creation.
    uint256 internal _currentIndex;

    /// @notice An internal function to iterate tokenIds.
    function currentTokenId() private returns (uint256) {
        return _currentIndex += 1;
    }

    /// @notice A custom function to mint NFTs in bulk. 
    /// @notice Only callable by the owner of the contract.
    /// @param to the array of addresses to mint the NFTs to.
    function bulkMint(address[] memory to) public onlyOwner {
        for (uint i = 0; i < to.length; i++) {
            _mint(to[i], currentTokenId());
        }
    }

    /// @notice Overrides the ERC721 transferFrom function to add multisig functionality.
    /// @notice NFT transfers require approval from Bitwave & the owner of the NFT.
    /// @param from address of the sender
    /// @param to address of the recipient
    /// @param tokenId the id of the token to be transferred
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public onlyOwner virtual override {
        ERC721._approve(msg.sender, tokenId);
        ERC721.transferFrom(from, to, tokenId);
    }

    /// @notice Transfers a token to a new owner. This functions is called by the owner of the contract.  
    /// @param from the address of the current owners of the token.
    /// @param to the address of the new owner of the token.
    /// @param tokenId the id of the token to be transfered.
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public onlyOwner virtual override {
        ERC721._approve(msg.sender, tokenId);
        ERC721.safeTransferFrom(from, to, tokenId);
    }

    /// @notice mint a single new token
    /// @param to the address to which the token is to be minted.
    function mint(address to) public onlyOwner {
        _safeMint(to, currentTokenId());
    }

    /// @notice Withdraw ether from the contract.
    /// @notice only callable by the owner of the contract. 
    function withdraw() external payable onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /// @notice returns the URI of the image associated with the token.
    /// @param tokenId the id of the token to be queried.
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "This certificate has not been issued yet.");
        return bytes(baseURI).length != 0 ? baseURI : '';
    }
}
