"use strict";

var Method = require('../method');
var formatters = require('../formatters');

function Exchange(web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });
}

var methods = function () {
    var getPkr = new Method({
        name: 'getPkr',
        call: 'exchange_getPkr',
        params: 2,
        inputFormatter: [formatters.inputHexPFormatter,null]
    });

    var getBalances = new Method({
        name: 'getBalances',
        call: 'exchange_getBalances',
        params: 1,
        inputFormatter: [formatters.inputHexPKFormatter]
    });

    var getPkSynced = new Method({
        name: 'getPkSynced',
        call: 'exchange_getPkSynced',
        params: 1,
        inputFormatter: [formatters.inputHexPKFormatter]
    });

    var genTx = new Method({
        name: 'genTx',
        call: 'exchange_genTx',
        params: 1
    });

    var genTxWithSign = new Method({
        name: 'genTxWithSign',
        call: 'exchange_genTxWithSign',
        params: 1
    });

    var getRecords = new Method({
        name: 'getRecords',
        call: 'exchange_getRecords',
        params: 3,
        inputFormatter: [formatters.inputHexAddressFormatter,null,null]
    });
    var commitTx = new Method({
        name: 'commitTx',
        call: 'exchange_commitTx',
        params: 1
    });

    return [
        getPkr,
        getPkSynced,
        getBalances,
        genTx,
        genTxWithSign,
        getRecords,
        commitTx
    ];
};


module.exports = Exchange;
