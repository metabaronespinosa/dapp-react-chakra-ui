//https://web3js.readthedocs.io/en/v1.5.2/
import React, {
  useEffect,
  useState,
  createContext,
  SetStateAction
} from 'react'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import { Provider } from '../scripts/Provider'
import MenuTop from './MenuTop/MenuTop'
import Particles from 'react-particles-js'
import InteractionToken from './InteractionToken/InteractionToken'

import './App.scss'

export const ProviderContext = createContext({
  provider: {} as Provider,
  setProvider: {} as React.Dispatch<SetStateAction<Provider>>,
})

const App = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState('Connect your Metamask')
  const [provider, setProvider] = useState<Provider>(new Provider())
  const value = { provider, setProvider }

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
    ) : (
      <div className='error_front'>{error}</div>
    )}
  </Flex>
}

export default App
