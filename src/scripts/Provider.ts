import { ethers } from 'ethers'
import { ExternalProvider } from '@ethersproject/providers/lib/web3-provider'
import Web3 from 'web3'

import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'

import { sleep } from './utils'

declare global {
  interface Window {
    ethereum: any
  }
}

interface ExternalProviderExtended extends ExternalProvider {
  networkVersion?: string
}

export class Provider {
  private provider: ethers.providers.Web3Provider | null
  private _isConnected = false
  private contracts: {
    tether: ethers.Contract | null
    rwd: ethers.Contract | null
    decentralBank: ethers.Contract | null
  } = {
    tether: null,
    rwd: null,
    decentralBank: null
  }

  public constructor() {
    this.provider = window.ethereum 
      ? new ethers.providers.Web3Provider(window.ethereum)
      : null
  }

  /**
   * Load ContractObject
   * ABI (Application Binary Interface)
   * @returns
   */
  public async loadContracts() {
    return new Promise((resolve, rejected) => {
      const _rejected = () => {
        rejected({
          message: 'Metamask not loaded...'
        })
      }

      if (!this.provider) {
        _rejected()
        return
      }

      const signer = this.provider.getSigner()

      const loadContractsPromise = async (
        retry_ws: number,
        resolve: (success: boolean) => void,
        rejected: (reason?: any) => void
      ) => {
        // NetID Can be a little bit long to load
        await sleep(1 * 1000 * 0.3)

        if (!this.provider) {
          _rejected()

          return
        }

        const providerExtended = this.provider.provider as ExternalProviderExtended
        const netID = providerExtended.networkVersion

        console.debug('netID', netID)
        if (!netID) {
          retry_ws++

          if (retry_ws < 4) {
            setTimeout(() => {
              loadContractsPromise(retry_ws, resolve, rejected)
            }, 300)
          } else {
            rejected({
              message: 'Did you start Ganache?',
            })
          }
        } else {
          const tetherData = Tether.networks[netID as keyof typeof Tether.networks]
          const rwdData = RWD.networks[netID as keyof typeof RWD.networks]
          const decentralBankData = DecentralBank.networks[netID as keyof typeof DecentralBank.networks]

          if (tetherData) {
            this.contracts.tether = new ethers.Contract(tetherData.address, Tether.abi, signer)
          }

          if (rwdData) {
            this.contracts.rwd = new ethers.Contract(rwdData.address, RWD.abi, signer)
          }

          if (decentralBankData) {
            this.contracts.decentralBank = new ethers.Contract(decentralBankData.address, DecentralBank.abi, signer)
          }

          this._isConnected = true

          resolve(true)
        }
      }

      loadContractsPromise(0, resolve, rejected)
    })
  }

  public async getTether(): Promise<{ balance: string; symbol: string } | null> {
    if (!this.contracts.tether) return null

    const account = await this.getAccountNumber()
    const accountBalance = await this.contracts.tether.balanceOf(account)

    const balance = Web3.utils.fromWei(accountBalance.toString(), 'ether')
    const symbol = await this.contracts.tether.symbol()

    return {
      balance,
      symbol
    }
  }

  public async getStakingRewards(): Promise<{ balance: string; symbol: string } | null> {
    if (!this.contracts.decentralBank || !this.contracts.rwd) return null

    const account = await this.getAccountNumber()
    const rewards = await this.contracts.decentralBank.rewardsBalance(account)

    const balance = Web3.utils.fromWei(rewards.toString(), 'ether')
    const symbol = await this.contracts.rwd.symbol()

    return {
      balance,
      symbol
    }
  }

  public async getRWD(): Promise<{ balance: string; symbol: string } | null> {
    if (!this.contracts.rwd) return null

    const account = await this.getAccountNumber()
    const accountBalance = await this.contracts.rwd.balanceOf(account)

    const balance = Web3.utils.fromWei(accountBalance.toString(), 'ether')
    const symbol = await this.contracts.rwd.symbol()

    return {
      balance,
      symbol
    }
  }

  public async getStakingBalance(): Promise<{ balance: string; symbol: string } | null> {
    if (!this.contracts.tether || !this.contracts.decentralBank) return null

    const account = await this.getAccountNumber()
    const accountBalance = await this.contracts.decentralBank.stakingBalance(account)
    const balance = Web3.utils.fromWei(accountBalance.toString(), 'ether')

    const symbol = await this.contracts.tether.symbol()

    return {
      balance,
      symbol,
    }
  }

  public async stakeTokens(amount: string) {
    if (!this.contracts.tether || !this.contracts.decentralBank) return

    amount = Web3.utils.toWei(amount, 'ether')

    const transferResultApprove = await this.contracts.tether.approve(this.contracts.decentralBank.address, amount)
    console.debug('approve::transferResult', transferResultApprove)
    if (!this.contracts.decentralBank) return

    const transferResultDepositToken = await this.contracts.decentralBank.depositToken(amount)
    console.debug('depositToken::transferResultDepositToken', transferResultDepositToken)
  }

  public async unstakeTokens() {
    if (!this.contracts.decentralBank) return

    console.debug(this.contracts.decentralBank?.address)

    const transferResult = await this.contracts.decentralBank.unstakeTokens()
    console.debug('unstakeTokens::transferResult', transferResult)
  }

  public async getAccountNumber(): Promise<string> {
    if (!this.provider) {
      return ''
    }

    const accounts = await this.provider.listAccounts()
    return accounts[0]
  }

  public async getAccountBalance(): Promise<number> {
    if (!this.provider) {
      return 0
    }

    const account = await this.getAccountNumber()
    const balanceBig = await this.provider.getBalance(account)

    return parseFloat(ethers.utils.formatEther(balanceBig))
  }

  public get isConnected() {
    return this._isConnected
  }
}
