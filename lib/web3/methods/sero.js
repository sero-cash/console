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
 * @file sero.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

"use strict";

var formatters = require('../formatters');
var utils = require('../../utils/utils');
var Method = require('../method');
var Property = require('../property');
var c = require('../../utils/config');
var Contract = require('../contract');
var watches = require('./watches');
var Filter = require('../filter');
var IsSyncing = require('../syncing');
var namereg = require('../namereg');
var Iban = require('../iban');
var transfer = require('../transfer');

var blockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? "sero_getBlockByHash" : "sero_getBlockByNumber";
};

var transactionFromBlockCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'sero_getTransactionByBlockHashAndIndex' : 'sero_getTransactionByBlockNumberAndIndex';
};

var uncleCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'sero_getUncleByBlockHashAndIndex' : 'sero_getUncleByBlockNumberAndIndex';
};

var getBlockTransactionCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'sero_getBlockTransactionCountByHash' : 'sero_getBlockTransactionCountByNumber';
};

var uncleCountCall = function (args) {
    return (utils.isString(args[0]) && args[0].indexOf('0x') === 0) ? 'sero_getUncleCountByBlockHash' : 'sero_getUncleCountByBlockNumber';
};

function Sero(web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });

    properties().forEach(function(p) {
        p.attachToObject(self);
        p.setRequestManager(self._requestManager);
    });

}

Object.defineProperty(Sero.prototype, 'defaultBlock', {
    get: function () {
        return c.defaultBlock;
    },
    set: function (val) {
        c.defaultBlock = val;
        return val;
    }
});

Object.defineProperty(Sero.prototype, 'defaultAccount', {
    get: function () {
        return c.defaultAccount;
    },
    set: function (val) {
        c.defaultAccount = val;
        return val;
    }
});

var methods = function () {

    var isMinePKr = new Method({
        name: 'isMinePKr',
        call: 'sero_isMinePKr',
        params: 1
    });

    var getBalance = new Method({
        name: 'getBalance',
        call: 'sero_getBalance',
        params: 2,
        inputFormatter: [formatters.inputParamAddressFormatter,formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: formatters.outputBalanceFormatter
    });

    var getTk = new Method({
        name: 'getTk',
        call: 'sero_getTk',
        params: 1,
        inputFormatter: [formatters.inputParamAddressFormatter]
    });

    var getPkg = new Method({
        name: 'getPkg',
        call: 'sero_getPkg',
        params: 3,
        inputFormatter: [formatters.inputParamAddressFormatter,null,null],
    });

    var watchPkg = new Method({
        name: 'watchPkg',
        call: 'sero_watchPkg',
        params: 2,
    });

    var getStorageAt = new Method({
        name: 'getStorageAt',
        call: 'sero_getStorageAt',
        params: 3,
        inputFormatter: [null, utils.toHex, formatters.inputDefaultBlockNumberFormatter]
    });

    var getCode = new Method({
        name: 'getCode',
        call: 'sero_getCode',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter]
    });

    var getBlock = new Method({
        name: 'getBlock',
        call: blockCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, function (val) { return !!val; }],
        outputFormatter: formatters.outputBlockFormatter
    });

    var getUncle = new Method({
        name: 'getUncle',
        call: uncleCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
        outputFormatter: formatters.outputBlockFormatter,

    });

    var getCompilers = new Method({
        name: 'getCompilers',
        call: 'sero_getCompilers',
        params: 0
    });

    var getBlockTransactionCount = new Method({
        name: 'getBlockTransactionCount',
        call: getBlockTransactionCountCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var getBlockUncleCount = new Method({
        name: 'getBlockUncleCount',
        call: uncleCountCall,
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var getTransaction = new Method({
        name: 'getTransaction',
        call: 'sero_getTransactionByHash',
        params: 1,
        outputFormatter: formatters.outputTransactionFormatter
    });

    var convertAddressParams = new Method({
        name: 'convertAddressParams',
        call: 'sero_convertAddressParams',
        params: 3,
    });

    var getFullAddress = new Method({
        name: 'getFullAddress',
        call: 'sero_getFullAddress',
        params: 1,
    });
    var getBlockInfo= new Method({
        name:'getBlockInfo',
        call:"sero_getBlockInfo",
        inputFormatter: [formatters.inputBlockNumberFormatter,formatters.inputBlockNumberFormatter],
        params:2
    })
    var getAnchor = new Method({
        name :'getAnchor',
        call:"sero_getAnchor",
        params:1
    })

    var currencyToContractAddress = new Method({
        name: 'cyToContractAddress',
        call: 'sero_currencyToContractAddress',
        params: 1,
    });

    var getDecimal = new Method({
        name: 'getDecimal',
        call: 'sero_getDecimal',
        params: 1,
        outputFormatter: utils.toDecimal
    });

    var getTransactionFromBlock = new Method({
        name: 'getTransactionFromBlock',
        call: transactionFromBlockCall,
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, utils.toHex],
        outputFormatter: formatters.outputTransactionFormatter
    });

    var getTransactionReceipt = new Method({
        name: 'getTransactionReceipt',
        call: 'sero_getTransactionReceipt',
        params: 1,
        outputFormatter: formatters.outputTransactionReceiptFormatter
    });

    var getTransactionCount = new Method({
        name: 'getTransactionCount',
        call: 'sero_getTransactionCount',
        params: 2,
        inputFormatter: [null, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: utils.toDecimal
    });

    var sendTransaction = new Method({
        name: 'sendTransaction',
        call: 'sero_sendTransaction',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });
    var genPKr=new Method({
        name: 'genPKr',
        call: 'sero_genPKr',
        params: 1,
        inputFormatter: [formatters.inputAddressFormatter]
    });
    var genIndexPKr=new Method({
        name: 'genIndexPKr',
        call: 'sero_genIndexPKr',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter,null]
    });
    var genIndexPKrByTk=new Method({
        name: 'genIndexPKrByTk',
        call: 'sero_genIndexPKrByTk',
        params: 2,
    });

    var reSendTransaction = new Method({
        name: 'reSendTransaction',
        call: 'sero_reSendTransaction',
        params: 1,
        inputFormatter: [utils.toHex]
    });

    var createPkg = new Method({
        name: 'createPkg',
        call: 'sero_createPkg',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });

    var closePkg = new Method({
        name: 'closePkg',
        call: 'sero_closePkg',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });

    var transferPkg = new Method({
        name: 'transferPkg',
        call: 'sero_transferPkg',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });

    var call = new Method({
        name: 'call',
        call: 'sero_call',
        params: 2,
        inputFormatter: [formatters.inputCallFormatter, formatters.inputDefaultBlockNumberFormatter]
    });

    var estimateGas = new Method({
        name: 'estimateGas',
        call: 'sero_estimateGas',
        params: 1,
        inputFormatter: [formatters.inputCallFormatter],
        outputFormatter: utils.toDecimal
    });

    var compileSolidity = new Method({
        name: 'compile.solidity',
        call: 'sero_compileSolidity',
        params: 1
    });

    var compileLLL = new Method({
        name: 'compile.lll',
        call: 'sero_compileLLL',
        params: 1
    });

    var compileSerpent = new Method({
        name: 'compile.serpent',
        call: 'sero_compileSerpent',
        params: 1
    });

    var submitWork = new Method({
        name: 'submitWork',
        call: 'sero_submitWork',
        params: 3
    });

    var getWork = new Method({
        name: 'getWork',
        call: 'sero_getWork',
        params: 0
    });

    var startHashrate = new Method({
        name: 'startHashrate',
        call: 'sero_startHashrate',
        params: 0
    });

    var stopHashrate = new Method({
        name: 'stopHashrate',
        call: 'sero_stopHashrate',
        params: 0
    });

    var getBlockRewardByNumber = new Method({
        name: 'getBlockRewardByNumber',
        call: 'sero_getBlockRewardByNumber',
        params: 1,
        inputFormatter: [formatters.inputBlockNumberFormatter],
        outputFormatter:function(val){return val.map(function(e){
            return utils.toBigNumber(e);
        })}
    });

    return [
        isMinePKr,
        getBalance,
        getTk,
        getPkg,
        watchPkg,
        getStorageAt,
        getCode,
        getBlock,
        getUncle,
        getCompilers,
        getBlockTransactionCount,
        getBlockInfo,
        getAnchor,
        getBlockUncleCount,
        getTransaction,
        getTransactionFromBlock,
        getTransactionReceipt,
        getTransactionCount,
        call,
        estimateGas,
        sendTransaction,
        reSendTransaction,
        createPkg,
        closePkg,
        transferPkg,
        convertAddressParams,
        genPKr,
        genIndexPKr,
        genIndexPKrByTk,
        getFullAddress,
        currencyToContractAddress,
        getDecimal,
        compileSolidity,
        compileLLL,
        compileSerpent,
        submitWork,
        getWork,
        startHashrate,
        stopHashrate,
        getBlockRewardByNumber
    ];
};


var properties = function () {
    return [
        new Property({
            name: 'coinbase',
            getter: 'sero_coinbase'
        }),
        new Property({
            name: 'mining',
            getter: 'sero_mining'
        }),
        new Property({
            name: 'hashrate',
            getter: 'sero_hashrate',
            outputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'syncing',
            getter: 'sero_syncing',
            outputFormatter: formatters.outputSyncingFormatter
        }),
        new Property({
            name: 'gasPrice',
            getter: 'sero_gasPrice',
            outputFormatter: formatters.outputBigNumberFormatter
        }),
        new Property({
            name: 'accounts',
            getter: 'sero_accounts'
        }),
        new Property({
            name: 'blockNumber',
            getter: 'sero_blockNumber',
            outputFormatter: utils.toDecimal
        }),
        new Property({
            name: 'protocolVersion',
            getter: 'sero_protocolVersion'
        })
    ];
};

Sero.prototype.contract = function (abi) {
    var factory = new Contract(this, abi);
    return factory;
};

Sero.prototype.filter = function (options, callback, filterCreationErrorCallback) {
    return new Filter(options, 'sero', this._requestManager, watches.sero(), formatters.outputLogFormatter, callback, filterCreationErrorCallback);
};

Sero.prototype.namereg = function () {
    return this.contract(namereg.global.abi).at(namereg.global.address);
};

Sero.prototype.icapNamereg = function () {
    return this.contract(namereg.icap.abi).at(namereg.icap.address);
};

Sero.prototype.isSyncing = function (callback) {
    return new IsSyncing(this._requestManager, callback);
};

module.exports = Sero;
