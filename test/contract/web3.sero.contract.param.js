var Web3 = require("../../lib/web3");
var coder =require('../../lib/solidity/coder')
// var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
//
// var ads = ["64t1MPxFp4yzxNJ64zp1NmrTXWsrLuw9DMiMZeujbD2HVAKhjR3zpKnuFVjjAXAp86G2PzSVSsdiMdwp5JPoqxtP","48rGJTGEeQKiFcCi82rbZdvZeyhoJHnVqeDrV627nT4vKTUtYUKJGYmt4dMnRX94RDAtXJV4SEXKyFPH9TdhFxiB"] ;
// var coinContract = web3.sero.contract([{"constant":true,"inputs":[],"name":"minter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ads","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"send","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"ads","type":"address[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Sent","type":"event"}]);
// var coin = coinContract.new(
//     ads,
//     {
//         from: web3.sero.accounts[0],
//         data: '0x608060405234801561001057600080fd5b5060405161058b38038061058b83398101806040528101908080518201929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080905050610505806100866000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063075461721461007257806311a7a4c0146100c957806327e235e31461013657806340c10f191461018d578063d0679d34146101da575b600080fd5b34801561007e57600080fd5b50610087610227565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100d557600080fd5b506100f46004803603810190808035906020019092919050505061024c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561014257600080fd5b50610177600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061028a565b6040518082815260200191505060405180910390f35b34801561019957600080fd5b506101d8600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506102a2565b005b3480156101e657600080fd5b50610225600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061034f565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018181548110151561025b57fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60026020528060005260406000206000915090505481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102fd5761034b565b80600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b5050565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101561039b576104d5565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555080600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055507f3990db2d31862302a685e8086b5755072a6e2b5b780af1ee81ece35ee3cd3345338383604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a15b50505600a165627a7a72305820d9f3ffcad3ce8fe5f23c21bf30c005eb148295c80a13ec93aa2c2733e79a78d90029',
//         gas: '4700000'
//     }, function (e, contract){
//         console.log(e, contract);
//         if (typeof contract.address !== 'undefined') {
//             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
//         }
//     })

abi =[ {
    "inputs": [{
        "name": "ads",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}]

args =["64t1MPxFp4yzxNJ64zp1NmrTXWsrLuw9DMiMZeujbD2HVAKhjR3zpKnuFVjjAXAp86G2PzSVSsdiMdwp5JPoqxtP"]


var encodeConstructorPrefix = function (abi, params) {
    console.log(abi.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }));

    return abi.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
        return coder.addressPrefix(types, params);
    })[0] || '';
};

console.log(encodeConstructorPrefix(abi,args))
