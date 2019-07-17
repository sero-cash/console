"use strict";

var Method = require('../method');
var formatters = require('../formatters');

function Stake(web3) {
    this._requestManager = web3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });
}

var methods = function () {
    var buyShare = new Method({
        name: 'buyShare',
        call: 'stake_buyShare',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });

    return [
        buyShare
    ];
};


module.exports = Stake;
