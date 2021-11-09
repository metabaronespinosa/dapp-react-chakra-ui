// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
import "./Token.sol";

contract Tether is Token{
    string public name = "Tether";
    string public symbol = "USDT";
    uint256 public totalSupply = 100000000000000000000;
    uint public decimals = 18;

   constructor() Token(totalSupply) public {}
}