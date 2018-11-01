var Web3 = require("../../lib/web3");
var provider = "http://127.0.0.1:8545"

var web3 = new Web3(new Web3.providers.HttpProvider(provider));
var balance = web3.sero.getBalance(web3.sero.accounts[0]);
console.log(balance)