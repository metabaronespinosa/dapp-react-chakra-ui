// SPDX-License-Identifier: MIT
pragma solidity >=0.5.1 <0.9.0;

contract Token {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfert( address indexed _from, address indexed _to, uint _value );
    event Approval( address indexed _from, address indexed _to, uint _value );

    constructor(uint256 totalSupply) public {
      balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint _value) public returns (bool success){
        return this.transferFrom(msg.sender, _to, _value, false);
    }

    function transferFrom(address _from, address _to, uint _value, bool withAllowance) public returns (bool success){
        // Control
        require(balanceOf[_from] >= _value);

        if(withAllowance){
            require(allowance[_from][msg.sender] >= _value);
            allowance[_from][msg.sender] -= _value;
        }
        
        // Transfer Balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        
        // Event
        emit Transfert(_from, _to, _value);
        
        return true;
    }

    function approve(address spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][spender] = _value;
        emit Approval(msg.sender, spender, _value);
        return true;
    }
}