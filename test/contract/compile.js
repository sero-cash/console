const fs = require ('fs');
const solc = require ('solc');
const input = fs.readFileSync('HelloWorldContract.sol',"utf8");
const output = solc.compile(input.toString(), 1);

jsonInput= JSON.stringify({
    language: 'Solidity',
    sources: {
        'test.sol': {
            content: input.toString()
        }
    },
    settings: {
        optimizer: {
            enabled: true,
            runs: 200
        },
        outputSelection: {
            '*': {
                '': [ 'legacyAST' ],
                '*': [ 'abi', 'metadata', 'evm.legacyAssembly', 'evm.bytecode', 'evm.deployedBytecode', 'evm.methodIdentifiers', 'evm.gasEstimates' ]
            }
        }
    }
})

const result =solc.compileStandardWrapper(jsonInput)

console.log(result)
for (var contractName in output.contracts){
    console.log(contractName + ': ' + output.contracts[contractName].bytecode)
}
