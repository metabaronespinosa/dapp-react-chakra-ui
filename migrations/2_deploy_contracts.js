//const Token = artifacts.require('Token')
const Tether = artifacts.require('Tether')
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')

module.exports = async function(deployer, network, accounts){
    await deployer.deploy(Tether)
    const tether = await Tether.deployed()

    await deployer.deploy(RWD)
    const rwd = await RWD.deployed()

    console.log('RWD', rwd.address)
    console.log('TETHER', tether.address)
    console.log(accounts)

    await deployer.deploy(DecentralBank, rwd.address, tether.address)
    const decentralBank = await DecentralBank.deployed()

    //console.debug("decentralBank.address::", decentralBank.address)
    await rwd.transfer(decentralBank.address, web3.utils.toWei('40', 'ether'))
    await tether.transfer(accounts[0], web3.utils.toWei('60', 'ether'))
}
