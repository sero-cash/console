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
 * @file contract.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2014
 */

var utils = require('../utils/utils');
var coder = require('../solidity/coder');
var SolidityEvent = require('./event');
var SolidityFunction = require('./function');
var AllEvents = require('./allevents');
var errors = require('./errors');

/**
 * Should be called to encode constructor params
 *
 * @method encodeConstructorParams
 * @param {Array} abi
 * @param {Array} constructor params
 */
var encodeConstructorParams = function (abi, params,shortAddrMap) {
    return abi.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
        return coder.encodeParams(types, params,shortAddrMap);
    })[0] || '';
};

var encodeConstructorPrefix = function (abi, params,rand) {
    return abi.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
        return coder.addressPrefix(types, params,rand);
    })[0] || coder.addressPrefix([], [],rand);
};

var opArgs = function (abi, params,rand,sero,dy,callback) {
    if (callback){
        var types = abi.filter(function (json) {
            return json.type === 'constructor' && json.inputs.length === params.length;
        }).map(function (json) {
            return json.inputs.map(function (input) {
                return input.type;
            });
        });
        if (types&&types[0]){
            coder.opParams(types[0], params,rand,sero,dy,callback);
        }else {
            coder.opParams([], [],rand,sero,dy,callback)
        }

    }else{
        return abi.filter(function (json) {
            return json.type === 'constructor' && json.inputs.length === params.length;
        }).map(function (json) {
            return json.inputs.map(function (input) {
                return input.type;
            });
        }).map(function (types) {
            return coder.opParams(types, params,rand,sero,dy);
        })[0] || coder.opParams([], [],rand,sero,dy);
    }

};



/**
 * Should be called to add functions to contract object
 *
 * @method addFunctionsToContract
 * @param {Contract} contract
 * @param {Array} abi
 */
var addFunctionsToContract = function (contract,newAbi) {
    contract.abi.filter(function (json) {
        return json.type === 'function';
    }).map(function (json) {
        return new SolidityFunction(contract._sero, json, contract.address,newAbi);
    }).forEach(function (f) {
        f.attachToContract(contract);
    });
};

/**
 * Should be called to add events to contract object
 *
 * @method addEventsToContract
 * @param {Contract} contract
 * @param {Array} abi
 */
var addEventsToContract = function (contract) {
    var events = contract.abi.filter(function (json) {
        return json.type === 'event';
    });

    var All = new AllEvents(contract._sero, events, contract.address);
    All.attachToContract(contract);

    events.map(function (json) {
        return new SolidityEvent(contract._sero, json, contract.address);
    }).forEach(function (e) {
        e.attachToContract(contract);
    });
};


/**
 * Should be called to check if the contract gets properly deployed on the blockchain.
 *
 * @method checkForContractAddress
 * @param {Object} contract
 * @param {Function} callback
 * @returns {Undefined}
 */
var checkForContractAddress = function(contract, callback){
    var count = 0,
        callbackFired = false;

    // wait for receipt
    var filter = contract._sero.filter('latest', function(e){
        if (!e && !callbackFired) {

            count++;
            // stop watching after 50 blocks (timeout)
            if (count > 50) {

                filter.stopWatching(function() {});
                callbackFired = true;

                if (callback)
                    callback(new Error('Contract transaction couldn\'t be found after 50 blocks'));
                else
                    throw new Error('Contract transaction couldn\'t be found after 50 blocks');


            } else {

                contract._sero.getTransactionReceipt(contract.transactionHash, function(e, receipt){
                    if(receipt && receipt.blockHash && !callbackFired) {

                        contract._sero.getCode(receipt.contractAddress, function(e, code){
                            /*jshint maxcomplexity: 6 */

                            if(callbackFired || !code)
                                return;

                            filter.stopWatching(function() {});
                            callbackFired = true;

                            if(code.length > 3) {

                                // console.log('Contract code deployed!');

                                contract.address = receipt.contractAddress;

                                // attach events and methods again after we have
                                addFunctionsToContract(contract);
                                addEventsToContract(contract);

                                // call callback for the second time
                                if(callback)
                                    callback(null, contract);

                            } else {
                                if(callback)
                                    callback(new Error('The contract code couldn\'t be stored, please check your gas amount.'));
                                else
                                    throw new Error('The contract code couldn\'t be stored, please check your gas amount.');
                            }
                        });
                    }
                });
            }
        }else {
            console.log("erro filter " + e)
        }
    });
};

/**
 * Should be called to create new ContractFactory instance
 *
 * @method ContractFactory
 * @param {Array} abi
 */
var ContractFactory = function (sero, abi) {
    this.sero = sero;
    this.abi = abi;

    /**
     * Should be called to create new contract on a blockchain
     *
     * @method new
     * @param {Any} contract constructor param1 (optional)
     * @param {Any} contract constructor param2 (optional)
     * @param {Object} contract transaction object (required)
     * @param {Function} callback
     * @returns {Contract} returns contract instance
     */
    this.new = function () {
        /*jshint maxcomplexity: 7 */

        var contract = new Contract(this.sero, this.abi);

        // parse arguments
        var options = {}; // required!
        var callback;

        var args = Array.prototype.slice.call(arguments);
        if (utils.isFunction(args[args.length - 1])) {
            callback = args.pop();
        }

        var last = args[args.length - 1];
        if (utils.isObject(last) && !utils.isArray(last)) {
            options = args.pop();
        }

        if (options.value > 0) {
            var constructorAbi = abi.filter(function (json) {
                return json.type === 'constructor' && json.inputs.length === args.length;
            })[0] || {};

            var isPayable = false;

            if (constructorAbi.stateMutability === "payable" ){
                isPayable = true;
            }


            if (constructorAbi.hasOwnProperty("payable") ){
                isPayable = constructorAbi.payable;
            }

            if (!isPayable) {
                throw new Error('Cannot send value to non-payable constructor');
            }
        }
        options.abi =this.abi;

        var rand ="0x";
        var argsResult = opArgs(this.abi,args,rand,this.sero,false);
        args = argsResult.params;
        rand = argsResult.rand;
        var shortAddrMap = argsResult.shortAddr;
        var bytes = encodeConstructorParams(this.abi, args,shortAddrMap);
        options.data += bytes;
        var prefix = encodeConstructorPrefix(this.abi,args,rand);
        options.data = prefix +options.data.substr(2);

        if (callback) {

            // wait for the contract address and check if the code was deployed
            this.sero.sendTransaction(options, function (err, hash) {
                if (err) {
                    callback(err);
                } else {
                    // add the transaction hash
                    contract.transactionHash = hash;

                    // call callback for the first time
                    callback(null, contract);

                    checkForContractAddress(contract, callback);
                }
            });
        } else {
            var hash = this.sero.sendTransaction(options);
            // add the transaction hash
            contract.transactionHash = hash;
            checkForContractAddress(contract);
        }

        return contract;
    };

    this.new.getData = this.getData.bind(this);
};

/**
 * Should be called to create new ContractFactory
 *
 * @method contract
 * @param {Array} abi
 * @returns {ContractFactory} new contract factory
 */
//var contract = function (abi) {
    //return new ContractFactory(abi);
//};



/**
 * Should be called to get access to existing contract on a blockchain
 *
 * @method at
 * @param {Address} contract address (required)
 * @param {Function} callback {optional)
 * @returns {Contract} returns contract if no callback was passed,
 * otherwise calls callback function (err, contract)
 */
ContractFactory.prototype.at = function (address, callback) {
    var contract = new Contract(this.sero, this.abi, address);

    // this functions are not part of prototype,
    // because we dont want to spoil the interface
    addFunctionsToContract(contract);
    addEventsToContract(contract);

    if (callback) {
        callback(null, contract);
    }
    return contract;
};


ContractFactory.prototype.atNewAbi = function (address) {
    var contract = new Contract(this.sero, this.abi, address);

    // this functions are not part of prototype,
    // because we dont want to spoil the interface
    addFunctionsToContract(contract,true);
    addEventsToContract(contract);
};

/**
 * Gets the data, which is data to deploy plus constructor params
 *
 * @method getData
 */
ContractFactory.prototype.getData = function () {
    var options = {}; // required!
    var args = Array.prototype.slice.call(arguments);

    var callback;
    if (utils.isFunction(args[args.length - 1])) {
        callback = args.pop();
    }
    var last = args[args.length - 1];
    if (utils.isObject(last) && !utils.isArray(last)) {
        options = args.pop();
    }
    var rand ="0x";

    var self = this;

    if (callback){
        var cb = function(err,result){
            if (err){
                throw errors.InvalidResponse(err);
            }
            args = result.params;
            rand = result.rand;
            var shortAddrMap = result.shortAddr;
            var bytes = encodeConstructorParams(self.abi, args,shortAddrMap);
            options.data += bytes;
            var prefix = encodeConstructorPrefix(self.abi,args,rand);
            options.data = prefix +options.data.substr(2);
            callback(options.data);
        }
        opArgs(this.abi,args,rand,self.sero,false,cb);

    }else{

        argsResult = opArgs(self.abi,args,rand,self.sero,false);
        args = argsResult.params;
        rand = argsResult.rand;
        var shortAddrMap = result.shortAddr;
        var bytes = encodeConstructorParams(self.abi, args,shortAddrMap);
        options.data += bytes;
        var prefix = encodeConstructorPrefix(self.abi,args,rand);
        options.data = prefix +options.data.substr(2);

        return options.data;
    }
};

/**
 * Should be called to create new contract instance
 *
 * @method Contract
 * @param {Array} abi
 * @param {Address} contract address
 */
var Contract = function (sero, abi, address) {
    this._sero = sero;
    this.transactionHash = null;
    this.address = address;
    this.abi = abi;
};

module.exports = ContractFactory;
