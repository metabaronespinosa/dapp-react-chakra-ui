// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

/// @title A title that should describe the contract/interface
/// @author AntoLC
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details

contract Migrations {
    address public owner;
    uint public last_completed_migration;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if (msg.sender == owner) _;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}
