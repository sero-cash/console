
var utils = require('../../lib/utils/utils')
var value = 1000000000;


console.log(utils.toBigNumber(value).toString(10));

console.log(utils.fromTa(value));