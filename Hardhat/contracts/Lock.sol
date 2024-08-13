// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    // Define variables for tracking products and their ownership
    mapping(uint256 => address) public productOwners;
    mapping(uint256 => string) public productNames;

    // Constructor function
    constructor() {
        // Initialize the productOwners mapping with the address of the contract deployer as the owner of all products.
        for (uint256 i = 0; i < 100; i++) {
            productOwners[i] = msg.sender;
        }
    }

    // Function to set the name of a product
    function setProductName(uint256 _productId, string memory _productName) public {
        require(productOwners[_productId] == msg.sender, "Only the owner can set the product name");
        productNames[_productId] = _productName;
    }

    // Function to transfer ownership of a product
    function transferOwnership(uint256 _productId, address _newOwner) public {
        // Check if the caller is the current owner of the product
        require(productOwners[_productId] == msg.sender, "Only the current owner can transfer ownership");
        require(_newOwner != address(0), "New owner cannot be the zero address");

        // Update the productOwners mapping with the new owner's address
        productOwners[_productId] = _newOwner;
    }
}
