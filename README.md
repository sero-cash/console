Ethereum JavaScript API
Join the chat at https://gitter.im/ethereum/web3.js

This is the Ethereum compatible JavaScript API which implements the Generic JSON RPC spec. It's available on npm as a node module, for Bower and component as embeddable scripts, and as a meteor.js package.

NPM version Build Status dependency status dev dependency status Coverage Status Stories in Ready

You need to run a local Ethereum node to use this library.

Documentation

Table of Contents
Installation
Node.js
Yarn
Meteor.js
As a Browser module
Usage
Migration from 0.13.0 to 0.14.0
Contribute!
Requirements
Building (gulp)
Testing (mocha)
Community
Other implementations
License
Installation
Node.js
npm install web3
Yarn
yarn add web3
Meteor.js
meteor add ethereum:web3
As a Browser module
CDN

<script src="https://cdn.jsdelivr.net/gh/ethereum/web3.js/dist/web3.min.js"></script>
Bower

bower install web3
Component

component install ethereum/web3.js
Include web3.min.js in your html file. (not required for the meteor package)
Usage
Use the web3 object directly from the global namespace:

console.log(web3); // {eth: .., shh: ...} // It's here!
Set a provider (HttpProvider):

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // Set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
Set a provider (HttpProvider using HTTP Basic Authentication):

web3.setProvider(new web3.providers.HttpProvider('http://' + BasicAuthUsername + ':' + BasicAuthPassword + '@localhost:8545'));
There you go, now you can use it:

var coinbase = web3.eth.coinbase;
var balance = web3.eth.getBalance(coinbase);
You can find more examples in the example directory.

Migration from 0.13.0 to 0.14.0
web3.js version 0.14.0 supports multiple instances of the web3 object. To migrate to this version, please follow the guide:

-var web3 = require('web3');
+var Web3 = require('web3');
+var web3 = new Web3();
Contribute!
Requirements
Node.js
npm
# On Linux:
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
sudo apt-get install nodejs-legacy
Building (gulp)
npm run-script build
Testing (mocha)
npm test
Community
Gitter
Forum
Other implementations
Python Web3.py
Haskell hs-web3
Java web3j
Scala web3j-scala
Purescript purescript-web3
PHP web3.php
PHP ethereum-php
License
LGPL-3.0+ © 2015 Contributors
