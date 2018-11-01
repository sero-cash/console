pragma solidity ^0.4.16;

contract owned {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner public {
        owner = newOwner;
    }
}

contract anonymity {

    bytes32 private topic_issueToken     =  0x25d7b0676eb16f8e7d1160b577510f33f54887867efcbc6ec3c712354706b6b0;
    bytes32 private topic_selfBalance    =  0x5c8c6e4c5998a1ee83ab3aa45fa23ca7c8ed4a75c654632eb22adcc5e1e6fb37;
    bytes32 private topic_sendAnonymous  =  0x2da7d636de04e3fdf864ae424b77b7c8ca8561cafd21f3317d8e131b96a22b02;

    function issueToken(uint256 total,string memory coinName) internal returns (bool success){
        uint len = bytes(coinName).length;
        assembly {

            let start :=add(coinName, 0x20)
            let dataLen := mul(0x20, add(div(len,0x20), 1))
            mstore(add(start, dataLen), len)
            dataLen := add(dataLen, 0x20)
            mstore(add(start, dataLen), total)
            log1(start, add(dataLen, 0x20), sload(topic_issueToken_slot))
            success := mload(add(start, dataLen))
        }

        return;
    }

    function selfBalance(string memory currency) internal returns (uint256 amount){
        uint len = bytes(currency).length;
        assembly {
            let start :=add(currency, 0x20)
            let dataLen := mul(0x20, add(div(len,0x20), 1))
            mstore(add(start, dataLen), len)
            log1(start, add(dataLen, 0x20), sload(topic_selfBalance_slot))
            amount := mload(add(start, dataLen))
        }
        return;
    }

    function sendAnonymous(address to, string memory currency, uint256 amount) internal returns (bool success){
        if(selfBalance(currency) < amount) {
            return false;
        }
        uint len = bytes(currency).length;
        assembly {
            let start :=add(currency, 0x20)
            let dataLen := mul(0x20, add(div(len,0x20), 1))
            mstore(add(start, dataLen), len)
            dataLen :=add(dataLen, 0x20)
            mstore(add(start, dataLen), to)
            dataLen :=add(dataLen, 0x20)
            mstore(add(start, dataLen), amount)
            log1(start, add(dataLen, 0x20), sload(topic_sendAnonymous_slot))
            success := mload(add(start, dataLen))
        }
        return;
    }
}

contract seroToken is anonymity ,owned {
    // Public variables of the token
    string public name;
    string public currency;
    uint8 public decimals = 2;
    // 9 decimals is the strongly suggested default, avoid changing it
    uint256 public totalSupply;
    //Contract account balance
    uint256 public balance;

    mapping (address => mapping (address => uint256)) public allowance;

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);

    // This generates a public event on the blockchain that will notify clients
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    // This notifies clients about the amount burnt
    event Burn(address indexed from, uint256 value);

    /**
     * Constrctor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    constructor(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    ) public {

        if(issueToken(totalSupply,currency)){
            totalSupply = initialSupply * 10 ** uint256(decimals);  // Update total supply with the decimal amount                                      // Give the creator all initial tokens
            name = tokenName;                                       // Set the name for display purposes
            currency = tokenSymbol;                               // Set the currency for display purposes
            balance = totalSupply;
        }
    }

    /**
     * the contract current left balance
     */
    function balanceOf() public returns (uint256 amount) {
        return selfBalance(currency);
    }

    /**
     * additional issue
     */
    function addIssue(uint256 total) public onlyOwner {

        if(issueToken(total,currency)){
            balance = balance+total;
        }
        return ;
    }

    /**
     * Transfer tokens
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer(address _to, uint256 _value) public onlyOwner returns (bool success) {
        return sendAnonymous(_to,currency,_value);
    }

    /**
     * Transfer tokens from other address
     *
     * Send `_value` tokens to `_to` in behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= allowance[_from][msg.sender]);     // Check allowance
        allowance[_from][msg.sender] -= _value;
        return sendAnonymous(_to,currency,_value);
    }

    /**
     * Set allowance for other address
     *
     * Allows `_spender` to spend no more than `_value` tokens in your behalf
     *
     * @param _spender The address authorized to spend
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value) public onlyOwner
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

}