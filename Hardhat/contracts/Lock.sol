pragma solidity ^0.8.0;

//spdx-License-Identifier: MIT;

contract Marketplace {

    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function transferOwnership(address payable newOwner) public onlyOwner {
        require(msg.sender == owner, "Only the owner can transfer ownership.");
        owner = newOwner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }
}