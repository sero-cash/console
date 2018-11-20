var utils = require("../../lib/utils/utils")
var Cryptiles = require('cryptiles');

var testAddress = function(address){
    console.log( utils.isStrictAddress(address))
}

testAddress('5BkUvZ9ifZBhGnJ0dmSKfs7jn1h3EJzCHVjZWbLQgdTJ1i2363CcbShy2SHHKWNqHWjKuX19XmjMg9vJLQ7mLQWWmN');

var rand =utils.bytesToHex(Cryptiles.randomBits(128));

console.log(rand)