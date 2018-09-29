# console web3.js

This is the Sero compatible JavaScript API which  base on [ethereum/web3.js](https://github.com/ethereum/web3.js)  version with  [v0.20.6 latest maintenance release](https://github.com/ethereum/web3.js/releases/tag/v0.20.6) .It is used by gero client as embed js that
can interract with the Sero blockchain. It alse can be as a reference for dApps to interract with the Sero blockchain.

## Differences from web3.js

#### 1. value of unit

The minimum unit of Sero is ta, and one sero is equivalent to 10 to the 9th power ta.
```
var unitMap = {
    'noether':      '0',
    'ta':          '1',
    'Ta':          '1',
    'sero':         '1000000000',
    'Sero':         '1000000000'
};
```

```css
/**
 * Takes a number of Ta and converts it to any other sero unit.
 *
 *
 * @method fromTa
 * @param {Number|String} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert to, default ether
 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
 */
var fromTa = function (number, unit) {
    var returnValue = toBigNumber(number).dividedBy(getValueOfUnit(unit));

    return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

/**
 * Takes a number of a unit and converts it to ta.
 * @method toTa
 * @param {Number|String|BigNumber} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert from, default ether
 * @return {String|Object} When given a BigNumber object it returns one as well, otherwise a number
 */
var toTa = function (number, unit) {
    var returnValue = toBigNumber(number).times(getValueOfUnit(unit));

    return isBigNumber(number) ? returnValue : returnValue.toString(10);
};

```

### 2. address

All the address  is showed as base58 string

```/**
    * Convert a byte array to a base58 string
    *
    * @method bytesToBase58
    * @param {Array} bytes
    * @return {String} the base58 string
    */
   var bytesToBase58 = function (bytes) {
       return base58.encode(bytes);
   };
   
   /**
    * Convert a base58 string to a byte array
    *
    * @method base58ToBytes
    * @param {String} the base58 string
    * @return {Array} bytes
    */
   var base58ToBytes = function (bs58) {
       return base58.decode(bs58);
   }

```
```/**
    * Checks if the given string is strictly an address
    *
    * @method isStrictAddress
    * @param {String} address the given base58 adress
    * @return {Boolean}
    */
   var isStrictAddress = function (address) {
   
       if (/^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{84,103}$/i.test(address)) {
           bytes = base58ToBytes(address)
           if (bytes.length !== 128) {
               return false;
           }
           return true;
       } else {
           return false;
       }
   };

```

### 3.contract params 

Create or call contract must post abi and pairs params。the paris is a json string array,the key is solidity params type  and the value is function param's value;and no need to splicing method parameters for data param.


gen paris:
```css
/**
 * Should be used to encode list of params,used by sero
 *
 * @method encodeSeroParams
 * @param {Array} types
 * @param {Array} params
 * @return {String} encoded list of params
 */
SolidityCoder.prototype.encodeSeroParams = function (types, params) {
    var solidityTypes = this.getSolidityTypes(types);

    var encodeds = solidityTypes.map(function (solidityType, index) {
        encodedJson ={};
        encodedJson[types[index]] = solidityType.encodeSero(params[index], types[index]);
        return JSON.stringify(encodedJson);
    });


    return encodeds;
};

```

```
/**
   * Should be used to encode list of params,used by sero
   *
   * @method encodeSeroParams
   * @param {Array} types
   * @param {Array} params
   * @return {String} encoded list of params
   */
  SolidityCoder.prototype.encodeSeroParams = function (types, params) {
      var solidityTypes = this.getSolidityTypes(types);
  
      var encodeds = solidityTypes.map(function (solidityType, index) {
          encodedJson ={};
          encodedJson[types[index]] = solidityType.encodeSero(params[index], types[index]);
          return JSON.stringify(encodedJson);
      });
  
  
      return encodeds;
  };

```

### 5. sendTransaction params

The method of SendTransaction Json params add pairs、abi、cy、dy key. The abi,pairs only be used when create or call crontract, and dy only be used  when call contract that means whether to regenerate a one-time address. The cy is the currency unit of the transaction,  default is [sero]()

```css
   {
   	from: sero.accounts[0],
   	to: sero.accounts[1],
   	value: 1000,
   	gas: 30000,
   	gasPrice: 5,
   	data: [],
   	pairs: [],
   	abi: [],
   	cy: 'sero',
   	dy: false
   }
```


### 6. transaction info

The showed transaction info add Zero knowledge proof
```css
/**
 * Formats the output of a transaction to its proper values
 *
 * @method outputTransactionFormatter
 * @param {Object} tx
 * @returns {Object}
*/
var outputTransactionFormatter = function (tx){
    if(tx.blockNumber !== null)
        tx.blockNumber = utils.toDecimal(tx.blockNumber);
    if(tx.transactionIndex !== null)
        tx.transactionIndex = utils.toDecimal(tx.transactionIndex);
    tx.nonce = utils.toDecimal(tx.nonce);
    tx.gas = utils.toDecimal(tx.gas);
    tx.gasPrice = utils.toBigNumber(tx.gasPrice);
    tx.value = utils.toBigNumber(tx.value);

    if (tx.stx.Desc_Os) {
        var in_os = []
        var out_os = []
        tx.stx.Desc_Os.forEach(function (e) {
            var curreny = utils.bytesToString(utils.hexToBytes(utils.fromDecimal(utils.toBigNumber(e.Currency))));
            if (e.Ins) {
                e.Ins.forEach(function (i) {
                    var in_o = {};
                    in_o['currency'] = curreny;
                    in_o['root'] = i
                    in_os.push(in_o)
                });
            }
            if (e.Outs) {
                e.Outs.forEach(function (o) {
                    var out_o = {};
                    out_o['currency'] = curreny;
                    out_o['value'] = o.Value;
                    out_o['addr'] = o.Addr;
                    out_os.push(out_o)
                });
            }

        });
        tx.In_Os = in_os;
        tx.Out_Os = out_os;
    }
    tx.Desc_Zs = tx.stx.Desc_Zs;
    delete tx.stx
    return tx;
};
```
### 6. add isMineOAddr 

Add a method in sero.js ,determine if it is your own one-time address

```css
 var isMineOAddr = new Method({
        name: 'isMineOAddr',
        call: 'sero_isMineOAddr',
        params: 1,
        inputFormatter: [formatters.inputAddressFormatter]
    });
```


## Building (gulp)

```bash
npm run-script build
```

## License

[LGPL-3.0+](LICENSE.md) © 2015 Contributors
