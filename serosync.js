var Web3 = require("./lib/web3");

var providers = ["http://localhost:8545"];

var accountBalance = {};

var transactionHashs = [];

var transactionAmount = {};


var Transaction = function (ser, from, to, cy, value) {
    this.ser = ser;
    var data = {};
    data.from = from;
    data.to = to;
    data.cy = cy;
    data.value = value;
    this.data = data;
};

var Record = function (from, to, cy, value, before, after, transactionHash) {
    this.from = from;
    this.to = to;
    this.cy = cy;
    this.value = value;
    this.before = before;
    this.after = after;
    this.transactionHash = transactionHash;
};

Transaction.prototype.send = function (before) {
    var self = this;
    var amount = self.data.value;
    var record = new Record(self.data.from, self.data.to, self.data.cy, amount, before);
    console.log(JSON.stringify(record));
    try {
        var transactionHash = self.sero.sendTransaction(self.data);
        record.transactionHash = transactionHash;
        var fromAmount = accountBalance[record.from + "_" + record.cy] - record.value - 21000 * 180;
        accountBalance[record.from + "_" + record.cy] = fromAmount;
        var toAmount = record.value;
        if (accountBalance.hasOwnProperty(record.to + "_" + record.cy)) {
            toAmount += accountBalance[record.to + "_" + record.cy];
        }
        accountBalance[record.to + "_" + record.cy] = toAmount;
        transactionHashs.push(transactionHash);
        transactionAmount[transactionHash] = record;
    } catch (e) {
        console.log("Exception:" + JSON.stringify(record));
    }
};


providers.forEach(function (p) {
    var web3 = new Web3();
    web3.setProvider(new Web3.providers.HttpProvider(p));
    var _ser = web3.ser;
    var accounts = web3.sero.accounts;

    var sAccounts = [];


    accounts.forEach(function (account, i) {
        var balanceMap = web3.sero.getBalance(account);
        for (var cy in balanceMap) {
            accountBalance[account + "_" + cy] = balanceMap[cy].toNumber();
        }
        if (i > 0) {
            sAccounts.push(account);
        }
    });

    console.log(JSON.stringify(accountBalance));

    var validNum = sAccounts.length;
    var run = 0;

    var count = 100;

    while (count > 1 && validNum > 1) {
        var from = sAccounts[run % validNum];
        run++;
        var to = sAccounts[run % validNum];

        if (!to) {
            console.log(run + ',' + validNum);
        }

        var balanceMap = web3.sero.getBalance(from);
        for (var cy in balanceMap) {
            var balance = balanceMap[cy];
            if (cy === 'sero' && (balance - Math.floor(balance / 3)) <= 16200000) {
                var index = sAccounts.indexOf(from);
                if (index > -1) {
                    sAccounts.splice(index, 1);
                }
                validNum = sAccounts.length;
                continue;
            }
            var value = Math.floor(balance / 3);
            new Transaction(_ser, from, to, cy, value).send(balance.toNumber());
            // sleep(10*1000);
        }
        count--;

    }
});


function sleep(sleepTime) {
    var start = new Date().getTime();
    while (true) if (new Date().getTime() - start > sleepTime) break;
}

var lockWeb3 = new Web3();
lockWeb3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

transactionHashs.forEach(function (hash) {
    var count = 0,
        callbackFired = false;
    while (count <= 50 && !callbackFired) {
        var receipt = lockWeb3.sero.getTransactionReceipt(hash);
        if (receipt && receipt.blockHash && !callbackFired) {
            callbackFired = true;
            delete transactionAmount[hash];
            return;
        } else {
            sleep(2 * 1000);
        }
    }
    console.log("transaction failed :" + hash);
});

for (var a in accountBalance) {
    var account = a.split("_")[0];
    var cy = a.split("_")[1];
    var balanceMap = lockWeb3.sero.getBalance(account);
    for (var unit in balanceMap) {
        var balance = balanceMap[unit].toNumber();
        if (unit === cy) {
            if (balance != accountBalance[a]) {
                console.log(a + ",balance error！" + (accountBalance[a] - balance));
            }
        }

    }
}


console.log(transactionAmount);





