
var utils = require('../../lib/utils/utils')
var BigNumber = require('bignumber.js');

// var value = 1000000000;
//
//
// console.log(utils.toBigNumber(value).toString(10));
//
// console.log(utils.fromTa(value));
//
// console.log(utils.hexToBytes(utils.fromDecimal(2)))



var seed = function(s) {
    var m_w  = s;
    var m_z  = 987654321;
    var mask = 0xffffffff;

    return function() {
        m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

        var result = ((m_z << 16) + m_w) & mask;
        result /= 4294967296;

        return result + 0.5;
    }
}


var random = function (s) {
    var r = (Math.random()).toString(16).substr(2)+utils.fromDecimal(new Date().getTime()).substr(2)
    while (r.length<(s*2)){
        r +=Math.random().toString(16).substr(2);
    }
    return r.substr(0,s*2);
}


console.log(random(16))


var f = utils.paramAddress('SP1.GwA94QDTyQ86cE5jcuYCyrQ9Bu9FRcXfq4dxQhryTDzgFgu62LJQ8f73ApEz4Zwm4zFfDAwUB22sEmQQ1AguYYt.SR');
console.log(f)