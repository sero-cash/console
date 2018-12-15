# console web3.js

This is the Sero compatible JavaScript API which  base on [ethereum/web3.js](https://github.com/ethereum/web3.js)  version with  [v0.20.6 latest maintenance release](https://github.com/ethereum/web3.js/releases/tag/v0.20.6) .It is used by gero client as embed js that
can interract with the Sero blockchain. It alse can be as a reference for dApps to interract with the Sero blockchain.

## Differences from web3.js

#### 1. value of unit

The minimum unit of Sero is ta, and one sero is equivalent to 10 to the 9th power ta.
```css

var unitMap = {
    'noether':      '0',
    'ta':           '1',
    'kta':          '1000',
    'Kta':          '1000',
    'babbage':      '1000',
    'femtoether':   '1000',
    'mta':          '1000000',
    'Mta':          '1000000',
    'lovelace':     '1000000',
    'picoether':    '1000000',
    'gta':          '1000000000',
    'Gta':          '1000000000',
    'shannon':      '1000000000',
    'nanosero':     '1000000000',
    'nano':         '1000000000',
    'szabo':        '1000000000000',
    'microsero':    '1000000000000',
    'micro':        '1000000000000',
    'finney':       '1000000000000000',
    'millisero':    '1000000000000000',
    'milli':        '1000000000000000',
    'sero':         '1000000000000000000',
    'SERO':         '1000000000000000000',
    'ksero':        '1000000000000000000000',
    'gsero':        '1000000000000000000000',
    'msero':        '1000000000000000000000000',
    'gsero':        '1000000000000000000000000000',
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

```css

   /**
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
```css

    /**
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

### 3.contract data 

create or call smart contract,the address type params must convert to once address

```css

SolidityCoder.prototype.opParams = function (types, params,rand,sero,dy) {
    var solidityTypes = this.getSolidityTypes(types);
    var addressParams = solidityTypes.map(function (solidityType, index) {
        if (solidityType instanceof SolidityTypeAddress){
            return  solidityType.address(params[index], types[index],false)
        }else{
            return
        }
    })[0]||'';
    if (addressParams){
        if (utils.isArray(addressParams)){
        }else{
            addressParams = [addressParams];
        }
    }else {
        addressParams = [];
    }

    var convertResult =  sero.convertAddressParams(rand,addressParams,dy);
    rand = convertResult.rand;
    if (addressParams.length >0 ){
        var addrMap = convertResult.addr;
         var convertParams =  solidityTypes.map(function (solidityType, index) {
            return  solidityType.convertAddress(params[index], types[index],addrMap)
        });
         params = convertParams;
    }
    var result ={};
    result.params = params;
    result.rand = rand;
    return result;

};

```

the create smart contract data:
```css

    var rand ="0x";
    var argsResult = opArgs(this.abi,args,rand,this.sero,false);
    args = argsResult.params;
    rand = argsResult.rand;
    var bytes = encodeConstructorParams(this.abi, args);
    options.data += bytes;
    var prefix = encodeConstructorPrefix(this.abi,args,rand);
    options.data = prefix +options.data.substr(2);
        
```

the call smart contract data:
```css

    var rand = utils.bytesToHex(utils.base58ToBytes(this._address).slice(0,16));
    var convertResult = coder.opParams(this._inputTypes,args,rand,this._sero,dy);
    args = convertResult.params;
    options.data = coder.addressPrefix(this._inputTypes,args,rand) + this.signature()+ coder.encodeParams(this._inputTypes, args);

```



### 5. sendTransaction params

The method of SendTransaction Json params add cy、dy、catg,tkt key. The dy only be used  when call contract that means whether to regenerate a one-time address. The cy is the currency unit of the transaction,  default is [sero]()
,the catg is the Ticket category and the tkt is the Ticket Id.

```css
   {
   	from: sero.accounts[0],
   	to: sero.accounts[1],
   	value: 1000,
   	gas: 30000,
   	gasPrice: 5,
   	data: [],
   	cy: 'sero',
   	dy: false,
   	catg: '',
   	tkt: ''
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
    if (tx.stx.Desc_O){
        tx.stx.Desc_O_Ins=tx.stx.Desc_O.Ins;
        var O_Outs=[];
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


### 7. add convertAddressParams 

Add a method in sero.js ,convert the address to once address with the given rand;

```css

    var convertAddressParams = new Method({
        name: 'convertAddressParams',
        call: 'sero_convertAddressParams',
        params: 3,
    });
    
```

### 7. add getFullAddress 

Add a method in sero.js ,get the full address with the vm short address;

```css

    var getFullAddress = new Method({
        name: 'getFullAddress',
        call: 'sero_getFullAddress',
        params: 1,
    });
    
```


## Building (gulp)

```bash
npm run-script build
```

## License

[LGPL-3.0+](LICENSE.md) © 2015 Contributors
