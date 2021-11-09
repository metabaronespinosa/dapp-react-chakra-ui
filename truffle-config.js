require('babel-register')
require('babel-polyfill')

const HDWalletProvider = require('@truffle/hdwallet-provider')

const provider = () => new HDWalletProvider('d83ced623799f4727f7433a9771ad48e528728c0f9c89ab3c411f92037551e63', 'http://localhost:7545')

module.exports = {
    networks:{
        development: {
            provider,
            network_id: 5777
        }
    },
    contracts_directory: './src/contracts/',
    contracts_build_directory: './src/truffle_abis/',
    compilers: {
        solc: {
            version: '^0.5.0',
            optimizer: {
                enabled: true,
                runs:200
            }
        }
    }
}
