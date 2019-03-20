var utils = require("../../lib/utils/utils")
var Cryptiles = require('cryptiles');

var testAddress = function(address){
    console.log( utils.isStrictAddress(address))
}

var testPkr = function (PKr){
    console.log( utils.isPKr(PKr))
}

testPkr('24QHAZTUUatgrigY3wz5eJpomr2abvrevaAmFZEP1UNMJZDHhYPEhu8pkEbC7yEfAwGX3jtfLZFyXfXRoqiqE3ybt3RPgorPTnzCkVZf6nZ98STjkAMXpfV37GZnhaBUUi2n');

// var rand =utils.bytesToHex(Cryptiles.randomBits(128));

// console.log(rand)