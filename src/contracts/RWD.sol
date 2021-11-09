// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "./Token.sol";

contract RWD is Token{
    string public name = "Reward Token";
    string public symbol = "RWD";
    uint256 public totalSupply = 100000000000000000000;
    uint public decimals = 18;

   constructor() Token(totalSupply) public {}
}