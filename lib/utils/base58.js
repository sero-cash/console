/**
 * @file base58.js
 * @date 2018
 */

var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var ALPHABET_MAP = {}
for (var i = 0; i < ALPHABET.length; i++) {
    ALPHABET_MAP[ALPHABET.charAt(i)] = i
}
var BASE = 58


/**
 * Convert a byte array to a base58 string
 *
 * @method bytesToBase58
 * @param {Array} bytes
 * @return {String} the base58 string
 */
function encode(buffer) {
    if (buffer.length === 0) return ''

    var i, j, digits = [0]
    for (i = 0; i < buffer.length; i++) {
        for (j = 0; j < digits.length; j++) digits[j] <<= 8

        digits[0] += buffer[i]

        var carry = 0
        for (j = 0; j < digits.length; ++j) {
            digits[j] += carry

            carry = (digits[j] / BASE) | 0
            digits[j] %= BASE
        }

        while (carry) {
            digits.push(carry % BASE)

            carry = (carry / BASE) | 0
        }
    }

    // deal with leading zeros
    for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0)

    return digits.reverse().map(function (digit) {
        return ALPHABET[digit]
    }).join('')
}

/**
 * Convert a base58 string to a byte array
 *
 * @method decode
 * @param {string} base58
 * @return {Array} the byte array
 */
function decode(string) {
    if (string.length === 0) return []

    var i, j, bytes = [0]
    for (i = 0; i < string.length; i++) {
        var c = string[i]
        if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character')

        for (j = 0; j < bytes.length; j++) bytes[j] *= BASE
        bytes[0] += ALPHABET_MAP[c]

        var carry = 0
        for (j = 0; j < bytes.length; ++j) {
            bytes[j] += carry

            carry = bytes[j] >> 8
            bytes[j] &= 0xff
        }

        while (carry) {
            bytes.push(carry & 0xff)

            carry >>= 8
        }
    }

    // deal with leading zeros
    for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0)

    return bytes.reverse()
}

module.exports = {
    decode: decode,
    encode: encode,
};
