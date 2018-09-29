var Web3 = require("../../lib/web3");
var File = require('../utils/fileUtils')

var providers = ["http://127.0.0.1:8545"]

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
    record.start = new Date().getTime();
    try {

        var transactionHash = self.sero.sendTransaction(self.data);
        record.txHash = transactionHash;
        console.log("tx:" + transactionHash + ",exc = " + (new Date().getTime() - record.start));
        if (watch) {
            writeTransaction(self.sero, record);
        }
    } catch (e) {
        record.err = e;
        erroFile.write(record);
        // console.log(JSON.stringify(record));
        console.log("Exception:" + e+ ",exc = " + (new Date().getTime() - record.start));
    }
}

Transaction.prototype.sendAsync = function (watch) {
    var self = this;
    var record = self.toRecord();
    record.start = new Date().getTime();
    try {
        self.sero.sendTransaction(self.data, (err, result) => {
            if (!err) {
                record.txHash = result;
                console.log("tx:" + result + ",exc = " + (new Date().getTime() - record.start));
                if (watch) {
                    writeTransaction(self.sero, record);
                }
            } else {
                record.err = err;
                erroFile.write(record);
                // console.log(JSON.stringify(record));
                console.log(self.provider+" , Exception:" + err+ ",exc = " + (new Date().getTime() - record.start));
            }
        });
    } catch (e) {
        erroFile.write(record);
        // console.log(JSON.stringify(record));
        console.log(self.provider+" , Exception:" + e + ",exc = " + (new Date().getTime() - record.start));
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
    txAccounts.sort(function (){
        return Math.random()>.5 ? -1 : 1;
    });
}

var prepareOuts = function (web3,watch) {
    var accounts;
    try{
        accounts = web3.sero.accounts;
    }catch (e) {
        console.log(web3.currentProvider.host +" ,error")
        return;
    }

    for (var i = 1; i < accounts.length; i++) {
        new Transaction(web3.sero, web3.currentProvider.host, accounts[0], accounts[i], "sero", 50000).sendAsync(watch);
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
                new Transaction(_sero, fromAddr.web3.currentProvider.host, fromAddr.addr, toAddr.addr, cy, value).send();
            } else {
                new Transaction(_sero, fromAddr.web3.currentProvider.host, fromAddr.addr, toAddr.addr, cy, value).sendAsync(false);
            }
        }
        total--;
    }

}

var runCommon = function (sync) {

    init();

    var validNum = txAccounts.length;
    var count = 0;
    var total = 100;
    while (total > 1 && validNum > 1) {
        var fromAddr = txAccounts[count % validNum];
        var _sero = fromAddr.web3.sero;
        count++;
        var toAddr = txAccounts[count % validNum];
        if (sync) {
            new Transaction(_sero, fromAddr.web3.currentProvider.host, fromAddr.addr, toAddr.addr, "sero", 1000).send();
        } else {
            new Transaction(_sero, fromAddr.web3.currentProvider.host, fromAddr.addr, toAddr.addr, "sero", 1000).sendAsync(true);
        }
        total--;
    }

}


var prepareProviderOuts = function (watch) {
    var prepareCount =1;
    file.clear();
    erroFile.clear();
    failedFile.clear();
    while (prepareCount>0){
        providers.forEach(function (p) {
            var web3 =  new Web3(new Web3.providers.HttpProvider(p));
            prepareOuts(web3,watch);
        });
        prepareCount--;
    }
}

var sendToMiner = function(from,to){
    toMiners = [];
    to.forEach(function (t) {
        var toWeb3 = new Web3(new Web3.providers.HttpProvider(t));
        toMiners.push( toWeb3.sero.accounts[0]);
    });
    var web3 = new Web3(new Web3.providers.HttpProvider(from));
    fromAccount = web3.sero.accounts[0];
    var  sendCount = 10;
    while(sendCount >0){
        toMiners.forEach(function(toMiner){
            new Transaction(web3.sero, web3.currentProvider.host, fromAccount, toMiner, "sero", 500000).sendAsync(false);
        });
        sendCount--;
    }
}

var  fromProvider ="http://127.0.0.1:8545"

prepareOuts(new Web3(new Web3.providers.HttpProvider(fromProvider)),false);

var toProviders =["http://127.0.0.1:8545"]

// sendToMiner(fromProvider,toProviders)

// prepareProviderOuts(false);

// runCommon(false);
