var Web3 = require("../../lib/web3");
var coder =require('../../lib/solidity/coder')
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))

// var ads = ["2CFqPaTDoZkwpTi2jeAetroxyHWr2oenHA14L5H98E8xpV8YrzXVmo3s34KPqPnPubVoyfSecWCBiqQn8kqZozjT","4Ejt5An51TkdbCXF7bw3McpJH71rc2WTLBLUFwji5XoLWMsv7q2LniTW5Hz8yP8CV8KEE1dEHvy8Dp9ceRdwMVai"] ;
// var coinContract = web3.sero.contract
// ([{"constant":true,"inputs":[],"name":"minter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ads","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"send","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"ads","type":"address[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ads","type":"address[]"}],"name":"AdsEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"ad","type":"address"}],"name":"test1","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Sent","type":"event"}]);
// var coin = coinContract.new(
//     ads,
//     {
//         from: web3.sero.accounts[0],
//         data: '0x608060405234801561001057600080fd5b506040516106e13803806106e183398101806040528101908080518201929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508090507f45ce68a2d18882838bb8e50a24489bd192e200389f5d15f23f98687736894993816040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156100db5780820151818401526020810190506100c0565b505050509050019250505060405180910390a17fa408b1f57b7de6e7d79172e6fb5192cd804349735d37803864195981634633ab81600081518110151561011e57fe5b90602001906020020151604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a150610568806101796000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063075461721461007257806311a7a4c0146100c957806327e235e31461013657806340c10f191461018d578063d0679d34146101da575b600080fd5b34801561007e57600080fd5b50610087610227565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100d557600080fd5b506100f46004803603810190808035906020019092919050505061024c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561014257600080fd5b50610177600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061028a565b6040518082815260200191505060405180910390f35b34801561019957600080fd5b506101d8600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506102a2565b005b3480156101e657600080fd5b50610225600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506103b2565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018181548110151561025b57fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60026020528060005260406000206000915090505481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102fd576103ae565b80600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055507fa408b1f57b7de6e7d79172e6fb5192cd804349735d37803864195981634633ab82604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b5050565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156103fe57610538565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555080600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055507f3990db2d31862302a685e8086b5755072a6e2b5b780af1ee81ece35ee3cd3345338383604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a15b50505600a165627a7a723058204d07f34c780b6ca6b10a7f91758c9df40a2c0c8c6959c4845c72d5471aaf30250029',
//         gas: '4700000'
//     }, function (e, contract){
//         console.log(e, contract);
//         if (typeof contract.address !== 'undefined') {
//             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
//         }
//     });
//Contract mined! address: 2NDrqjqmxySr2S4nNDF65EgGwkfF8ttTQjeC8nrQuijtk5fcdoWeyXAfvmphSnUsacQTkbdWmyUi3zqyKMZySzDe transactionHash: 0x3e123baab43fb29a118617f94d293c7005c61772fca52a2f20dcf3961fdac0a5
//
// var coin = coinContract.at("2NDrqjqmxySr2S4nNDF65EgGwkfF8ttTQjeC8nrQuijtk5fcdoWeyXAfvmphSnUsacQTkbdWmyUi3zqyKMZySzDe")
//
// coin.send.call("64t1MPxFp4yzxNJ64zp1NmrTXWsrLuw9DMiMZeujbD2HVAKhjR3zpKnuFVjjAXAp86G2PzSVSsdiMdwp5JPoqxtP",1,{from: web3.sero.accounts[0]})
//
// var  adsEvent = coin.AdsEvent({},{fromBlock:1,toBlock:147});
//
// console.log(adsEvent)
//
// adsEvent.watch(function(error, result) {
//     if (!error)
//     {
//        console.log(result)
//     } else {
//         console.log(error);
//     }
// });


var jsonInterface =[{
    "constant": true,
    "inputs": [],
    "name": "minter",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "uint256"
    }],
    "name": "ads",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{
        "name": "",
        "type": "address"
    }],
    "name": "balances",
    "outputs": [{
        "name": "",
        "type": "uint256"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "receiver",
        "type": "address"
    }, {
        "name": "amount",
        "type": "uint256"
    }],
    "name": "mint",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "receiver",
        "type": "address"
    }, {
        "name": "amount",
        "type": "uint256"
    }],
    "name": "send",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "inputs": [{
        "name": "ads",
        "type": "address[]"
    }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "ads",
        "type": "address[]"
    }],
    "name": "AdsEvent",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "ad",
        "type": "address"
    }],
    "name": "test1",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{
        "indexed": false,
        "name": "from",
        "type": "address"
    }, {
        "indexed": false,
        "name": "to",
        "type": "address"
    }, {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
    }],
    "name": "Sent",
    "type": "event"
}];


var ads = ["2CFqPaTDoZkwpTi2jeAetroxyHWr2oenHA14L5H98E8xpV8YrzXVmo3s34KPqPnPubVoyfSecWCBiqQn8kqZozjT","4Ejt5An51TkdbCXF7bw3McpJH71rc2WTLBLUFwji5XoLWMsv7q2LniTW5Hz8yP8CV8KEE1dEHvy8Dp9ceRdwMVai"] ;


var  constructorInputs = []
constructorInputs.push(ads);
constructorInputs.push({
    data: "0x608060405234801561001057600080fd5b506040516106e13803806106e183398101806040528101908080518201929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508090507f45ce68a2d18882838bb8e50a24489bd192e200389f5d15f23f98687736894993816040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156100db5780820151818401526020810190506100c0565b505050509050019250505060405180910390a17fa408b1f57b7de6e7d79172e6fb5192cd804349735d37803864195981634633ab81600081518110151561011e57fe5b90602001906020020151604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a150610568806101796000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063075461721461007257806311a7a4c0146100c957806327e235e31461013657806340c10f191461018d578063d0679d34146101da575b600080fd5b34801561007e57600080fd5b50610087610227565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156100d557600080fd5b506100f46004803603810190808035906020019092919050505061024c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561014257600080fd5b50610177600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061028a565b6040518082815260200191505060405180910390f35b34801561019957600080fd5b506101d8600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506102a2565b005b3480156101e657600080fd5b50610225600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506103b2565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018181548110151561025b57fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60026020528060005260406000206000915090505481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102fd576103ae565b80600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055507fa408b1f57b7de6e7d79172e6fb5192cd804349735d37803864195981634633ab82604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b5050565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156103fe57610538565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555080600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055507f3990db2d31862302a685e8086b5755072a6e2b5b780af1ee81ece35ee3cd3345338383604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001935050505060405180910390a15b50505600a165627a7a723058204d07f34c780b6ca6b10a7f91758c9df40a2c0c8c6959c4845c72d5471aaf30250029"
});

var cb = function(result){
 console.log(result);
};
constructorInputs.push(cb)

var result = web3.sero.contract(jsonInterface).new.getData.apply(null, constructorInputs);


console.log("after",result);