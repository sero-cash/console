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
        params: 2
    });

    var getBalances = new Method({
        name: 'getBalances',
        call: 'exchange_getBalances',
        params: 1
    });

    var getPkSynced = new Method({
        name: 'getPkSynced',
        call: 'exchange_getPkSynced',
        params: 1
    });

    var merge = new Method({
        name: 'merge',
        call: 'exchange_merge',
        params: 2
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
        params: 3
    });
    var commitTx = new Method({
        name: 'commitTx',
        call: 'exchange_commitTx',
        params: 1
    });
    var validAddress = new Method({
        name: 'validAddress',
        call: 'exchange_validAddress',
        params: 1
    });
    var getMaxAvailable = new Method({
        name: 'getMaxAvailable',
        call: 'exchange_getMaxAvailable',
        params: 2
    });

    return [
        getPkr,
        getPkSynced,
        merge,
        getBalances,
        genTx,
        genTxWithSign,
        getRecords,
        commitTx,
        validAddress,
        getMaxAvailable
    ];
};


module.exports = Exchange;
