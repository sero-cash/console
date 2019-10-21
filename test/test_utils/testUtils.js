var utils = require("../../lib/utils/utils")
var Cryptiles = require('cryptiles');

var formatters = require('../../lib/web3/formatters');

var testAddress = function(address){
    console.log( utils.isStrictAddress(address))
}

var testPkr = function (PKr){
    console.log( utils.isPKr(PKr))
}

// testPkr('24QHAZTUUatgrigY3wz5eJpomr2abvrevaAmFZEP1UNMJZDHhYPEhu8pkEbC7yEfAwGX3jtfLZFyXfXRoqiqE3ybt3RPgorPTnzCkVZf6nZ98STjkAMXpfV37GZnhaBUUi2n');

// var rand =utils.bytesToHex(Cryptiles.randomBits(128));

// console.log(rand)

// formatters.inputHexAddressFormatter("GwA94QDTyQ86cE5jcuYCyrQ9Bu9FRcXfq4dxQhryTDzhkahUjYSHcjZ5yFF9bvaZPRMUwR8k5uW4bT3DvPf77a5")


