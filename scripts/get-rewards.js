const DecentralBank = artifacts.require('DecentralBank')

module.exports = async function getRewards(callback){
  const decentralBank = await DecentralBank.deployed()

  const response = await decentralBank.getUserRewards()

  console.log('Rewards: ', web3.utils.fromWei(response.toString(), 'ether'))

  callback()
}
