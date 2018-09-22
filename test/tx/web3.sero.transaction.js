var Web3 = require("../../lib/web3");
var File = require('../utils/fileUtils')
var providers = ["http://192.168.50.250:8545"];
var local = new Web3(new Web3.providers.HttpProvider("http://192.168.50.250:8545"))
var coinbase = local.sero.accounts[0] //miner

var Address = function (addr, web3) {
    this.addr = addr;
    this.web3 = web3;
}
var txAccounts = []


var file = new File('tx.log')
var failedFile = new File('failed_tx.log')
var erroFile = new File('error_tx.log')
var Transaction = function (sero, provider, from, to, cy, value) {
    this.provider = provider;
    this.sero = sero;
    var data = {};
    data.from = from;
    data.to = to;
    data.cy = cy;
    data.value = value;
    this.data = data;
};

Transaction.prototype.toRecord = function () {
    var record = new Record(this.data.from, this.data.to, this.data.cy, this.data.value, this.provider)
    return record;
}

var Record = function (from, to, cy, value, provider, txHash) {
    this.from = from;
    this.to = to;
    this.cy = cy;
    this.value = value;
    this.txHash = txHash;
    this.provider = provider;
};

Transaction.prototype.send = function (watch) {
    var self = this;
    var record = self.toRecord();
    try {
        var start = new Date().getTime();
        var transactionHash = self.sero.sendTransaction(self.data);
        record.txHash = transactionHash;
        console.log("tx:" + transactionHash + ",exc = " + (new Date().getTime() - start));
        if (watch) {
            writeTransaction(self.sero, record);
        }
    } catch (e) {
        erroFile.write(record);
        console.log(JSON.stringify(record));
        console.log("Exception:" + e);
    }
}

Transaction.prototype.sendAsync = function (watch) {
    var self = this;
    var record = self.toRecord();
    try {
        var start = new Date().getTime();
        self.sero.sendTransaction(self.data, (err, result) => {
            if (!err) {
                record.txHash = result;
                console.log("tx:" + result + ",exc = " + (new Date().getTime() - start));
                if (watch) {
                    writeTransaction(self.sero, record);
                }
            } else {
                erroFile.write(record);
                console.log(JSON.stringify(record));
                console.log("Exception:" + err);
            }
        });
    } catch (e) {
        erroFile.write(record);
        console.log(JSON.stringify(record));
        console.log("Exception:" + e);
    }

}

function writeTransaction(sero, params) {
    var count = 0,
        callbackFired = false;
    var filter = sero.filter('latest', function (e) {
        if (!e && !callbackFired) {
            count++;

            // stop watching after 50 blocks (timeout)
            if (count <= 50) {
                sero.getTransactionReceipt(params.txHash, function (e, receipt) {
                    if (receipt && receipt.blockHash && !callbackFired) {
                        callbackFired = true;
                        file.write(params)
                        filter.stopWatching(function () {
                        });
                    }
                });
            } else {
                filter.stopWatching(function () {
                });
                callbackFired = true;
                failedFile.write(params)
                console.log(' tx: ' + params.txHash + ',couldn\'t be found after 50 blocks');

            }
        } else {
            if (e) {
                filter.stopWatching(function () {
                });
                console.log("tx:" + params.txHash + ",exception:" + e)
            }
        }
    });
}


var init = function () {
    file.clear();
    erroFile.clear();
    failedFile.clear();
    providers.forEach(function (p) {
        var web3 = new Web3(new Web3.providers.HttpProvider(p));
        var accounts = web3.sero.accounts;
        accounts.forEach(function (account) {
            var address = new Address(account, web3)
            if (coinbase !== account) {
                txAccounts.push(address)
            }
        });
    });

}

var prepareOuts = function (prepareCounts) {
    var accounts = local.sero.accounts;
    while (prepareCounts > 0) {
        for (var i = 1; i < accounts.length; i++) {
            new Transaction(local.sero, local.providers.HttpProvider.host, accounts[0], accounts[i], "sero", 50000000).send(false);
        }
        prepareCounts--;
    }
}

var run = function (sync) {

    init();

    var validNum = txAccounts.length;
    var count = 0;
    var total = 1000;
    while (total > 1 && validNum > 1) {
        var fromAddr = txAccounts[count % validNum];
        var _sero = fromAddr.web3.sero;
        count++;
        var toAddr = txAccounts[count % validNum];
        var balanceMap = _sero.getBalance(fromAddr.addr);
        for (var cy in balanceMap) {
            var balance = balanceMap[cy];
            var value = 1000;
            if (cy === 'sero' && (balance - value) <= 16200000) {
                var index = txAccounts.indexOf(fromAddr);
                if (index > -1) {
                    txAccounts.splice(index, 1);
                }
                validNum = txAccounts.length;
                continue;
            }
            if (sync) {
                new Transaction(_sero, fromAddr.web3.providers.HttpProvider.host, fromAddr.addr, toAddr.addr, cy, value).send();
            } else {
                new Transaction(_sero, fromAddr.web3.providers.HttpProvider.host, fromAddr.addr, toAddr.addr, cy, value).sendAsync(false);
            }
        }
        total--;
    }

}

var runCommon = function (sync) {

    init();

    var validNum = txAccounts.length;
    var count = 0;
    var total = 1000;
    while (total > 1 && validNum > 1) {
        var fromAddr = txAccounts[count % validNum];
        var _sero = fromAddr.web3.sero;
        count++;
        var toAddr = txAccounts[count % validNum];
        if (sync) {
            new Transaction(_sero, fromAddr.web3.providers.HttpProvider.host, fromAddr.addr, toAddr.addr, "sero", 1000).send();
        } else {
            new Transaction(_sero, fromAddr.web3.providers.HttpProvider.host, fromAddr.addr, toAddr.addr, "sero", 1000).sendAsync(false);
        }
        total--;
    }

}

prepareOuts(100);
// runCommon(false);
