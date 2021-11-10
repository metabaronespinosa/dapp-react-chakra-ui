// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;

    Tether public tether;
    RWD public rwd;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => uint) public rewardsBalance;
    mapping(address => bool) public hasStacked;
    mapping(address => bool) public isStacked;

    constructor(RWD _rwd, Tether _tether) public {
        owner = msg.sender;
        rwd = _rwd;
        tether = _tether;
    }

    function depositToken(uint amount) public {
        require(amount > 0, "Amount to deposite must be > 0");

        address staker = msg.sender;

        bool transfertOK = tether.transferFrom(staker, address(this), amount, true);

        if (transfertOK) {
            stakingBalance[staker] += amount;

            // If not already in the list
            if(!hasStacked[staker]) {
                stakers.push(staker);

                rewardsBalance[staker] = 0;
            }

            hasStacked[staker] = true;
            isStacked[staker] = true;
        }
    }

    function staking() public {
        require(msg.sender == owner, 'Caller must be the owner');

        for (uint256 index = 0; index < stakers.length; index++) {
            address staker = stakers[index];
            uint balance = stakingBalance[staker] / 20;

            if (balance > 0) {
                rewardsBalance[staker] += balance;
            }
        }
    }

    // DEPRECATED
    function issueTokens() public {
        require(msg.sender == owner, 'Caller must be the owner');

        for (uint256 index = 0; index < stakers.length; index++) {
            address staker = stakers[index];
            uint balance = stakingBalance[staker] / 9;

            if(balance > 0)
                rwd.transfer(staker, balance);
        }
    }

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];

        require(balance > 0, 'Balance must be > 0');

        tether.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;
        isStacked[msg.sender] = false;
    }

    function claimRewards() public {
        uint balance = rewardsBalance[msg.sender];

        require(balance > 0, 'Balance must be > 0');

        rwd.transfer(msg.sender, balance);

        rewardsBalance[msg.sender] = 0;
    }
}
