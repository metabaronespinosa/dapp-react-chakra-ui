//https://web3js.readthedocs.io/en/v1.5.2/
import React, {
  useEffect,
  useState,
  createContext,
  SetStateAction
} from 'react'
import {
  ChakraProvider,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  // AlertDescription,
  CloseButton
} from '@chakra-ui/react'
import { Provider } from '../scripts/Provider'
import MenuTop from './MenuTop/MenuTop'
import Particles from 'react-particles-js'
import InteractionToken from './InteractionToken/InteractionToken'

import './App.scss'

export const ProviderContext = createContext({
  provider: {} as Provider,
  setProvider: {} as React.Dispatch<SetStateAction<Provider>>,
})

const NETWORK_ID = '5777'

const App = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('')
  const [provider, setProvider] = useState<Provider>(new Provider())
  const value = { provider, setProvider }

  // Will move this code to an external custom hook
  useEffect(() => {
    window.ethereum.on('networkChanged', (networkId: string) => {
      if (networkId === NETWORK_ID)
        setError('')
      if (networkId !== NETWORK_ID)
        setError('Wrong network...')
    })

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      // Load new account
      console.log('accountsChanges', accounts)
    })
  }, [])

  useEffect(() => {
    setIsConnected(false)

    provider.loadContracts()
      .then(() => setIsConnected(true))
      .catch((err) => setError(err.message))
  }, [provider])

  return <Flex
    style={{ height: '100vh' }}
    flexDirection='column'
    alignItems='center'
  >
    <Particles
      className='particles'
      params={{
        particles: {
          number: {
            value: 50,
          },
          size: {
            value: 3,
          },
        },
        interactivity: {
          events: {
            onhover: {
              enable: true,
              mode: 'repulse',
            },
          },
        },
      }}
    />
    {isConnected ? (
      <ProviderContext.Provider value={value}>
        <ChakraProvider>
          <MenuTop />
          <InteractionToken />
        </ChakraProvider>
      </ProviderContext.Provider>
    ) : null}
    {error !== '' && <Alert status='error'>
        <AlertIcon />
        <AlertTitle mr={2}>{error}</AlertTitle>
        {/* <AlertDescription>Your Chakra experience may be degraded.</AlertDescription> */}
        <CloseButton
          position='absolute'
          right='8px'
          top='8px'
          onClick={() => setError('')}
        />
      </Alert>}
  </Flex>
}

export default App
