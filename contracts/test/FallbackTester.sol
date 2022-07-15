// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


/// @title A contract with a fallback function and little else to test
/// @title NFT vault compatability.
/// @author Bitwave
/// @author Inish Crisson
/// @notice Not for mainnet deployment.
contract FallbackTester {

    event fallbackTestEmission(string);
    uint uintGasBurner;
    address factoryAddress;

/// @notice A fallback function that burns some gas.
    fallback() external payable { 
        emit fallbackTestEmission("Fallback Called");
        // burn some gas to mimick proxy contract.
        for (uint8 i = 0; i < 20; i++){uintGasBurner = i;}
    }

}