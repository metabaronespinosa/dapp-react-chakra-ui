
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

import { ExternalProviderExtended } from '../../scripts/Provider'

const NETWORK_ID = '5777'

export const useWeb3 = () => {
  const [provider, setProvider] = useState<ExternalProviderExtended | null>(null)
  const [currentAccount, setCurrentAccount] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string>('')
  const [network, setNetwork] = useState<string | undefined>(undefined)

  useEffect(() => {
    let interval: NodeJS.Timer
    let attempts = 0

    const fn = () => {
      const { provider } = new ethers.providers.Web3Provider(window.ethereum)
      const { networkVersion } = provider as ExternalProviderExtended

      setProvider(provider as ExternalProviderExtended)

      return networkVersion
    }

    interval = setInterval(() => {
      if (!fn()) {
        if (attempts === 5) {
          clearInterval(interval)

          setError('No network available...')

          setLoaded(false)
        }

        fn()

        attempts++
      } else {
        clearInterval(interval)
        
        setNetwork(fn())
      }
    }, 300)
  }, [])

  useEffect(() => {
    if (network && network === NETWORK_ID) {
      window.ethereum.on('networkChanged', (networkId: string) => {
        if (networkId === NETWORK_ID) {
          setError('')

          setLoaded(true)
        } else if (networkId !== NETWORK_ID) {
          setError('Wrong network...')

          setLoaded(false)
        }
      })

      window.ethereum.on('accountsChanged', ({ 0: account }: string[]) => {
        setCurrentAccount(account)
      })

      setError('')

      setLoaded(true)
    } else {
      setError('Wrong network...')

      setLoaded(false)
    }
  }, [network])

  return {
    provider,
    loading: !network && error === '', 
    currentAccount,
    error,
    loaded
  }
}
