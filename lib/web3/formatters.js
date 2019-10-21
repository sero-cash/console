/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file formatters.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

'use strict';


var utils = require('../utils/utils');
var config = require('../utils/config');
var Iban = require('./iban');
var util = require('util');


/**
 * Should the format output to a big number
 *
 * @method outputBigNumberFormatter
 * @param {String|Number|BigNumber}
 * @returns {BigNumber} object
 */
var outputBigNumberFormatter = function (number) {
    return utils.toBigNumber(number);
};

var isPredefinedBlockNumber = function (blockNumber) {
    return blockNumber === 'latest' || blockNumber === 'pending' || blockNumber === 'earliest';
};

var inputDefaultBlockNumberFormatter = function (blockNumber) {
    if (blockNumber === undefined) {
        return config.defaultBlock;
    }
    return inputBlockNumberFormatter(blockNumber);
};


var inputBlockNumberFormatter = function (blockNumber) {
    if (blockNumber === undefined) {
        return undefined;
    } else if (isPredefinedBlockNumber(blockNumber)) {
        return blockNumber;
    }
    return utils.toHex(blockNumber);
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputCallFormatter
 * @param {Object} transaction options
 * @returns object
*/
var inputCallFormatter = function (options){

    options.from = options.from || config.defaultAccount;

    if (options.from) {
        options.from = inputParamAddressFormatter(options.from);
    }

    if (options.to) { // it might be contract creation
        options.to = inputParamAddressFormatter(options.to);
    }

    ['gasPrice', 'gas', 'value', 'nonce'].filter(function (key) {
        return options[key] !== undefined;
    }).forEach(function(key){
        options[key] = utils.fromDecimal(options[key]);
    });

    return options;
};

/**
 * Formats the input of a transaction and converts all values to HEX
 *
 * @method inputTransactionFormatter
 * @param {Object} transaction options
 * @returns object
*/
var inputTransactionFormatter = function (options){

    options.from = options.from || config.defaultAccount;
    options.from = inputAddressFormatter(options.from);

    if (options.to) { // it might be contract creation
        options.to=inputParamAddressFormatter(options.to)
    }

    ['gasPrice', 'gas', 'value', 'nonce'].filter(function (key) {
        return options[key] !== undefined;
    }).forEach(function(key){
        options[key] = utils.fromDecimal(options[key]);
    });

    return options;
};

var inputRegistPoolFormatter = function (options){

    options.from = options.from || config.defaultAccount;
    options.from = inputAddressFormatter(options.from);

    if (options.to) { // it might be contract creation
        options.to=inputParamAddressFormatter(options.to)
    }

    ['gasPrice', 'gas', 'value', 'fee'].filter(function (key) {
        return options[key] !== undefined;
    }).forEach(function(key){
        options[key] = utils.fromDecimal(options[key]);
    });

    return options;
};


/**
 * Formats the output of a transaction to its proper values
 *
 * @method outputTransactionFormatter
 * @param {Object} tx
 * @returns {Object}
*/
var outputTransactionFormatter = function (tx){
    return tx;
    if(tx.blockNumber !== null)
        tx.blockNumber = utils.toDecimal(tx.blockNumber);
    if(tx.transactionIndex !== null)
        tx.transactionIndex = utils.toDecimal(tx.transactionIndex);
    tx.nonce = utils.toDecimal(tx.nonce);
    tx.gas = utils.toDecimal(tx.gas);
    tx.gasPrice = utils.toBigNumber(tx.gasPrice);
    tx.value = utils.toBigNumber(tx.value);
    if (tx.stx.Desc_O){
        tx.stx.Desc_O_Ins=tx.stx.Desc_O.Ins;
        var O_Outs=[];
        if (tx.stx.Desc_O.Outs){
            tx.stx.Desc_O.Outs.forEach(function(out){
                var out_O ={};
                if (utils.toBigNumber(out.Addr)!=0) {
                    out_O.Addr = out.Addr;
                }
                if (out.Asset.Tkn){
                    out_O.Currency = utils.bytesToString(utils.hexToBytes(utils.fromDecimal(utils.toBigNumber(out.Asset.Tkn.Currency))));
                    out_O.Value = utils.toBigNumber(out.Asset.Tkn.Value);
                }
                if (out.Asset.Tkt){
                    out_O.Category = utils.bytesToString(utils.hexToBytes(utils.fromDecimal(utils.toBigNumber(out.Asset.Tkt.Category))));
                    out_O.TktId = out.Asset.Tkt.Value;
                }
                out_O.Memo = out.Memo;
                O_Outs.push(out_O);
            });
        }
        tx.stx.Desc_O_Outs = O_Outs;
        delete  tx.stx.Desc_O;
    }
    if (tx.stx.Desc_Z){
        tx.stx.Desc_Z_Ins=tx.stx.Desc_Z.Ins;
        tx.stx.Desc_Z_Outs = tx.stx.Desc_Z.Outs;
        delete  tx.stx.Desc_Z;
    }
    return tx;
};

/**
 * Formats the output of a transaction receipt to its proper values
 *
 * @method outputTransactionReceiptFormatter
 * @param {Object} receipt
 * @returns {Object}
*/
var outputTransactionReceiptFormatter = function (receipt){
    if(receipt.blockNumber !== null)
        receipt.blockNumber = utils.toDecimal(receipt.blockNumber);
    if(receipt.transactionIndex !== null)
        receipt.transactionIndex = utils.toDecimal(receipt.transactionIndex);
    receipt.cumulativeGasUsed = utils.toDecimal(receipt.cumulativeGasUsed);
    receipt.gasUsed = utils.toDecimal(receipt.gasUsed);

    if(utils.isArray(receipt.logs)) {
        receipt.logs = receipt.logs.map(function(log){
            return outputLogFormatter(log);
        });
    }

    return receipt;
};

/**
 * Formats the output of a block to its proper values
 *
 * @method outputBlockFormatter
 * @param {Object} block
 * @returns {Object}
*/
var outputBlockFormatter = function(block) {

    // transform to number
    block.gasLimit = utils.toDecimal(block.gasLimit);
    block.gasUsed = utils.toDecimal(block.gasUsed);
    block.size = utils.toDecimal(block.size);
    block.timestamp = utils.toDecimal(block.timestamp);
    if(block.number !== null)
        block.number = utils.toDecimal(block.number);

    block.difficulty = utils.toBigNumber(block.difficulty);
    block.totalDifficulty = utils.toBigNumber(block.totalDifficulty);

    if (utils.isArray(block.transactions)) {
        block.transactions.forEach(function(item){
            if(!utils.isString(item))
                return outputTransactionFormatter(item);
        });
    }

    return block;
};

/**
 * Formats the output of a log
 *
 * @method outputLogFormatter
 * @param {Object} log object
 * @returns {Object} log
*/
var outputLogFormatter = function(log) {
    if(log.blockNumber)
        log.blockNumber = utils.toDecimal(log.blockNumber);
    if(log.transactionIndex)
        log.transactionIndex = utils.toDecimal(log.transactionIndex);
    if(log.logIndex)
        log.logIndex = utils.toDecimal(log.logIndex);

    return log;
};

/**
 * Formats the input of a whisper post and converts all values to HEX
 *
 * @method inputPostFormatter
 * @param {Object} transaction object
 * @returns {Object}
*/
var inputPostFormatter = function(post) {

    // post.payload = utils.toHex(post.payload);
    post.ttl = utils.fromDecimal(post.ttl);
    post.workToProve = utils.fromDecimal(post.workToProve);
    post.priority = utils.fromDecimal(post.priority);

    // fallback
    if (!utils.isArray(post.topics)) {
        post.topics = post.topics ? [post.topics] : [];
    }

    // format the following options
    post.topics = post.topics.map(function(topic){
        // convert only if not hex
        return (topic.indexOf('0x') === 0) ? topic : utils.fromUtf8(topic);
    });

    return post;
};

/**
 * Formats the output of a received post message
 *
 * @method outputPostFormatter
 * @param {Object}
 * @returns {Object}
 */
var outputPostFormatter = function(post){

    post.expiry = utils.toDecimal(post.expiry);
    post.sent = utils.toDecimal(post.sent);
    post.ttl = utils.toDecimal(post.ttl);
    post.workProved = utils.toDecimal(post.workProved);
    // post.payloadRaw = post.payload;
    // post.payload = utils.toAscii(post.payload);

    // if (utils.isJson(post.payload)) {
    //     post.payload = JSON.parse(post.payload);
    // }

    // format the following options
    if (!post.topics) {
        post.topics = [];
    }
    post.topics = post.topics.map(function(topic){
        return utils.toAscii(topic);
    });

    return post;
};

var inputAddressFormatter = function (address) {
    var iban = new Iban(address);
    if (iban.isValid() && iban.isDirect()) {
        return '0x' + iban.address();
    } else if (utils.isStrictAddress(address)) {
        return address;
    }
    throw new Error('invalid address');
};


var inputParamAddressFormatter = function (address) {
    if (utils.paramAddress(address)) {
        return address
    }
    throw new Error('invalid address');
};


var outputSyncingFormatter = function(result) {
    if (!result) {
        return result;
    }

    result.startingBlock = utils.toDecimal(result.startingBlock);
    result.currentBlock = utils.toDecimal(result.currentBlock);
    result.highestBlock = utils.toDecimal(result.highestBlock);
    if (result.knownStates) {
        result.knownStates = utils.toDecimal(result.knownStates);
        result.pulledStates = utils.toDecimal(result.pulledStates);
    }

    return result;
};

var outputBalanceFormatter = function(result) {
    if (!result) {
        return ;
    }
    if (result.hasOwnProperty("tkn")){
        if (result["tkn"]) {
            for (var key in result["tkn"]){
                result['tkn'][key] = utils.toBigNumber(result['tkn'][key]);
            }
        }else {
            delete result.tkn
        }
    }
    if (result.hasOwnProperty('tkt')){
        if (!result['tkt']){
            delete result.tkt
        }
    }
   return result;
};



var outputStakeShareFormatter = function(result) {
    if (!result) {
        return ;
    }
    if(result instanceof Array){
        ['missed', 'num', 'total', 'status',"remaining",'expired','fee','at','timestamp','lastPayTime','returnNum'].forEach(function(key){
            result.forEach(function(s){
                if (s.hasOwnProperty(key)){
                    s[key] = utils.toDecimal(s[key]);
                }
            });
        });
        ['profit','price','returnProfit'].forEach(function(key){
            result.forEach(function(s){
                if (s.hasOwnProperty(key)){
                    s[key] = utils.toBigNumber(s[key]);
                }
            });
        });
    }else{
        ['missed', 'num', 'total', 'status',"remaining",'expired','fee','at','timestamp','lastPayTime','returnNum'].forEach(function(key){
            if (result.hasOwnProperty(key)){
                result[key] = utils.toDecimal(result[key]);
            }
        });
        ['profit','price','returnProfit'].forEach(function(key){
            if (result.hasOwnProperty(key)){
                result[key] = utils.toBigNumber(result[key]);
            };
        });
    }
    return result;
};



var outputStakePoolFormatter = function(result) {
    if (!result) {
        return ;
    }

    if(result instanceof Array){
        ['choicedNum', 'createAt', 'expireNum', 'fee','missedNum','shareNum','lastPayTime','wishVoteNum','timestamp'].forEach(function(key){
            result.forEach(function(s){
                if (s.hasOwnProperty(key)){
                    s[key] = utils.toDecimal(s[key]);
                }
            });
        });
        ['profit'].forEach(function(key){
            result.forEach(function(s){
                if (s.hasOwnProperty(key)){
                    s[key] = utils.toBigNumber(s[key]);
                }
            });

        });
    }else{
        ['choicedNum', 'createAt', 'expireNum', 'fee','missedNum','shareNum','lastPayTime','wishVoteNum','timestamp'].forEach(function(key){
            if (result.hasOwnProperty(key)){
                result[key] = utils.toDecimal(result[key]);
            }
        });
        ['profit'].forEach(function(key){
            if (result.hasOwnProperty(key)){
                result[key] = utils.toBigNumber(result[key]);
            }
        });
    }

    return result;
};


var outputStakeInfoFormatter = function(result) {
    if (!result) {
        return ;
    }

    if (!result.pools && !result.shares){
        return ;
    }

    if (result.pools){
        ['choicedNum', 'createAt', 'expireNum', 'fee','missedNum','shareNum','lastPayTime','wishVoteNum','timestamp','blockNumber'].forEach(function(key){
            result.pools.forEach(function(s){
                if (s.hasOwnProperty(key)){
                    s[key] = utils.toDecimal(s[key]);
                }
            });
        });
        ['profit'].forEach(function(key){
            result.pools.forEach(function(s){
                if (s.hasOwnProperty(key)){
                    s[key] = utils.toBigNumber(s[key]);
                }
            });

        });
    }
    if (result.shares){
        ['missed', 'num', 'total', 'status',"remaining",'expired','fee','at','timestamp','lastPayTime','returnNum','blockNumber'].forEach(function(key){
            result.shares.forEach(function(s){
                if (s.hasOwnProperty(key)){
                    s[key] = utils.toDecimal(s[key]);
                }
            });
        });
        ['profit','price'].forEach(function(key){
            result.shares.forEach(function(s){
                if (s.hasOwnProperty(key)){
                    s[key] = utils.toBigNumber(s[key]);
                }
            });

        });
    }


    return result;
};


module.exports = {
    inputDefaultBlockNumberFormatter: inputDefaultBlockNumberFormatter,
    inputBlockNumberFormatter: inputBlockNumberFormatter,
    inputCallFormatter: inputCallFormatter,
    inputTransactionFormatter: inputTransactionFormatter,
    inputRegistPoolFormatter:inputRegistPoolFormatter,
    inputParamAddressFormatter:inputParamAddressFormatter,
    inputAddressFormatter: inputAddressFormatter,
    inputPostFormatter: inputPostFormatter,
    outputBigNumberFormatter: outputBigNumberFormatter,
    outputTransactionFormatter: outputTransactionFormatter,
    outputTransactionReceiptFormatter: outputTransactionReceiptFormatter,
    outputBlockFormatter: outputBlockFormatter,
    outputLogFormatter: outputLogFormatter,
    outputPostFormatter: outputPostFormatter,
    outputSyncingFormatter: outputSyncingFormatter,
    outputBalanceFormatter:outputBalanceFormatter,
    outputStakeShareFormatter:outputStakeShareFormatter,
    outputStakePoolFormatter:outputStakePoolFormatter,
    outputStakeInfoFormatter:outputStakeInfoFormatter
};

