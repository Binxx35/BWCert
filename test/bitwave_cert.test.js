
const truffleAssert = require('truffle-assertions');

const BitwaveCert721 = artifacts.require("./BWCert721.sol");
const BitwaveCert721A = artifacts.require("./BWCert721A.sol");
const BitwaveCert721Modified = artifacts.require("./BWCert721Modified.sol");

contract("BWCert721Modified", accounts  => {
  let BWCert721Modified;
  const owner = accounts[0];

  before(async () => {
   BWCert721Modified = await BitwaveCert721Modified.deployed();
  });
  
  describe('mints 10 NFTs and performs necessary functionality appropriately', async () => {
    it('should only allow the owner contract to mint or bulkMint', async() => {
      await truffleAssert.fails(BWCert721Modified.mint(accounts[2], {from: accounts[1]}), 
      truffleAssert.ErrorType.REVERT,
      "Ownable: caller is not the owner.");

      await truffleAssert.fails(BWCert721Modified.bulkMint(accounts, {from: accounts[1]}), 
      truffleAssert.ErrorType.REVERT,
      "Ownable: caller is not the owner.");
    });

    it('should mint 10 NFTs', async () => {
      let cumulativeGasUsed = 0;
      
      // Passing an array of 10 addresses into the bulkMint function will
      // mint a single NFT to each address with an incrementally higher tokenId.
      const receipt = await BWCert721Modified.bulkMint(accounts, {from: owner});
      cumulativeGasUsed = parseInt(receipt.receipt.cumulativeGasUsed);
      
      // Logging gas consumption from mint for later reference.
      console.log("ERC721 Modified gas used for minting to holder: " + cumulativeGasUsed);
    });

    it('should should require bitwave pre-approval for transfers', async() => {
      // Checking that the owner of tokenId 2 is accounts[1]
      expect(await BWCert721Modified.ownerOf(2)).to.equal(accounts[1]);

      // Checking that safeTransferFrom fails without bitwave pre-approval.
      await truffleAssert.fails(BWCert721Modified.safeTransferFrom(accounts[1], accounts[2], 2, {from: accounts[1]}), 
      truffleAssert.ErrorType.REVERT,
      "Token transfers require Bitwave pre-approval.");

      // Checking that transferFrom fails without bitwave pre-approval.
      await truffleAssert.fails(BWCert721Modified.transferFrom(accounts[1], accounts[2], 2, {from: accounts[1]}), 
      truffleAssert.ErrorType.REVERT,
      "Token transfers require Bitwave pre-approval.");
    });

    it('should map owners properly', async () => {
      // Iterating through each NFT and ensuring ownership has been appropriately mapped.
      for (let i = 0; i < 10; i++) {
        const ownerOf = await BWCert721Modified.ownerOf(i+1);
        assert.equal(ownerOf, accounts[i]);
      }
    });

    it('should allow transfers when Bitwave Pre-Approval has been granted', async() => {

      // Granting pre-approval from the owner address
      await BWCert721Modified.bitwaveApprove(accounts[2], 2, {from: owner});
      expect(await BWCert721Modified.bitwaveApprovals(2)).to.equal(accounts[2]);

      // Transfer from accounts[1] to accounts[2] using accounts[1] as the sender.
      // tokenId here is 2
      await BWCert721Modified.safeTransferFrom(accounts[1], accounts[2], 2, {from: accounts[1]});
      expect(await BWCert721Modified.ownerOf(2)).to.equal(accounts[2]);

      // Expect bitwave approval to be revoked after transfer.
      expect(await BWCert721Modified.bitwaveApprovals(2)).to.equal('0x0000000000000000000000000000000000000000');
    });

    it('should return a tokenURI', async () => {
      const URI = await BWCert721Modified.tokenURI(1);
      expect(URI).to.equal("ipfs://QmXYLJ2xZ3E9oLXRxVkwSEWxog7gnRtFVttQ5aEFAL5P1N/1.json");
    });

  });

});

contract.skip("BWCert721A", accounts  => {
  let BWCert721A;
  const owner = accounts[0];

  before(async () => {
   BWCert721A = await BitwaveCert721A.deployed(); 
  });
  
  describe('mints 10 NFTs and maps owners properly', async () => {

    let mintingGasUsed = 0;
    it('should mint 10 NFTs', async () => {
      const receipt = await BWCert721A.mint(10, {from: owner});
      
      mintingGasUsed += parseInt(receipt.receipt.cumulativeGasUsed);
    });

    it('should transfer NFTs correctly', async() => {
      for(let i = 0; i < 10; i++) {
        const receipt = await BWCert721A.transferFrom(owner, accounts[i], i, {from: owner});
        mintingGasUsed += parseInt(receipt.receipt.cumulativeGasUsed);
      }
      console.log("721A Gas Used from mint and transfer: " + mintingGasUsed);
    });

    it('should not allow non-owners to mint', async() => {
      await truffleAssert.fails(BWCert721A.mint(1, {from: accounts[1]}), 
      truffleAssert.ErrorType.REVERT,
      "Ownable: caller is not the owner.");
    });

    it('should not allow non-owners to transfer', async() => {
      await truffleAssert.fails(BWCert721A.safeTransferFrom(accounts[1], owner, 1, {from: accounts[1]}), 
      truffleAssert.ErrorType.REVERT,
      "Ownable: caller is not the owner.");
      await truffleAssert.fails(BWCert721A.transferFrom(accounts[1], owner, 1, {from: accounts[1]}), 
      truffleAssert.ErrorType.REVERT,
      "Ownable: caller is not the owner.");
    });

    it('should map owners properly', async () => {
      for (let i = 0; i < 10; i++) {
        const ownerOf = await BWCert721A.ownerOf(i);
        assert.equal(ownerOf, accounts[i]);
      }
    });

    it('should return a tokenURI', async () => {
      const URI = await BWCert721A.tokenURI(1);
      expect(URI).to.equal("ipfs://QmXYLJ2xZ3E9oLXRxVkwSEWxog7gnRtFVttQ5aEFAL5P1N/1.json");
    });
  

  });

});

contract.skip("BWCert721", accounts  => {
  let BWCert721;
  const owner = accounts[0];

  before(async () => {
   BWCert721 = await BitwaveCert721.deployed();
  });
  
  describe('mints 10 NFTs and maps owners properly', async () => {
    it('should mint 10 NFTs', async () => {
      let cumulativeGasUsed = 0;
      for (let i = 0; i < 10; i++) {
        
        const receipt = await BWCert721.mint(accounts[i], {from: owner});
        
        cumulativeGasUsed += parseInt(receipt.receipt.cumulativeGasUsed);
      }
      
      console.log("ERC721 gas used for minting to final holders: " + cumulativeGasUsed);
    });

    it('should not allow owners to transfer without bitwave pre-approval', async() => {
      expect(await BWCert721.ownerOf(2)).to.equal(accounts[1]);
      await truffleAssert.fails(BWCert721.safeTransferFrom(accounts[1], accounts[2], 2, {from: accounts[1]}), 
      truffleAssert.ErrorType.REVERT,
      "Token transfers require Bitwave pre-approval.");

      await truffleAssert.fails(BWCert721.transferFrom(accounts[1], accounts[2], 2, {from: accounts[1]}), 
      truffleAssert.ErrorType.REVERT,
      "Token transfers require Bitwave pre-approval.");
    });

    it('should map owners properly', async () => {
      for (let i = 0; i < 10; i++) {
        const ownerOf = await BWCert721.ownerOf(i+1);
        assert.equal(ownerOf, accounts[i]);
      }
    });

    it('should not allow non-owners to mint', async() => {
      await truffleAssert.fails(BWCert721.mint(owner, {from: accounts[1]}), 
      truffleAssert.ErrorType.REVERT,
      "Ownable: caller is not the owner.");
    });

    it('should return a tokenURI', async () => {
      const URI = await BWCert721.tokenURI(1);
      expect(URI).to.equal("ipfs://QmXYLJ2xZ3E9oLXRxVkwSEWxog7gnRtFVttQ5aEFAL5P1N/1.json");
    });

  });

});